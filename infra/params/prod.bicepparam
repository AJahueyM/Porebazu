using '../main.bicep'

param locations = [
  'westus2'
  'mexicocentral'
]

param storageLocation = locations[0]
param headscaleVersion = 'latest'
