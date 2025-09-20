#!/usr/bin/env node

/**
 * Deployment Verification Script
 * This script verifies that all deployment configurations are working properly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🔍 Verifying Deployment Configuration...\n');

const checks = {
  files: false,
  workflows: false,
  vercel: false,
  admin: false,
  styles: false
};

// Check 1: Required files exist
console.log('📁 Checking required files...');
const requiredFiles = [
  'vercel.json',
  'package.json',
  '.env.example',
  'server.js',
  'client/components/Admin/DesignSettings.jsx',
  'client/styles/dynamic-theme.css',
  'database/design-schema.sql'
];

let filesOk = true;
requiredFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - Missing!`);
    filesOk = false;
  }
});
checks.files = filesOk;

// Check 2: GitHub workflows
console.log('\n⚙️ Checking GitHub Actions workflows...');
const workflowDir = path.join(rootDir, '.github', 'workflows');
if (fs.existsSync(workflowDir)) {
  const workflows = fs.readdirSync(workflowDir).filter(file => 
    file.endsWith('.yml') || file.endsWith('.yaml')
  );
  
  const requiredWorkflows = ['ci.yml', 'preview.yml'];
  let workflowsOk = true;
  
  requiredWorkflows.forEach(workflow => {
    if (workflows.includes(workflow)) {
      console.log(`  ✅ ${workflow}`);
    } else {
      console.log(`  ❌ ${workflow} - Missing!`);
      workflowsOk = false;
    }
  });
  
  checks.workflows = workflowsOk;
} else {
  console.log('  ❌ .github/workflows directory not found');
  checks.workflows = false;
}

// Check 3: Vercel configuration
console.log('\n🚀 Checking Vercel configuration...');
try {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'vercel.json'), 'utf8'));
  
  const requiredSections = ['builds', 'routes', 'env', 'functions'];
  let vercelOk = true;
  
  requiredSections.forEach(section => {
    if (vercelConfig[section]) {
      console.log(`  ✅ ${section} configuration`);
    } else {
      console.log(`  ❌ ${section} - Missing!`);
      vercelOk = false;
    }
  });
  
  // Check for required environment variables
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
    'OPENAI_API_KEY'
  ];
  
  const configuredEnvVars = Object.keys(vercelConfig.env || {});
  requiredEnvVars.forEach(envVar => {
    if (configuredEnvVars.includes(envVar)) {
      console.log(`  ✅ ${envVar} configured`);
    } else {
      console.log(`  ⚠️  ${envVar} - Not configured in vercel.json`);
    }
  });
  
  checks.vercel = vercelOk;
} catch (error) {
  console.log('  ❌ Failed to parse vercel.json');
  checks.vercel = false;
}

// Check 4: Admin components
console.log('\n👨‍💼 Checking admin components...');
const adminDir = path.join(rootDir, 'client', 'components', 'Admin');
if (fs.existsSync(adminDir)) {
  const adminComponents = fs.readdirSync(adminDir).filter(file => file.endsWith('.jsx'));
  const requiredAdminComponents = [
    'EnvironmentSettings.jsx',
    'DesignSettings.jsx',
    'AIProviderSettings.jsx',
    'PaymentSettings.jsx'
  ];
  
  let adminOk = true;
  requiredAdminComponents.forEach(component => {
    if (adminComponents.includes(component)) {
      console.log(`  ✅ ${component}`);
    } else {
      console.log(`  ❌ ${component} - Missing!`);
      adminOk = false;
    }
  });
  
  checks.admin = adminOk;
} else {
  console.log('  ❌ Admin components directory not found');
  checks.admin = false;
}

// Check 5: Dynamic styles
console.log('\n🎨 Checking dynamic styling system...');
const stylesDir = path.join(rootDir, 'client', 'styles');
if (fs.existsSync(stylesDir)) {
  const dynamicThemeFile = path.join(stylesDir, 'dynamic-theme.css');
  if (fs.existsSync(dynamicThemeFile)) {
    const cssContent = fs.readFileSync(dynamicThemeFile, 'utf8');
    
    const requiredCSSFeatures = [
      ':root',
      '--color-primary',
      '--font-heading',
      '--borderRadius',
      'var(--color-primary)'
    ];
    
    let stylesOk = true;
    requiredCSSFeatures.forEach(feature => {
      if (cssContent.includes(feature)) {
        console.log(`  ✅ ${feature} CSS variable system`);
      } else {
        console.log(`  ❌ ${feature} - Missing!`);
        stylesOk = false;
      }
    });
    
    checks.styles = stylesOk;
  } else {
    console.log('  ❌ dynamic-theme.css not found');
    checks.styles = false;
  }
} else {
  console.log('  ❌ Styles directory not found');
  checks.styles = false;
}

// Check 6: Package.json scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const requiredScripts = ['dev', 'start', 'build', 'test', 'lint', 'setup:db'];

requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`  ✅ npm run ${script}`);
  } else {
    console.log(`  ❌ npm run ${script} - Missing!`);
  }
});

// Final Results
console.log('\n' + '='.repeat(60));
console.log('📊 DEPLOYMENT VERIFICATION RESULTS');
console.log('='.repeat(60));

const results = [
  { name: 'Required Files', status: checks.files },
  { name: 'GitHub Workflows', status: checks.workflows },
  { name: 'Vercel Config', status: checks.vercel },
  { name: 'Admin Components', status: checks.admin },
  { name: 'Dynamic Styles', status: checks.styles }
];

results.forEach(result => {
  const status = result.status ? '✅ READY' : '❌ NEEDS ATTENTION';
  console.log(`${status} - ${result.name}`);
});

const readyCount = results.filter(r => r.status).length;
const totalCount = results.length;

console.log('\n' + '='.repeat(60));
console.log(`📈 Overall Status: ${readyCount}/${totalCount} components ready`);

if (readyCount === totalCount) {
  console.log('\n🎉 DEPLOYMENT READY!');
  console.log('\nNext steps:');
  console.log('1. Set up environment variables (.env file)');
  console.log('2. Run: npm run setup:db');
  console.log('3. Deploy to Vercel: vercel');
  console.log('4. Configure Vercel environment variables');
  console.log('5. Visit admin panel and customize design');
} else {
  console.log('\n⚠️  Some components need attention before deployment.');
  console.log('Please fix the issues marked with ❌ above.');
}

console.log('\n📚 For detailed instructions, see:');
console.log('   - QUICK_DEPLOY_GUIDE.md');
console.log('   - WORKFLOWS.md');
console.log('   - DEPLOYMENT.md');

process.exit(readyCount === totalCount ? 0 : 1);