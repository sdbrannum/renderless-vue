const fs = require('fs');
const path = require('path');

// Get all folders
const folders = fs
    .readdirSync(path.resolve(__dirname, '../src/components'))
    .filter(folder => !/\.DS_Store$/.test(folder));

// Get the names of the components from the folder names
module.exports = folders.map(folders => folders.replace(/\.\w+$/, ''));
