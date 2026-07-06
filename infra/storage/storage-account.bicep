param location string
param name string
param sku storageAccountSkuConfig
param kind storageAccountKindConfig = 'StorageV2'
param fileSharesProperties filesharePropertiesConfig[]?
param storageAccountProperties storageAccountPropertiesConfig = {
  accessTier: 'Hot'
  isLocalUserEnabled: false
  allowSharedKeyAccess: true
  allowSharedKeyAccessForServices: {
    blob: {enabled: false}
    queue: {enabled: false}
    table: {enabled: false}
    file: {enabled: true}
  }
}

@export()
type storageAccountSkuConfig = resourceInput<'Microsoft.Storage/storageAccounts@2026-04-01'>.sku
@export()
type storageAccountKindConfig = resourceInput<'Microsoft.Storage/storageAccounts@2026-04-01'>.kind
@export()
type storageAccountPropertiesConfig = resourceInput<'Microsoft.Storage/storageAccounts@2026-04-01'>.properties
@export()
type filesharePropertiesConfig = {
  name: string
  properties: resourceInput<'Microsoft.Storage/storageAccounts/fileServices/shares@2026-04-01'>.properties
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2026-04-01' = {
  name: name
  location: location
  sku: sku
  kind: kind
  properties: storageAccountProperties
}

resource fileService 'Microsoft.Storage/storageAccounts/fileServices@2026-04-01' = {
  name: 'default'
  parent: storageAccount
}

resource fileSharesResource 'Microsoft.Storage/storageAccounts/fileServices/shares@2026-04-01' = [for fileShare in fileSharesProperties!: {
  name: fileShare.name
  parent: fileService
  properties: fileShare.properties
}]

output name string = storageAccount.name
output resourceId string = storageAccount.id
