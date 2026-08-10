import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('d:/SIAPOS/src');
let changedFiles = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Backgrounds
  newContent = newContent.replace(/\bbg-white\b/g, 'bg-card');
  newContent = newContent.replace(/\bbg-gray-50\b/g, 'bg-muted/50');
  newContent = newContent.replace(/\bbg-gray-100\b/g, 'bg-muted');
  newContent = newContent.replace(/\bbg-gray-200\b/g, 'bg-muted');
  newContent = newContent.replace(/\bbg-slate-50\b/g, 'bg-muted/50');
  newContent = newContent.replace(/\bbg-slate-100\b/g, 'bg-muted');
  
  // Texts
  newContent = newContent.replace(/\btext-black\b/g, 'text-foreground');
  newContent = newContent.replace(/\btext-gray-400\b/g, 'text-muted-foreground');
  newContent = newContent.replace(/\btext-gray-500\b/g, 'text-muted-foreground');
  newContent = newContent.replace(/\btext-gray-600\b/g, 'text-muted-foreground');
  newContent = newContent.replace(/\btext-gray-700\b/g, 'text-foreground');
  newContent = newContent.replace(/\btext-gray-800\b/g, 'text-foreground');
  newContent = newContent.replace(/\btext-gray-900\b/g, 'text-foreground');
  newContent = newContent.replace(/\btext-slate-500\b/g, 'text-muted-foreground');
  newContent = newContent.replace(/\btext-slate-600\b/g, 'text-muted-foreground');
  newContent = newContent.replace(/\btext-slate-700\b/g, 'text-foreground');
  newContent = newContent.replace(/\btext-slate-800\b/g, 'text-foreground');
  newContent = newContent.replace(/\btext-slate-900\b/g, 'text-foreground');

  // Borders
  newContent = newContent.replace(/\bborder-gray-100\b/g, 'border-border');
  newContent = newContent.replace(/\bborder-gray-200\b/g, 'border-border');
  newContent = newContent.replace(/\bborder-gray-300\b/g, 'border-border');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log('Updated:', file);
  }
});

console.log(`Total files updated: ${changedFiles}`);
