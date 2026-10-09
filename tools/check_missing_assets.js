const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function checkMissing() {
  const cssFiles = getAllFiles(__dirname).filter(f => f.endsWith('.css'));
  console.log('Total CSS files:', cssFiles.length);

  const missing = new Set();

  for (const cssFile of cssFiles) {
    const content = fs.readFileSync(cssFile, 'utf-8');
    const matches = [...content.matchAll(/url\(\s*['"]?([^'")#?]+)([?#][^'")]*)?['"]?\s*\)/gi)];
    for (const m of matches) {
      let urlPath = m[1];
      if (urlPath.startsWith('data:')) continue;
      
      let targetPath;
      if (urlPath.startsWith('/')) {
        targetPath = path.join(__dirname, urlPath.replace(/^\//, ''));
      } else if (urlPath.startsWith('http')) {
        try {
          const u = new URL(urlPath);
          if (u.hostname === 'aestheticsbydrsamina.com') {
            targetPath = path.join(__dirname, u.pathname.replace(/^\//, ''));
          } else {
            // External font/asset
            continue;
          }
        } catch (e) {
          continue;
        }
      } else {
        targetPath = path.resolve(path.dirname(cssFile), urlPath);
      }

      if (!fs.existsSync(targetPath)) {
        missing.add({
          cssFile: path.relative(__dirname, cssFile),
          ref: urlPath,
          expected: path.relative(__dirname, targetPath)
        });
      }
    }
  }

  console.log(`Missing assets referenced in CSS: ${missing.size}`);
  for (const item of missing) {
    console.log(`CSS: ${item.cssFile} -> Missing: ${item.ref} (Expected at: ${item.expected})`);
  }
}

checkMissing().catch(console.error);
