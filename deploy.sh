#!/usr/bin/env bash
# StepCue Google Cloud Deployment Script (Bash)
# This script automates building and deploying StepCue to Google Cloud Run using Cloud Build.

set -euo pipefail

# ANSI color escape codes
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_header() {
    echo -e "\n${CYAN}=== $1 ===${NC}"
}

log_success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

log_info() {
    echo -e "[INFO] $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

log_error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

log_header "StepCue Google Cloud Run Deployment"

# 1. Check if gcloud CLI is installed
if ! command -v gcloud &> /dev/null; then
    log_error "gcloud CLI was not found on your system."
    echo -e "${YELLOW}Please install the Google Cloud SDK first. You can download it here:${NC}"
    echo -e "${YELLOW}https://cloud.google.com/sdk/docs/install${NC}"
    exit 1
fi

# 2. Check if user is authenticated
log_info "Checking Google Cloud authentication..."
ACCOUNT=$(gcloud config get-value account 2>/dev/null || true)
if [ -z "$ACCOUNT" ] || [ "$ACCOUNT" = "(unset)" ]; then
    log_warning "No active Google Cloud account detected. Initiating login..."
    gcloud auth login
else
    log_success "Authenticated as: $ACCOUNT"
fi

# 3. Retrieve or ask for Project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null || true)
if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "(unset)" ]; then
    log_warning "No Google Cloud project is currently set in your active gcloud context."
    read -r -p "Please enter your GCP Project ID: " INPUT_PROJECT_ID
    if [ -z "$INPUT_PROJECT_ID" ]; then
        log_error "Project ID cannot be empty."
        exit 1
    fi
    PROJECT_ID=$INPUT_PROJECT_ID
    gcloud config set project "$PROJECT_ID"
else
    read -r -p "Deploy to the currently active project '$PROJECT_ID'? [Y/n]: " RESPONSE
    RESPONSE=$(echo "$RESPONSE" | tr '[:upper:]' '[:lower:]')
    if [[ "$RESPONSE" =~ ^(n|no)$ ]]; then
        read -r -p "Please enter the GCP Project ID you'd like to use: " INPUT_PROJECT_ID
        if [ -z "$INPUT_PROJECT_ID" ]; then
            log_error "Project ID cannot be empty."
            exit 1
        fi
        PROJECT_ID=$INPUT_PROJECT_ID
        gcloud config set project "$PROJECT_ID"
    fi
fi
log_success "Using GCP Project: $PROJECT_ID"

# 4. Settings and Constants
AR_REGION="us-central1"
RUN_REGION="us-central1"
AR_REPO="stepcue-repo"
SERVICE_NAME="stepcue"

# 5. Enable Google Cloud APIs
log_header "Enabling Google Cloud APIs"
log_info "Enabling Artifact Registry, Cloud Build, and Cloud Run APIs..."
gcloud services enable \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    --async

log_success "API enablement requested. This may take a moment to fully activate."

# 6. Setup Artifact Registry Repository
log_header "Configuring Artifact Registry"
log_info "Checking if Artifact Registry repository '$AR_REPO' exists in region '$AR_REGION'..."
REPO_EXISTS=$(gcloud artifacts repositories describe "$AR_REPO" --location="$AR_REGION" --format="value(name)" 2>/dev/null || true)

if [ -z "$REPO_EXISTS" ]; then
    log_info "Creating Artifact Registry Docker repository '$AR_REPO' in '$AR_REGION'..."
    gcloud artifacts repositories create "$AR_REPO" \
        --repository-format=docker \
        --location="$AR_REGION" \
        --description="Docker repository for StepCue Next.js application"
    log_success "Repository '$AR_REPO' created successfully."
else
    log_success "Repository '$AR_REPO' already exists."
fi

# 7. Submit Cloud Build
log_header "Submitting Build and Deploying"
log_info "Uploading code and building container in the cloud..."
log_info "This step will package your local project files, build the Docker image, and deploy to Cloud Run."

# Generate a random commit-like string if git is not available or has no commits
COMMIT_SHA="manual-build"
if command -v git &> /dev/null; then
    GIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || true)
    if [ -n "$GIT_SHA" ]; then
        COMMIT_SHA=$GIT_SHA
    fi
fi

gcloud builds submit --config=cloudbuild.yaml \
    --substitutions="_AR_REGION=$AR_REGION,_AR_REPO=$AR_REPO,_SERVICE_NAME=$SERVICE_NAME,_RUN_REGION=$RUN_REGION,COMMIT_SHA=$COMMIT_SHA"

log_header "Deployment Completed!"
log_success "Your application has been deployed successfully to Google Cloud Run."
echo -e "\nTo view your deployed app, find the Service URL in the output above or run:"
echo -e "  ${CYAN}gcloud run services describe $SERVICE_NAME --region=$RUN_REGION --format='value(status.url)'${NC}"
echo -e "\n${YELLOW}Note: If your application requires environment variables (like GEMINI_API_KEY), you can set them using the Google Cloud Console or via gcloud:${NC}"
echo -e "  ${CYAN}gcloud run services update $SERVICE_NAME --region=$RUN_REGION --set-env-vars='GEMINI_API_KEY=your_key_here'${NC}"
