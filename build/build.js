/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const process = require('process');
const libConfig = require('../lib');
const _ = require('lodash');
const parseComponent = require('@vue/component-compiler-utils').parse;

// Update the index file
console.info('Building entry point');
require('./build-entry');

// Get the names of all components in the src directory by folder name
const componentNames = require('./component-names');

fs.emptyDirSync(getPath('../packages'));

// Build the main lib, with all components packaged into a plugin
console.info('Building main library');
execSync('rollup --config build/rollup.config.js');

// TODO: generate this package.json so we can leave the dev dependencies and other fluff out
console.info('Copying package.json for main library');
copyFile('./', 'packages/render', 'package.json');

console.info('Copying license for main library');
copyLicense('./packages/render');

console.info('Copying readme for main library');
copyReadme('./', 'packages/render');

// // Rename the CommonJS build so that it can be imported with
// // ${libConfig}/dist
// renameIndex();

// // For each component in the src directory...
for (const componentName of componentNames) {
    // Build the component individually
    console.info(`🏗 Building ${componentName}`);
    const packageName = _.compact([
        libConfig.name,
        _.kebabCase(componentName),
    ]).join('.');

    execSync(
        `rollup --config src/components/${componentName}/rollup.config.js`
    );

    const destPackageFolder = path.resolve(
        __dirname,
        `../packages/${packageName}`
    );

    // write package.json
    const packageConfig = {
        name: packageName,
        moduleName: componentName || _.upperFirst(_.camelCase(packageName)),
        description: libConfig.packages[packageName].description,
        // example,
    };
    console.info(`Writing package.json for ${packageConfig.moduleName}`);
    fs.writeFileSync(
        path.resolve(destPackageFolder, 'package.json'),
        generatePackageJson(packageConfig)
    );

    // copy readme
    console.info(`Writing readme for ${packageConfig.moduleName}`);
    copyReadme(`src/components/${componentName}`, destPackageFolder);

    // write license
    console.info(`Adding license for ${packageConfig.moduleName}`);
    copyLicense(destPackageFolder);

    // build package
    console.info(`Building package for ${packageConfig.moduleName}`);
    process.chdir(`./packages/${packageName}`);
    execSync(`npm pack`);
    process.chdir('../../');

    // Rename the CommonJS build so that it can be imported with
    // ${libConfig}/dist/ComponentName
    // renameIndex(componentName);
}

function copyLicense(destination) {
    fs.copySync(getPath('../LICENSE'), path.resolve(destination, 'LICENSE'));
}

function copyReadme(source, destination) {
    fs.copySync(
        path.resolve(source, 'README.md'),
        path.resolve(destination, 'README.md')
    );
}

function copyFile(source, destination, file) {
    fs.copySync(path.resolve(source, file), path.resolve(destination, file));
}

function generatePackageJson(package) {
    const repoName = libConfig.author.github + '/' + libConfig.name;
    return JSON.stringify(
        {
            name: package.name,
            description: package.description,
            author: libConfig.author,
            version: libConfig.packages[package.name].version,
            license: 'MIT',
            homepage: `https://www.npmjs.com/package/${package.name}`,
            repository: {
                type: 'git',
                url: `git+https://github.com/${repoName}.git`,
            },
            bugs: {
                url: `https://github.com/${repoName}/issues`,
            },
            module: 'index.esm.js',
            main: 'index.umd.js',
            unpkg: 'index.min.js',
            jsdelivr: 'index.min.js',
            peerDependencies: libConfig.peerDependencies,
        },
        null,
        2
    );
}

function getPath(...args) {
    return path.resolve(__dirname, ...args);
}
