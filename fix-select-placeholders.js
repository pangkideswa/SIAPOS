const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory() && !full.includes('node_modules') && !full.includes('.next')) {
      results = results.concat(walk(full));
    } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('D:/SIAPOS/src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const regex = /<SelectValue\s+placeholder=\"([^\"]+)\">([\s\S]*?)<\/SelectValue>/g;
  let changed = false;
  content = content.replace(regex, (match, placeholder, inner) => {
    const filterVar = placeholder.toLowerCase() + 'Filter';
    const newInner = `{${filterVar} === \"semua\" ? \"${placeholder}\" : undefined}`;
    if (inner.trim() !== newInner) {
      changed = true;
      return `<SelectValue placeholder=\"${placeholder}\">${newInner}</SelectValue>`;
    }
    return match;
  });
  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Modified ' + file);
  }
});
