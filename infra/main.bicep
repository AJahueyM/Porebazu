targetScope = 'subscription'
import { getRegionShortHand } from './params/shorthand.bicep'

@description('The locations where the resource groups will be created. The first location will be considered the primary location.')
param locations string[]

param headscaleLocation string = locations[0]
param vmSize string = 'Standard_B1s'

@secure()
param adminPublicKey string

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

module headscaleVm 'headscale/headscale.bicep' = [
  for (location, index) in locations: {
    name: 'headscale-${getRegionShortHand(location)}'
    scope: pzuResourceGroups[index]
    params: {
      location: location
      vmSize: vmSize
      adminPublicKey: adminPublicKey
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
          CNAMERecord: { cname: headscaleVm[0].outputs.fqdn }
        }
      }
    ]
  }
}
