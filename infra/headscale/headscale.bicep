import { getRegionShortHand } from '../params/shorthand.bicep'

param location string
param version string = 'latest'
param headplaneVersion string = 'latest'
param storageAccountName string
param storageAccountResourceGroupName string
param deployHeadscale bool = false
param tailscaleVersion string = 'latest'
param headscaleUrl string = ''

@export()
var headscaleDataFileShareName = 'headscale-data'
@export()
var headscaleConfigFileShareName = 'headscale-config'
@export()
var headplaneFileShareName = 'headplane'

@export()
var tailscaleDataFileShareName = 'tailscale-data'

var dnsNameLabel = 'headscale-pzu'

resource storageAccount 'Microsoft.Storage/storageAccounts@2026-04-01' existing = {
  name: storageAccountName
  scope: resourceGroup(storageAccountResourceGroupName)
}

module headscaleContainerInstance '../Compute/container-instance.bicep' = if (deployHeadscale) {
  name: 'headscale-container-${getRegionShortHand(location)}'
  params: {
    name: 'headscale-container-${getRegionShortHand(location)}'
    location: location
    dnsNameLabel: dnsNameLabel
    containers: [
      {
        name: 'headscale'
        properties: {
          image: 'headscale/headscale:${version}'
          resources: {
            requests: {
              cpu: any('0.5')
              memoryInGB: any('0.1')
            }
          }
          ports: [
            {
              protocol: 'TCP'
              port: 443
            }
            {
              protocol: 'TCP'
              port: 80
            }
          ]
          volumeMounts: [
            {
              name: '${headscaleConfigFileShareName}-${getRegionShortHand(location)}'
              mountPath: '/etc/headscale'
            }
            {
              name: '${headscaleDataFileShareName}-${getRegionShortHand(location)}'
              mountPath: '/var/lib/headscale'
            }
          ]
          command: [
            '/ko-app/headscale'
            'serve'
          ]
        }
      }
    ]
    restartPolicy: 'Always'
    ports: [
      {
        protocol: 'TCP'
        port: 443
      }
      {
        protocol: 'TCP'
        port: 80
      }
    ]
    volumes: [
      {
        name: '${headscaleConfigFileShareName}-${getRegionShortHand(location)}'
        azureFile: {
          shareName: '${headscaleConfigFileShareName}-${getRegionShortHand(location)}'
          storageAccountName: storageAccount.name
          storageAccountKey: storageAccount.listKeys('2026-04-01').keys[0].value
          readOnly: true
        }
      }
      {
        name: '${headscaleDataFileShareName}-${getRegionShortHand(location)}'
        azureFile: {
          shareName: '${headscaleDataFileShareName}-${getRegionShortHand(location)}'
          storageAccountName: storageAccount.name
          storageAccountKey: storageAccount.listKeys('2026-04-01').keys[0].value
          readOnly: false
        }
      }
    ]
  }
}

module headplaneContainerInstance '../compute/container-instance.bicep' = if (deployHeadscale) {
  name: 'headplane-container-${getRegionShortHand(location)}'
  params: {
    name: 'headplane-container-${getRegionShortHand(location)}'
    location: location
    containers: [
      {
        name: 'headplane'
        properties: {
          image: 'ghcr.io/tale/headplane:${headplaneVersion}'
          resources: {
            requests: {
              cpu: any('0.5')
              memoryInGB: any('1')
            }
          }
          ports: [
            {
              protocol: 'TCP'
              port: 3000
            }
          ]
          // command: [
          //   'sh'
          //   '-c'
          //   'mkdir -p /mnt/share/data && ln -sf /mnt/share/config.yml /etc/headplane/config.yaml && ln -sf /mnt/share/data /var/lib/headplane && node /app/build/server/index.js'
          // ]
          volumeMounts: [
            {
              name: '${headplaneFileShareName}-${getRegionShortHand(location)}'
              mountPath: '/etc/headplane'
            }
          ]
        }
      }
    ]
    restartPolicy: 'Always'
    ports: [
      {
        protocol: 'TCP'
        port: 3000
      }
    ]
    volumes: [
      {
        name: '${headplaneFileShareName}-${getRegionShortHand(location)}'
        azureFile: {
          shareName: '${headplaneFileShareName}-${getRegionShortHand(location)}'
          storageAccountName: storageAccount.name
          storageAccountKey: storageAccount.listKeys('2026-04-01').keys[0].value
          readOnly: false
        }
      }
    ]
  }
}

module tailscaleContainerInstance '../Compute/container-instance.bicep' = {
  name: 'ts-pzu-${getRegionShortHand(location)}'
  params: {
    name: 'ts-pzu-${getRegionShortHand(location)}'
    location: location
    containers: [
      {
        name: 'tailscale'
        properties: {
          image: 'tailscale/tailscale:${tailscaleVersion}'
          resources: {
            requests: {
              cpu: any('0.5')
              memoryInGB: any('0.5')
            }
          }
          ports: [
            { port: 41641, protocol: 'UDP' }
          ]
          volumeMounts: [
            {
              name: '${tailscaleDataFileShareName}-${getRegionShortHand(location)}'
              mountPath: '/var/lib/tailscale'
            }
          ]
          environmentVariables: [
            {
              name: 'TS_STATE_DIR'
              value: '/var/lib/tailscale'
            }
            {
              name: 'TS_EXTRA_ARGS'
              value: '--login-server=${headscaleUrl} --advertise-exit-node'
            }
            {
              name: 'TS_USERSPACE'
              value: 'true'
            }
            {
              name: 'TS_HOSTNAME'
              value: 'pzu-exit-${getRegionShortHand(location)}'
            }
          ]
        }
      }
    ]
    restartPolicy: 'Always'
    ports: [
      { port: 41641, protocol: 'UDP' }
    ]
    volumes: [
      {
        name: '${tailscaleDataFileShareName}-${getRegionShortHand(location)}'
        azureFile: {
          shareName: '${tailscaleDataFileShareName}-${getRegionShortHand(location)}'
          storageAccountName: storageAccount.name
          storageAccountKey: storageAccount.listKeys('2026-04-01').keys[0].value
          readOnly: false
        }
      }
    ]
  }
}

output fqdn string = deployHeadscale ? '${dnsNameLabel}.${location}.azurecontainer.io' : ''
output tailscaleName string = tailscaleContainerInstance.outputs.name
