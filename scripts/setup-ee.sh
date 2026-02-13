#!/bin/bash

# Mnestix Enterprise Edition Setup Script
# This script helps set up the EE development environment

set -e

echo "🚀 Setting up Mnestix Enterprise Edition..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the root of the mnestix-browser repository"
    exit 1
fi

# Install required dependencies
echo "📦 Installing required dependencies..."
yarn add --dev fs-extra @types/fs-extra

# Check if EE submodule is already configured
if [ -d "ee" ] && [ -f "ee/.git" ]; then
    echo "✅ EE submodule already exists"
    
    # Update existing submodule
    echo "🔄 Updating EE submodule..."
    git submodule update --remote --merge
else
    echo "📋 EE submodule not found"
    echo "To add your private EE repository, run:"
    echo "  git submodule add <your-private-ee-repo-url> ee"
    echo "  git submodule init"
    echo "  git submodule update"
fi

# Test the build system
echo "🧪 Testing build system..."

# Test CE build
echo "Testing CE build..."
EDITION=ce yarn prebuild
if [ $? -eq 0 ]; then
    echo "✅ CE build assembly successful"
else
    echo "❌ CE build assembly failed"
    exit 1
fi

# Test EE build (if submodule exists)
if [ -d "ee/app-ee" ]; then
    echo "Testing EE build..."
    EDITION=ee yarn prebuild
    if [ $? -eq 0 ]; then
        echo "✅ EE build assembly successful"
    else
        echo "❌ EE build assembly failed"
        exit 1
    fi
else
    echo "ℹ️  Skipping EE build test (no EE routes found)"
fi

# Create environment template if it doesn't exist
if [ ! -f ".env.ee.example" ]; then
    echo "📝 Creating EE environment template..."
    cat > .env.ee.example << EOF
# Enterprise Edition Environment Variables
EDITION=ee
MNX_EE_LICENSE_KEY=your-license-key-here
MNX_EE_API_ENDPOINT=https://license.your-domain.com
EOF
    echo "✅ Created .env.ee.example"
fi

# Create development scripts
echo "📜 Creating convenience scripts..."

# Create start-ee script
cat > scripts/start-ee.sh << 'EOF'
#!/bin/bash
# Start Mnestix in Enterprise Edition mode
export EDITION=ee
echo "🚀 Starting Mnestix Enterprise Edition..."
yarn dev
EOF

# Create build-ee script
cat > scripts/build-ee.sh << 'EOF'
#!/bin/bash
# Build Mnestix Enterprise Edition
export EDITION=ee
echo "🏗️  Building Mnestix Enterprise Edition..."
yarn build
EOF

chmod +x scripts/start-ee.sh scripts/build-ee.sh

echo ""
echo "🎉 Enterprise Edition setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your private EE repository as a submodule (if not done yet):"
echo "   git submodule add <your-ee-repo-url> ee"
echo ""
echo "2. Copy and configure environment variables:"
echo "   cp .env.ee.example .env.local"
echo "   # Edit .env.local with your actual values"
echo ""
echo "3. Start development with EE features:"
echo "   ./scripts/start-ee.sh"
echo "   # or directly: EDITION=ee yarn dev"
echo ""
echo "4. Build EE version:"
echo "   ./scripts/build-ee.sh"
echo "   # or directly: EDITION=ee yarn build"
echo ""
echo "📚 Documentation: docs/ENTERPRISE_EDITION.md"