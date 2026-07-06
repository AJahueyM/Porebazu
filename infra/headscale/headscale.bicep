import { getRegionShortHand } from '../params/shorthand.bicep'

param location string
param deployHeadscale bool = false
param vmSize string = 'Standard_B1s'
param adminUsername string = 'azureuser'

@secure()
param adminPublicKey string

var dnsNameLabel = 'headscale-pzu'

var headscaleCloudInit = loadTextContent('cloud-init-headscale.yml')
var tailscaleCloudInit = loadTextContent('cloud-init-tailscale.yml')

var headscaleNsgRules = [
  {
    name: 'Allow-HTTPS'
    properties: {
      priority: 1010
      direction: 'Inbound'
      access: 'Allow'
      protocol: 'Tcp'
      sourcePortRange: '*'
      destinationPortRange: '443'
      sourceAddressPrefix: '*'
      destinationAddressPrefix: '*'
    }
  }
  {
    name: 'Allow-HTTP'
    properties: {
      priority: 1020
      direction: 'Inbound'
      access: 'Allow'
      protocol: 'Tcp'
      sourcePortRange: '*'
      destinationPortRange: '80'
      sourceAddressPrefix: '*'
      destinationAddressPrefix: '*'
    }
  }
  {
    name: 'Allow-Tailscale-UDP'
    properties: {
      priority: 1050
      direction: 'Inbound'
      access: 'Allow'
      protocol: 'Udp'
      sourcePortRange: '*'
      destinationPortRange: '41641'
      sourceAddressPrefix: '*'
      destinationAddressPrefix: '*'
    }
  }
]

var tailscaleNsgRules = [
  {
    name: 'Allow-Tailscale-UDP'
    properties: {
      priority: 1010
      direction: 'Inbound'
      access: 'Allow'
      protocol: 'Udp'
      sourcePortRange: '*'
      destinationPortRange: '41641'
      sourceAddressPrefix: '*'
      destinationAddressPrefix: '*'
    }
  }
]

module vm '../compute/vm.bicep' = {
  name: 'pzu-vm-${getRegionShortHand(location)}'
  params: {
    name: 'pzu-vm-${getRegionShortHand(location)}'
    location: location
    vmSize: vmSize
    adminUsername: adminUsername
    adminPublicKey: adminPublicKey
    dnsNameLabel: deployHeadscale ? dnsNameLabel : 'pzu-ts-${getRegionShortHand(location)}'
    customData: base64(deployHeadscale ? headscaleCloudInit : tailscaleCloudInit)
    nsgRules: deployHeadscale ? headscaleNsgRules : tailscaleNsgRules
  }
}

output fqdn string = vm.outputs.fqdn
output vmName string = vm.outputs.vmName
