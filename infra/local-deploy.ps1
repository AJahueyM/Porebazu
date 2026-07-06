param(
    [string]$env = "prod",
    [string]$deployLocation = "westus2"
)

$sshKeyPath = "~\.ssh\id_rsa.pub"
if (-not (Test-Path $sshKeyPath)) {
    Write-Error "SSH public key not found at $sshKeyPath. Please generate an SSH key pair and place the public key at this location."
    exit 1
}

sshPublicKey = Get-Content $sshKeyPath -Raw

az deployment sub create --name "infra-deploy" --location "$deployLocation" --template-file "main.bicep" --parameters "params/$env.bicepparam" --parameters adminPublicKey="$sshPublicKey"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Deployment failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}