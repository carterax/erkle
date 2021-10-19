# Erkle 🔀

> Smart contract workflow automation

A simple CLI application which accelerates the process of deploying, migrating and replacing addresses across your contracts, interface and subgraph.

# Why 🧐

Working on a project, i found myself going through multiple folders and files after a new deployment or migration to change the address of contracts and replace ABIS with new versions.

## Installation ✨

Erkle requires [Node.js](https://nodejs.org/) v10+ to run.

In your favorite terminal, enter and run the following.

```sh
npm install -g @pelicandistress/erkle
```

## Usage

> 🚨 **Backup your codebase before usage**

Tasks run in this order

1. Compile
2. Migrate
3. Update ABI
4. Run Subgraph
5. Extra Tasks e.g Running a next server

An erkle configuration file is required for this to work, here's an [example config](https://github.com/carterax/erkle/blob/main/examples/erkle-config.json).
After each run, if you ran the replace task, the new string you entered in the CLI will be written to your erkle config file for the next run.

```sh
erkle --config="/path-to-erkle-config-file.json"
```

#### Config File Options

| Property                           | Description                                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `contractPath`                     | Path to your truffle or hardhat project                                                                  |
| `subgraphPath`                     | Path to your subgraph                                                                                    |
| `abiUpdate.skip`                   | Set to `true` to skip abi copy transfer                                                                  |
| `abiUpdate.compiledContracts`      | Path to compiled contract ABI relative to `contractPath` e.g `/build/contracts/Factory.json`             |
| `abiUpdate.copyABITo`              | Path to where updated ABIs will be transfered to, a folder `abis` will be created at the end of the path |
| `compile.skip`                     | Set to `true` to skip compilation tasks                                                                  |
| `compile.tasks`                    | Sequence of child tasks                                                                                  |
| `compile.tasks[i].description`     | A short description of what the task entails, will be outputted to the CLI                               |
| `compile.tasks[i].script`          | Command which will be executed in the CLI                                                                |
| `compile.tasks[i].skip`            | Set to `true` to skip individual task                                                                    |
| `migration.skip`                   | Set to `true` to skip migration tasks                                                                    |
| `migration.tasks`                  | Sequence of child tasks                                                                                  |
| `migration.tasks[i].description`   | A short description of what the task entails, will be outputted to the CLI                               |
| `migration.tasks[i].script`        | Command which will be executed in the CLI                                                                |
| `migration.tasks[i].skip`          | Set to `true` to skip individual task                                                                    |
| `replace.skip`                     | Set to `true` to skip replace tasks                                                                      |
| `replace.tasks`                    | Sequence of child tasks                                                                                  |
| `replace.tasks[index].description` | A short description of what the task entails, will be outputted to the CLI                               |
| `replace.tasks[index].path`        | Path to where the replacement task occurs, will be outputted to the CLI                                  |
| `replace.tasks[index].replace`     | Old string to replace                                                                                    |
| `replace.tasks[index].extensions`  | Array of file extensions on which changes will be applied e.g `["*.ts", "*.yaml"]`                       |
| `replace.tasks[index].skip`        | Set to `true` to skip individual task                                                                    |
| `subgraph.skip`                    | Set to `true` to skip subgraph tasks                                                                     |
| `subgraph.tasks`                   | Sequence of child tasks                                                                                  |
| `subgraph.tasks[i].description`    | A short description of what the task entails, will be outputted to the CLI                               |
| `subgraph.tasks[i].script`         | Build script command e.g `yarn install`                                                                  |
| `subgraph.tasks[index].skip`       | Set to `true` to skip individual task                                                                    |
| `extras.skip`                      | Set to `true` to skip miscellaneous tasks                                                                |
| `extras.tasks`                     | Sequence of child tasks                                                                                  |
| `extras.tasks[index].description`  | A short description of what the task entails, will be outputted to the CLI                               |
| `extras.tasks[index].skip`         | Set to `true` to skip individual task                                                                    |
| `extras.tasks[index].path`         | Path where task will be executed                                                                         |

#### CLI flags

Options specified via the CLI overrides options specified in the config file:

| Option                         | Description                                      | Usage                                                                              |
| ------------------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `--config`                     | Path to erkle config file                        | `--config=<path-to-folder>`, `--c=<path-to-folder>`                                |
| `--subgraphPath`, `--sp`       | Path to your subgraph folder                     | `--subgraphPath=<path-to-folder>`, `--sp=<path-to-folder>`                         |
| `--contractPath`, `--cp`       | Path to your truffle or hardhat contract project | `--contractPath=<path-to-folder>`, `--cp=<path-to-folder>`                         |
| `--skipCompile`, `--sc`        | Skips compilation tasks                          | `--skipCompile`, `--sc`                                                            |
| `--skipMigration`, `--sm`      | Skips migration task                             | `--skipMigration`, `--sm`                                                          |
| `--skipAbiUpdate` , `--sabi`   | Skips ABI update task                            | `--skipAbiUpdate`, `--sabi`                                                        |
| `--skipReplace`, `--sr`        | Skips string search and replace task             | `--skipReplace`, `--sr`                                                            |
| `--skipSubgraph`, `--ss`       | Skips subgraph tasks                             | `--skipSubgraph`, `--ss`                                                           |
| `--skipExtras`, `se`           | Skips extra tasks at the end                     | `--skipExtras`, `--se`                                                             |
| `--skipCompileTask`, `--sct`   | Skip child compile task(s) by index              | `--skipCompileTask=<comma-separated-indexes>`, `--sct=<comma-separated-indexes>`   |
| `--skipMigrationTask`, `--smt` | Skip child migration task(s) by index            | `--skipMigrationTask=<comma-separated-indexes>`, `--smt=<comma-separated-indexes>` |
| `--skipSubgraphTask`, `--sst`  | Skip child subgraph task(s) by index             | `--skipSubgraphTask=<comma-separated-indexes>`, `--sst=<comma-separated-indexes>`  |
| `--skipReplaceTask`, `--srt`   | Skip child replace task(s) by index              | `--skipReplaceTask=<comma-separated-indexes>`, `--srt=<comma-separated-indexes>`   |
| `--skipExtrasTask`, `--sext`   | Skip child extras task(s) by index               | `--skipExtrasTask=<comma-separated-indexes>`, `--sext=<comma-separated-indexes>`   |

## Development

Contributions are welcome!

## License

MIT

**Free Software, Hell Yeah!**
