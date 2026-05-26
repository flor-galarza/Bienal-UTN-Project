const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            replaceInDir(fullPath);
        } else if (file.endsWith('.svelte') || file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const originalContent = content;
            
            // Replace 'http://localhost:3001' with `+ import.meta.env.VITE_API_URL + ` inside backticks
            // E.g. `http://localhost:3001/api/eventos` -> `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/eventos`
            // E.g. 'http://localhost:3001/api/login' -> `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/login`
            
            // First handle backticks: `http://localhost:3001/api/escultores`
            content = content.replace(/`http:\/\/localhost:3001([^`]+)`/g, (match, p1) => {
                return '`${import.meta.env.VITE_API_URL || \'http://localhost:3001\'}' + p1 + '`';
            });
            
            // Then handle single/double quotes: 'http://localhost:3001/api/login'
            content = content.replace(/['"]http:\/\/localhost:3001([^'"]+)['"]/g, (match, p1) => {
                return '`${import.meta.env.VITE_API_URL || \'http://localhost:3001\'}' + p1 + '`';
            });
            
            // Just in case there's any stray http://localhost:3001 not captured above
            if (content.includes('http://localhost:3001')) {
                content = content.replace(/http:\/\/localhost:3001/g, "${import.meta.env.VITE_API_URL || 'http://localhost:3001'}");
            }
            
            if (content !== originalContent) {
                console.log(`Updated ${fullPath}`);
                fs.writeFileSync(fullPath, content, 'utf8');
            }
        }
    }
}

replaceInDir(path.join(__dirname, '../client/src'));
console.log('Replacement complete!');
