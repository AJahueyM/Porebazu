@export()
type RegionName = {
  name: string
  shortHand: string
}

@export()
var regions RegionName[] = [
  {
    name: 'westus2'
    shortHand: 'wus2'
  }
  {
    name: 'mexicocentral'
    shortHand: 'mexc'
  }
]

@export()
func getRegionShortHand(regionName string) string => filter(regions, (region) => region.name == regionName)[0].shortHand
