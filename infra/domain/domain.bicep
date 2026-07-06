@description('The name of the DNS zone to be created.  Must have at least 2 segments, e.g. hostname.org')
param zoneName string

param aRecordsConfig aRecordConfig[] = []
param cNameRecordsConfig cNameRecordConfig[] = []


@export()
type aRecordConfig = {
  name: string
  properties: resourceInput<'Microsoft.Network/dnsZones/A@2023-07-01-preview'>.properties
}

@export()
type cNameRecordConfig = {
  name: string
  properties: resourceInput<'Microsoft.Network/dnsZones/CNAME@2023-07-01-preview'>.properties
}

resource zone 'Microsoft.Network/dnsZones@2023-07-01-preview' = {
  name: zoneName
  location: 'global'
  properties: {
    zoneType: 'Public'
  }
}

resource aRecord 'Microsoft.Network/dnsZones/A@2023-07-01-preview' = [for aRecord in aRecordsConfig: {
  name: aRecord.name
  parent: zone
  properties: aRecord.properties
}]

resource cNameRecord 'Microsoft.Network/dnsZones/CNAME@2023-07-01-preview' = [for cNameRecord in cNameRecordsConfig: {
  name: cNameRecord.name
  parent: zone
  properties: cNameRecord.properties
}]


output nameServers array = zone.properties.nameServers
