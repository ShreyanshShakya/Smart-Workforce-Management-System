const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        filelist = fs.statSync(fullPath).isDirectory() 
            ? walkSync(fullPath, filelist) 
            : filelist.concat(fullPath);
    });
    return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.jsx'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    // Remove "import React from 'react';"
    content = content.replace(/import React(?:, \{[^}]+\})? from ['"]react['"];?\r?\n?/g, (match) => {
        if (match.includes('{')) {
            return match.replace(/React,?\s*/, '');
        }
        return '';
    });
    fs.writeFileSync(f, content);
});
