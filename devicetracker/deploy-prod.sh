#!/bin/bash
# Deploy to Convex production deployment

echo "Deploying to Convex production deployment..."

# Set the deployment to prod
export CONVEX_DEPLOYMENT=prod

# Deploy to production
npx convex deploy --prod

echo ""
echo "Deployment complete!"
echo "Check your functions at: https://dashing-crane-367.convex.cloud/_internal/functions"
