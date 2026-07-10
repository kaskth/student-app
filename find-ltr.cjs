const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.vue')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('src');
let found = false;
files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const matches = [];
    if (content.includes('text-left')) matches.push('text-left');
    if (content.includes('float-left')) matches.push('float-left');
    if (content.includes('justify-start') && !content.includes('dir="rtl"')) matches.push('justify-start without dir=rtl');
    if (content.includes('style="direction: ltr"')) matches.push('style="direction: ltr"');
    if (content.includes('dir="ltr"')) matches.push('dir="ltr"');
    
    if (matches.length > 0) {
        console.log(`File: ${f} -> Contains: ${matches.join(', ')}`);
        found = true;
    }
});

if (!found) console.log("No suspect files found.");
