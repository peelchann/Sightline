# Sightline WebAR Deployment Guide

This guide ensures you deploy the latest code cleanly to production, avoiding caching issues or stale builds.

## Prerequisite: One-Time Setup

Ensure you have Node.js and Vercel CLI installed.

```bash
# 1. Install Node.js (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 20

# 2. Install Vercel CLI
npm install -g vercel

# 3. Login to Vercel
vercel login
```

---

## Standard Deployment Workflow

Follow these steps every time you want to deploy changes.

### 1. Commit & Push to GitHub
Always sync your code to GitHub first for version control.

```bash
# Add changes
git add .

# Commit
git commit -m "feat: description of changes"

# Push to main
git push origin main
```

### 2. Force Production Deployment (Vercel)
Run this command to force a fresh build and deploy immediately from your local machine. This bypasses GitHub integration delays and clears build caches.

```bash
# Navigate to the project root (if not already there)
cd WebDemo

# Deploy to Production (Force clean build)
vercel --prod --force
```

**Why `--force`?**
- It skips the build cache, ensuring new assets (like images) are processed.
- It guarantees the deployment matches your local files exactly.

---

## Troubleshooting

**"Command not found: vercel"**
Reload your shell configuration:
```bash
source ~/.zshrc
# OR re-load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

**"Totally Broken" / Old Version Showing**
1. Run `vercel --prod --force` again.
2. Open the URL in Incognito mode to bypass browser cache.
3. Check the specific Deployment URL output by the CLI (e.g., `https://sightline-webar-xyz.vercel.app`) to see if it works there.

