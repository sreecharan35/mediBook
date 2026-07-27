import fs from 'fs/promises';
import path from 'path';

const SRC_DIR = './src';

async function processDirectory(dir, depthFromSrc) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath, depthFromSrc + 1);
    } else if (entry.isFile() && (entry.name.endsWith('.jsx') || entry.name.endsWith('.js'))) {
      let content = await fs.readFile(fullPath, 'utf8');
      let originalContent = content;

      // Calculate the prefix needed to reach 'src'
      const prefixToSrc = '../'.repeat(depthFromSrc);

      // Fix imports targeting context, hooks, services, utils, assets
      const rootFolders = ['context', 'hooks', 'services', 'utils', 'assets', 'lib', 'data'];
      for (const folder of rootFolders) {
        // Replace from `../folder/` or `../../folder/` to the exact prefix
        const regex = new RegExp(`from\\s+['"](\\.\\./)+${folder}/`, 'g');
        content = content.replace(regex, `from '${prefixToSrc}${folder}/`);
        
        // Also handle import "..." without from
        const regex2 = new RegExp(`import\\s+['"](\\.\\./)+${folder}/`, 'g');
        content = content.replace(regex2, `import '${prefixToSrc}${folder}/`);
      }

      // Fix imports targeting components
      // Most components are now in features/misc/components, but let's just point them correctly
      // We will leave component imports to be fixed manually or via a different rule, 
      // but let's fix Navbar and Footer which moved to features/misc/components
      content = content.replace(/from\s+['"](\.\.\/)+components\/Navbar['"]/g, `from '${prefixToSrc}features/misc/components/Navbar'`);
      content = content.replace(/from\s+['"](\.\.\/)+components\/Footer['"]/g, `from '${prefixToSrc}features/misc/components/Footer'`);
      content = content.replace(/from\s+['"](\.\.\/)+components\/CTASection['"]/g, `from '${prefixToSrc}features/misc/components/CTASection'`);
      content = content.replace(/from\s+['"](\.\.\/)+components\/DoctorsSection['"]/g, `from '${prefixToSrc}features/misc/components/DoctorsSection'`);
      content = content.replace(/from\s+['"](\.\.\/)+components\/FAQSection['"]/g, `from '${prefixToSrc}features/misc/components/FAQSection'`);
      content = content.replace(/from\s+['"](\.\.\/)+components\/Hero['"]/g, `from '${prefixToSrc}features/misc/components/Hero'`);
      content = content.replace(/from\s+['"](\.\.\/)+components\/ServicesSection['"]/g, `from '${prefixToSrc}features/misc/components/ServicesSection'`);
      content = content.replace(/from\s+['"](\.\.\/)+components\/StatsSection['"]/g, `from '${prefixToSrc}features/misc/components/StatsSection'`);
      content = content.replace(/from\s+['"](\.\.\/)+components\/TestimonialsSection['"]/g, `from '${prefixToSrc}features/misc/components/TestimonialsSection'`);
      content = content.replace(/from\s+['"](\.\.\/)+components\/LoadingScreen['"]/g, `from '${prefixToSrc}features/misc/components/LoadingScreen'`);
      content = content.replace(/from\s+['"](\.\.\/)+components\/ProtectedRoute['"]/g, `from '${prefixToSrc}features/auth/components/ProtectedRoute'`);

      // Fix layouts
      content = content.replace(/from\s+['"](\.\.\/)+layouts\/MainLayout['"]/g, `from '${prefixToSrc}layouts/MainLayout'`);
      content = content.replace(/from\s+['"](\.\.\/)+layouts\/DashboardLayout['"]/g, `from '${prefixToSrc}layouts/DashboardLayout'`);
      // Fix auth components
      content = content.replace(/from\s+['"]\.\.\/components\/auth\/AuthInput['"]/g, `from './components/AuthInput'`);
      content = content.replace(/from\s+['"]\.\.\/components\/auth\/SocialLogin['"]/g, `from './components/SocialLogin'`);
      content = content.replace(/from\s+['"]\.\.\/\.\.\/components\/auth\/AuthInput['"]/g, `from './AuthInput'`);
      content = content.replace(/from\s+['"]\.\.\/\.\.\/components\/auth\/SocialLogin['"]/g, `from './SocialLogin'`);
      
      // Fix booking components
      content = content.replace(/from\s+['"]\.\.\/components\/booking\/([^'"]+)['"]/g, `from './components/$1'`);
      
      // Fix auth layout
      content = content.replace(/from\s+['"]\.\.\/layouts\/AuthLayout['"]/g, `from '../../layouts/AuthLayout'`);
      
      if (content !== originalContent) {
        await fs.writeFile(fullPath, content, 'utf8');
        console.log(`Updated imports in: ${fullPath}`);
      }
    }
  }
}

async function run() {
  await processDirectory(SRC_DIR, 0);
  console.log('Finished updating imports.');
}

run().catch(console.error);
