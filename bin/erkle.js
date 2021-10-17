#! /usr/bin/env node
let shell = require('shelljs');
let readlineSync = require('readline-sync');
const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const chalk = require('chalk');

let config = fs.readFileSync(path.resolve(argv.config), 'utf8');
const {
  contractPath,
  subgraphPath,
  contractCompile,
  contractMigration,
  contractABICopy,
  replace,
  subgraphCodegen,
  subgraphBuild,
  subgraphDeploy,
} = JSON.parse(config);

const getOption = (prop, altCheck) => {
  let optionVal = Object.hasOwn(argv, prop) ? argv[prop] : altCheck;

  if (optionVal == 'true' || optionVal == 'false')
    return typeof optionVal === 'string' ? optionVal === 'true' : optionVal;

  return optionVal;
};

// contract compilation
if (getOption('compileContract', contractCompile.run) == true) {
  shell.cd(path.resolve(getOption('contractPath', contractPath)));
  shell.exec(contractCompile.script);
}

// contract migration
if (getOption('migrateContract', contractMigration.run)) {
  shell.cd(path.resolve(getOption('contractPath', contractPath)));
  shell.exec(contractMigration.script);
}

// generate and copy abis
if (getOption('copyABI', contractABICopy.run)) {
  contractABICopy.compiledContracts.map((compiledContract) => {
    let data = fs.readFileSync(
      path.resolve(getOption('contractPath', contractPath)) + compiledContract,
      'utf8'
    );
    contractABICopy.copyABITo.map((filePath) => {
      fs.outputJsonSync(
        path.join(filePath, 'abis', path.basename(compiledContract)),
        JSON.parse(data).abi
      );
    });
  });
}

// run replace
if (getOption('replace', replace.run)) {
  for (let i = 0; i < replace.tasks.length; i++) {
    shell.exec(`echo ${chalk.bold.green(replace.tasks[i].description)}`);
    shell.exec(
      'echo ❯ ' + chalk.magenta('Path: ') + chalk.dim(replace.tasks[i].path)
    );
    shell.exec(
      'echo ❯ ' +
        chalk.magenta('Extensions: ') +
        chalk.dim(replace.tasks[i].extensions)
    );

    let replaceWith = readlineSync.question(
      '? ' + chalk.magenta('Replace with: ')
    );
    shell.cd(path.resolve(replace.tasks[i].path));
    shell
      .ls(
        `${
          replace.tasks[i].extensions.length > 1
            ? `{${replace.tasks[i].extensions}}`
            : replace.tasks[i].extensions
        }`
      )
      .forEach((file) => {
        shell.sed('-i', replace.tasks[i].replace, replaceWith, file);
      });

    let configJson = JSON.parse(config);
    configJson.replace.tasks[i].replace = replaceWith;
    fs.writeFileSync(
      path.resolve(argv.config),
      JSON.stringify(configJson, null, 4)
    );

    shell.exec('echo \n');
  }
}

// subgraph
if (getOption('codegen', subgraphCodegen.run)) {
  shell.cd(path.resolve(getOption('subgraphPath', subgraphPath)));
  shell.exec(subgraphCodegen.script);
}

if (getOption('graphBuild', subgraphBuild.run)) {
  shell.cd(path.resolve(getOption('subgraphPath', subgraphPath)));
  shell.exec(subgraphBuild.script);
}

if (getOption('graphDeploy', subgraphDeploy.run)) {
  shell.cd(path.resolve(getOption('subgraphPath', subgraphPath)));
  shell.exec(subgraphDeploy.script);
}

shell.exit(1);
