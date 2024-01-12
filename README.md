# Metaphoto

## Prerequisites
Ensure that you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version X or higher)
- [PNPM](https://pnpm.io/)

## Getting Started

**Clone the Repository:**

   ```bash
   git clone https://github.com/diegojmoir/relish-technical-test.git
   cd relish-technical-test
    
**Install Dependencies**
pnpm install

This monorepo uses PNPM workspaces. Ensure that you are using a compatible version of PNPM and run:
pnpm -v
```
## Project Structure
- `apps/`: Contains web applications.
- `endpoints/`: Contains serverless functions.

## Github Actions
This repository is configured with GitHub Actions for automated deployment. 
The configuration files expect the repository to have the following [secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) and [variables](https://docs.github.com/en/actions/learn-github-actions/variables#passing-values-between-steps-and-jobs-in-a-workflow) configured to authenticate with AWS and deploy the applications:
- Secrets
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
- Variables
   - API_URL
   - AWS_BUCKET_NAME (Used to deploy the frontend)
   - AWS_BUCKET_NAME
  
The configuration files can be found in the .github/workflows/ directory:
- `deploy-frontend.yaml`: Only triggers when a file on the path: `apps/metaphoto/**` is modified.  
- `deploy-lambda.yaml`: Only triggers when a file on the path: `apps/endpoints/**` is modified.  
