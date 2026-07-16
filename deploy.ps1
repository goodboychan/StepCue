# StepCue Google Cloud Deployment Script (PowerShell)
# This script automates building and deploying StepCue to Google Cloud Run using Cloud Build.

$ErrorActionPreference = "Stop"

# Helper function for colored printing
function Write-Header ($text) {
    Write-Host "`n=== $text ===" -ForegroundColor Cyan
}

function Write-Success ($text) {
    Write-Host "[SUCCESS] $text" -ForegroundColor Green
}

function Write-Info ($text) {
    Write-Host "[INFO] $text" -ForegroundColor Gray
}

function Write-WarningMsg ($text) {
    Write-Host "[WARNING] $text" -ForegroundColor Yellow
}

function Write-ErrorMsg ($text) {
    Write-Host "[ERROR] $text" -ForegroundColor Red
}

Write-Header "StepCue Google Cloud Run Deployment"

# 1. Check if gcloud CLI is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-ErrorMsg "gcloud CLI was not found on your system."
    Write-Host "Please install the Google Cloud SDK first. You can download it here:" -ForegroundColor Yellow
    Write-Host "https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# 2. Check if user is authenticated
Write-Info "Checking Google Cloud authentication..."
$oldPreference = $ErrorActionPreference
$ErrorActionPreference = "SilentlyContinue"
$account = $null
try {
    $account = gcloud config get-value account 2>$null
} catch {}
$ErrorActionPreference = $oldPreference

if (-not $account -or $account -eq "(unset)") {
    Write-WarningMsg "No active Google Cloud account detected. Initiating login..."
    gcloud auth login
} else {
    Write-Success "Authenticated as: $account"
}

# 3. Retrieve or ask for Project ID
$oldPreference = $ErrorActionPreference
$ErrorActionPreference = "SilentlyContinue"
$projectId = $null
try {
    $projectId = gcloud config get-value project 2>$null
} catch {}
$ErrorActionPreference = $oldPreference

if (-not $projectId -or $projectId -eq "(unset)") {
    Write-WarningMsg "No Google Cloud project is currently set in your active gcloud context."
    $projectId = Read-Host "Please enter your GCP Project ID"
    if ([string]::IsNullOrWhiteSpace($projectId)) {
        Write-ErrorMsg "Project ID cannot be empty."
        exit 1
    }
    gcloud config set project $projectId
} else {
    $response = Read-Host "Deploy to the currently active project '$projectId'? (Y/n)"
    if ($response -ne "" -and $response -notmatch "^[yY](es)?$") {
        $projectId = Read-Host "Please enter the GCP Project ID you'd like to use"
        if ([string]::IsNullOrWhiteSpace($projectId)) {
            Write-ErrorMsg "Project ID cannot be empty."
            exit 1
        }
        gcloud config set project $projectId
    }
}
Write-Success "Using GCP Project: $projectId"

# 4. Settings and Constants
$AR_REGION = "us-central1"
$RUN_REGION = "us-central1"
$AR_REPO = "stepcue-repo"
$SERVICE_NAME = "stepcue"

# 5. Enable Google Cloud APIs
Write-Header "Enabling Google Cloud APIs"
Write-Info "Enabling Artifact Registry, Cloud Build, and Cloud Run APIs..."
gcloud services enable `
    artifactregistry.googleapis.com `
    cloudbuild.googleapis.com `
    run.googleapis.com `
    --async

Write-Success "API enablement requested. This may take a moment to fully activate."

# 6. Setup Artifact Registry Repository
Write-Header "Configuring Artifact Registry"
Write-Info "Checking if Artifact Registry repository '$AR_REPO' exists in region '$AR_REGION'..."

$oldPreference = $ErrorActionPreference
$ErrorActionPreference = "SilentlyContinue"
$repoExists = $null
try {
    $repoExists = gcloud artifacts repositories describe $AR_REPO --location=$AR_REGION --format="value(name)" 2>$null
} catch {
    # If the repository is not found, $repoExists will remain null
}
$ErrorActionPreference = $oldPreference

if (-not $repoExists) {
    Write-Info "Creating Artifact Registry Docker repository '$AR_REPO' in '$AR_REGION'..."
    gcloud artifacts repositories create $AR_REPO `
        --repository-format=docker `
        --location=$AR_REGION `
        --description="Docker repository for StepCue Next.js application"
    Write-Success "Repository '$AR_REPO' created successfully."
} else {
    Write-Success "Repository '$AR_REPO' already exists."
}

# 7. Submit Cloud Build
Write-Header "Submitting Build and Deploying"
Write-Info "Uploading code and building container in the cloud..."
Write-Info "This step will package your local project files, build the Docker image, and deploy to Cloud Run."

# Generate a random commit-like string if git is not available or has no commits
$commitSha = "manual-build"
if (Get-Command git -ErrorAction SilentlyContinue) {
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = "SilentlyContinue"
    $gitSha = $null
    try {
        $gitSha = git rev-parse --short HEAD 2>$null
    } catch {}
    $ErrorActionPreference = $oldPreference
    if ($gitSha) { $commitSha = $gitSha }
}

gcloud builds submit --config=cloudbuild.yaml `
    --substitutions="_AR_REGION=$AR_REGION,_AR_REPO=$AR_REPO,_SERVICE_NAME=$SERVICE_NAME,_RUN_REGION=$RUN_REGION,COMMIT_SHA=$commitSha"

Write-Header "Deployment Completed!"
Write-Success "Your application has been deployed successfully to Google Cloud Run."
Write-Host "`nTo view your deployed app, find the Service URL in the output above or run:" -ForegroundColor Green
Write-Host "  gcloud run services describe $SERVICE_NAME --region=$RUN_REGION --format='value(status.url)'" -ForegroundColor Cyan
Write-Host "`nNote: If your application requires environment variables (like GEMINI_API_KEY), you can set them using the Google Cloud Console or via gcloud:" -ForegroundColor Yellow
Write-Host "  gcloud run services update $SERVICE_NAME --region=$RUN_REGION --set-env-vars='GEMINI_API_KEY=your_key_here'" -ForegroundColor Cyan
