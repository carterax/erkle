# Erkle 🔀

> Smart contract workflow automation

A small CLI tool which accelerates the process of deploying, migrating and replacing addresses across your contracts, interface and subgraph.

# Why 🧐

Working on a project, i found myself going through multiple folders and files after a new deployment or migration to change the address of contracts and replace ABIS with new versions.

## Installation ✨

Erkle requires [Node.js](https://nodejs.org/) v10+ to run.

In your favorite terminal, enter and run the following.

```sh
npm install -g @pelicandistress/erkle
```

## Usage

An erkle configuration file is required for this to work, here's an [example config](https://github.com/carterax/erkle/blob/main/examples/erkle-config.json).
After each run, if you ran the replace tasks the new string for each task is automatically inserted into `replace.tasks[index].replace` for the next run.

```sh
erkle --config="/path-to-config/erkle-config.json"
```

#### Config File Options

| Property                            | Description                                                                                              |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `contractPath`                      | Path to your truffle or hardhat project                                                                  |
| `subgraphPath`                      | Path to your subgraph                                                                                    |
| `contractCompile.run`               | Set to `true` to compile the contract                                                                    |
| `contractCompile.script`            | Compilation script e.g `npm run compile`                                                                 |
| `contractMigration.run`             | Set to `true` to migrate the contract                                                                    |
| `contractMigration.script`          | Migration script e.g `npm run migration`                                                                 |
| `contractABICopy.run`               | Set to `true` to copy contract ABI to specified paths                                                    |
| `contractABICopy.compiledContracts` | Path to compiled contract ABI relative to `contractPath` e.g `/build/contracts/Factory.json`             |
| `contractABICopy.copyABITo`         | Path to where updated ABIs will be transfered to, a folder `abis` will be created at the end of the path |
| `replace.run`                       | Set to `true` to run replace tasks                                                                       |
| `replace.tasks`                     | An array of text replacement tasks to run                                                                |
| `replace.tasks[index].description`  | A short description of what the task is all about, will be outputted to the CLI                          |
| `replace.tasks[index].path`         | Path to where the replacement task occurs, will be outputted to the CLI                                  |
| `replace.tasks[index].replace`      | New string to replace old string with                                                                    |
| `replace.tasks[index].extensions`   | Array of file extensions on which changes will be applied e.g `["*.ts", "*.yaml"]`                       |
| `subgraphCodegen.run`               | Set to `true` to run codegen in your subgraph                                                            |
| `subgraphCodegen.script`            | Codegen script command e.g `yarn codegen`                                                                |
| `subgraphBuild.run`                 | Set to `true` to build your subgraph                                                                     |
| `subgraphBuild.script`              | Build script command e.g `yarn build`                                                                    |
| `subgraphDeploy.run`                | Set to `true` to deploy your subgraph                                                                    |
| `subgraphDeploy.script`             | Deploy script command e.g `yarn deploy`                                                                  |

#### CLI Options

Options specified via the CLI overrides options specified in the config file:

| Option              | Description                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `--config`          | Path to erkle config file                                                   |
| `--subgraphPath`    | Path to subgraph folder                                                     |
| `--contractPath`    | Path to truffle or hardhat contract project                                 |
| `--compileContract` | Set to `true` to compile the contract                                       |
| `--migrateContract` | Set to `true` to migrate the contract                                       |
| `--copyABI`         | Set to `true` to copy ABI from compilation to specified path in config file |
| `--replace`         | Set to `true` to run replace tasks specified in config file                 |
| `--codegen`         | Set to `true` to run codegen in your subgraph                               |
| `--graphBuild`      | Set to `true` to build your subgraph                                        |
| `--graphDeploy`     | Set to `true` to deploy your subgraph                                       |

## Development

Contributions are welcome!

## License

MIT

**Free Software, Hell Yeah!**
