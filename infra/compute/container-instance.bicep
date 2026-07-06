param name string
param location string
param containers containersConfig
param restartPolicy  'Always' | 'Never' | 'OnFailure'
param ports portsConfig
param imageRegistryCredentials imageRegistryCredentialsConfig?
param volumes volumesConfig?
param dnsNameLabel string?

@export()
type containersConfig = resourceInput<'Microsoft.ContainerInstance/containerGroups@2026-06-01-preview'>.properties.containers
@export()
type portsConfig = resourceInput<'Microsoft.ContainerInstance/containerGroups@2026-06-01-preview'>.properties.ipAddress.ports
@export()
type imageRegistryCredentialsConfig = resourceInput<'Microsoft.ContainerInstance/containerGroups@2026-06-01-preview'>.properties.imageRegistryCredentials
@export()
type volumesConfig = resourceInput<'Microsoft.ContainerInstance/containerGroups@2026-06-01-preview'>.properties.volumes

resource containerGroup 'Microsoft.ContainerInstance/containerGroups@2026-06-01-preview' = {
  name: name
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    containers: containers
    osType: 'Linux'
    restartPolicy: restartPolicy
    ipAddress: {
      type: 'Public'
      ports: ports
      dnsNameLabel: dnsNameLabel
    }
    imageRegistryCredentials: imageRegistryCredentials
    volumes: volumes
  }
}

output name string = containerGroup.name
output resourceId string = containerGroup.id
output ipv4Address string = containerGroup.properties.ipAddress.ip
output identityPrincipalId string = containerGroup.identity.principalId

