# Environment Configuration Fix - Summary

## Issue
The project needed to be able to connect to the backend with both `local` and `container` profiles, but there were inconsistencies in the environment configuration files.

## Problems Identified
1. **Missing `.env.local` file**: The file was referenced in documentation and scripts but didn't exist
2. **Port inconsistencies**: Documentation mentioned port 8090, but some files used port 8080
3. **Configuration misalignment**: Different files had conflicting API URL configurations

## Changes Made

### 1. Created `.env.local`
Created the missing template file for local development:
```env
VITE_API_URL=http://localhost:8090/
VITE_ENVIRONMENT=development
```

### 2. Updated Environment Files
- **`.env`**: Updated to use port 8090 (local configuration)
- **`.env.local`**: Created with local configuration (port 8090)
- **`.env.container`**: Ensured consistency with port 8090 for container environment
- **`.env.docker`**: Updated to use port 8090 for Docker Compose development

### 3. Updated Source Code
- **`src/config.ts`**: Changed default `API_BASE_URL` from `http://localhost:8080/` to `http://localhost:8090/`
- **`vite.config.ts`**: Already correct with port 8090

### 4. Updated Documentation
- **`README.md`**: Updated container port from 8080 to 8090
- **`README-env.md`**: Updated all port references from 8080 to 8090
- **`docker/README.md`**: Updated default VITE_API_URL from 8080 to 8090
- **`ENVIRONMENT_CONFIG.md`**: Already correct with port 8090

### 5. Updated `.gitignore`
Modified to allow template environment files (`.env.local`, `.env.container`, `.env.docker`) to be tracked in Git while ignoring development-specific files.

## How to Use

### Local Development
```bash
# Option 1: Use npm script (recommended)
npm run dev:local

# Option 2: Manual
cp .env.local .env && npm run dev

# Option 3: Use shell script
./start-env.sh local
```

### Docker/Container Development
```bash
# Option 1: Use npm script (recommended)
npm run dev:docker

# Option 2: Manual
cp .env.docker .env && npm run dev

# Option 3: Use shell script
./start-env.sh docker
```

## Environment Variables Summary

| Environment | VITE_API_URL | VITE_ENVIRONMENT | Use Case |
|-------------|--------------|------------------|----------|
| **Local** | `http://localhost:8090/` | `development` | Local development on machine |
| **Docker** | `http://lottoquebec-backend:8090/` | `docker` | Docker Compose development |
| **Container** | `http://lottoquebec-backend:8090/` | `container` | Container production build |

## Verification

All configurations have been tested and verified:
- ✅ Build completes successfully
- ✅ All environment files are consistent
- ✅ Port 8090 is used consistently across all configurations
- ✅ Template files are tracked in Git
- ✅ npm scripts work correctly

## Notes
- The backend API must be running on port **8090** (not 8080)
- In Docker Compose, the backend service should be named `lottoquebec-backend`
- Always restart the dev server after changing environment files
