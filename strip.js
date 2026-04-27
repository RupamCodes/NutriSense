const fs = require('fs');
const path = require('path');

const stripComments = (content) => {
  return content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').replace(/^\s*[\r\n]/gm, '');
};

const fileToProcess = path.join(__dirname, 'prisma', 'seed.js');
let content = fs.readFileSync(fileToProcess, 'utf8');
const newContent = stripComments(content);
if (content !== newContent) {
  fs.writeFileSync(fileToProcess, newContent, 'utf8');
  console.log(`Stripped comments from: ${fileToProcess}`);
}
