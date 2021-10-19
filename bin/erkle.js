#! /usr/bin/env node
const shell = require('shelljs');
const child_process = require('child_process');
const readlineSync = require('readline-sync');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const argv = require('yargs/yargs')(process.argv.slice(2))
  .option('config', {
    alias: 'c',
    describe: 'Path to erkle config file',
    type: 'string',
  })
  .option('contractPath', {
    alias: 'cp',
    describe: 'Path to your truffle or hardhat contract project',
    type: 'string',
  })
  .option('subgraphPath', {
    alias: 'sp',
    describe: 'Path to your subgraph folder',
    type: 'string',
  })
  .option('skipCompile', {
    alias: 'sc',
    describe: 'Skip contract compilation',
    type: 'boolean',
  })
  .option('skipMigration', {
    alias: 'sm',
    describe: 'Skip contract migration',
    type: 'boolean',
  })
  .option('skipAbiUpdate', {
    alias: 'sabi',
    describe: 'Skip ABI copy and update',
    type: 'boolean',
  })
  .option('skipReplace', {
    alias: 'sr',
    describe: 'Skip string search and replace',
    type: 'boolean',
  })
  .option('skipSubgraph', {
    alias: 'ss',
    describe: 'Skip subgraph creation and deploy',
    type: 'boolean',
  })
  .option('skipExtras', {
    alias: 'se',
    describe: 'Skip tasks ran after all tasks completes',
    type: 'boolean',
  })
  .option('skipCompileTask', {
    alias: 'sct',
    describe: 'Skip child compile task by index',
    type: 'string',
  })
  .option('skipMigrationTask', {
    alias: 'smt',
    describe: 'Skip child migration task(s) by index',
    type: 'string',
  })
  .option('skipSubgraphTask', {
    alias: 'sst',
    describe: 'Skip child subgraph task(s) by index',
    type: 'string',
  })
  .option('skipReplaceTask', {
    alias: 'srt',
    describe: 'Skip child replace task(s) by index',
    type: 'string',
  })
  .option('skipExtrasTask', {
    alias: 'sext',
    describe: 'Skip child extras task(s) by index',
    type: 'string',
  })
  .demandOption(['config'], 'Please specify an erkle config file')
  .help().argv;

const config = fs.readFileSync(path.resolve(argv.config), 'utf8');

const {
  contractPath,
  subgraphPath,
  compile,
  migration,
  abiUpdate,
  replace,
  subgraph,
  extras,
} = JSON.parse(config);

const getOption = (cliFlag, erkleConfig) => {
  return Object.hasOwn(argv, cliFlag) ? argv[cliFlag] : erkleConfig;
};

const isBlank = (str) => {
  return !str || /^\s*$/.test(str);
};

const skippedTasks = (skippedTasksFlag) => {
  return Object.hasOwn(argv, skippedTasksFlag)
    ? argv[skippedTasksFlag].split(',')
    : [];
};

const taskRunner = (workflow, workflowPath, skippedTasksFlag) => {
  for (let i = 0; i < workflow.tasks.length; i++) {
    const task = workflow.tasks[i];

    if (skippedTasks(skippedTasksFlag).includes(String(i))) continue;

    if (!task.skip) {
      shell.cd(path.resolve(workflowPath));
      shell.exec(
        'echo ❯ ' +
          chalk.magenta('Task: ') +
          chalk.yellowBright(task.description)
      );
      shell.exec('echo ❯ ' + chalk.magenta('Path: ') + chalk.dim(workflowPath));
      shell.exec(
        'echo ❯ ' + chalk.magenta('Script: ') + chalk.bold.yellow(task.script)
      );
      child_process.execSync(task.script, { stdio: 'inherit' });
    }
  }
  shell.exec('echo \n');
};

// contract compilation
if (!getOption('skipCompile', compile.skip)) {
  taskRunner(
    compile,
    getOption('contractPath', contractPath),
    'skipCompileTask'
  );
}

// contract migration
if (!getOption('skipMigration', migration.skip)) {
  taskRunner(
    migration,
    getOption('contractPath', contractPath),
    'skipMigrationTask'
  );
}

// generate and copy abis
if (!getOption('skipAbiUpdate', abiUpdate.skip)) {
  shell.exec(
    'echo ❯ ' + chalk.magenta('Task: ') + chalk.bold.yellow('Updating ABIs')
  );
  abiUpdate.compiledContracts.map((compiledContract) => {
    shell.exec(
      'echo ❯ ' +
        chalk.bgGray('Copied From: ') +
        chalk.yellow(contractPath + compiledContract)
    );
    let data = fs.readFileSync(
      path.resolve(getOption('contractPath', contractPath)) + compiledContract,
      'utf8'
    );
    abiUpdate.copyABITo.map((filePath) => {
      let copiedTo = path.join(
        filePath,
        'abis',
        path.basename(compiledContract)
      );
      shell.exec(
        'echo ❯ ' + chalk.green.bold('Copied To: ') + chalk.blueBright(copiedTo)
      );
      fs.writeFileSync(
        path.resolve(copiedTo),
        JSON.stringify(JSON.parse(data).abi, null, 4)
      );
    });
    shell.exec('echo \n');
  });
  shell.exec('echo \n');
}

// run replace
if (!getOption('skipReplace', replace.skip)) {
  for (let i = 0; i < replace.tasks.length; i++) {
    if (skippedTasks('skipReplaceTask').includes(i.toString())) continue;

    if (!replace.tasks[i].skip) {
      shell.exec(
        'echo ❯' +
          chalk.magenta('Task: ') +
          chalk.yellowBright(replace.tasks[i].description)
      );
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
      if (!isBlank(replaceWith) && !isBlank(replace.tasks[i].replace)) {
        shell.cd(path.resolve(replace.tasks[i].path));
        shell
          .ls(
            replace.tasks[i].extensions.length > 1
              ? '{' + replace.tasks[i].extensions + '}'
              : replace.tasks[i].extensions
          )
          .forEach((file) => {
            shell.sed('-i', replace.tasks[i].replace, replaceWith, file);
          });

        let configJson = fs.readFileSync(path.resolve(argv.config), 'utf8');
        configJson = JSON.parse(configJson);
        configJson.replace.tasks[i].replace = replaceWith;

        fs.writeFileSync(
          path.resolve(argv.config),
          JSON.stringify(configJson, null, 4)
        );
      }
      shell.exec('echo \n');
    }
  }
}

if (!getOption('skipSubgraph', subgraph.skip))
  taskRunner(
    subgraph,
    getOption('subgraphPath', subgraphPath),
    'skipSubgraphTask'
  );

// run extras
if (!getOption('skipExtras', extras.skip)) {
  extras.tasks.map((task) => {
    taskRunner(extras, task.path, 'skipExtrasTask');
  });
}

shell.exit(1);
