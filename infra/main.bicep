targetScope = 'subscription'
import { getRegionShortHand } from './params/shorthand.bicep'
import { headscaleConfigFileShareName, headscaleDataFileShareName, headplaneFileShareName, tailscaleDataFileShareName } from './headscale/headscale.bicep'

@description('The locations where the resource groups will be created. The first location will be considered the primary location.')
param locations string[]

param headscaleLocation string = locations[0]
param headscaleVersion string

param storageLocation string

param resourceGroupPrefix string = 'porebazu'

var resourceGroupNames = [
  for location in locations: { name: '${resourceGroupPrefix}-${getRegionShortHand(location)}', location: location }
]
resource pzuResourceGroups 'Microsoft.Resources/resourceGroups@2025-04-01' = [
  for (rg, index) in resourceGroupNames: {
    name: rg.name
    location: rg.location
  }
]

var headscaleConfigFileShares = [
    {
      name: '${headscaleConfigFileShareName}-${getRegionShortHand(headscaleLocation)}'
    }
    {
      name: '${headscaleDataFileShareName}-${getRegionShortHand(headscaleLocation)}'
    }
    {
      name: '${headplaneFileShareName}-${getRegionShortHand(headscaleLocation)}'
    }
]

var tailscaleDataFileShares = [
  for location in locations: {
    name: '${tailscaleDataFileShareName}-${getRegionShortHand(location)}'
  }
]

var storageAccountFileShares = union(headscaleConfigFileShares, tailscaleDataFileShares)

module storageAccount 'storage/storage-account.bicep' = {
  name: 'pzu-sa-${getRegionShortHand(storageLocation)}'
  scope: pzuResourceGroups[0]
  params: {
    location: storageLocation
    name: 'pzusa${getRegionShortHand(storageLocation)}'
    sku: {
      name: 'Standard_LRS'
    }
    fileSharesProperties: [
      for fileShare in storageAccountFileShares: {
        name: fileShare.name
        properties: {
          shareQuota: 1
        }
      }
    ]
  }
}

module headscaleContainerInstance 'headscale/headscale.bicep' = [
  for (location, index) in locations: {
    name: 'headscale-${getRegionShortHand(location)}'
    scope: pzuResourceGroups[index]
    params: {
      location: location
      version: headscaleVersion
      storageAccountName: storageAccount.outputs.name
      storageAccountResourceGroupName: pzuResourceGroups[0].name
      headscaleUrl: 'https://headscale.porebazu.com'
      deployHeadscale: location == headscaleLocation
    }
  }
]

module domain 'domain/domain.bicep' = {
  name: 'pzu-domain-${getRegionShortHand(headscaleLocation)}'
  scope: resourceGroup(filter(resourceGroupNames, (rg) => rg.location == headscaleLocation)[0].name)
  params: {
    zoneName: 'porebazu.com'
    cNameRecordsConfig: [
      {
        name: 'headscale'
        properties: {
          TTL: 3600
          CNAMERecord: { cname: headscaleContainerInstance[0].outputs.fqdn }
        }
      }
    ]
  }
}
