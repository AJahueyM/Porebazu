param(
    [string]$env = "prod",
    [string]$deployLocation = "westus2"
)

az deployment sub create --name "infra-deploy" --location "$deployLocation" --template-file "main.bicep" --parameters "params/$env.bicepparam"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Deployment failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}