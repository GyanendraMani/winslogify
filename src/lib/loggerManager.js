const fs = require('fs');
const path = require('path');
const WinsLogger = require('./winsLogger');
const { getConfig } = require('../config/configManager');
const Utils = require('../utils/utils');
const ConsoleLogger = require('./console');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

class FunctionLoggerManager {
  constructor() {
    this.config = getConfig();
    this.logger = new WinsLogger();
    this.utils = new Utils();
    this.console = new ConsoleLogger();
    this.defaultExcludeDirs = this.config?.defaultWinsAutoLog?.defaultExcludeDirs || [];
    this.defaultExcludeFiles = this.config?.defaultWinsAutoLog?.defaultExcludeFiles || [];
    this.srcDir = this.config.winsAutoLogger?.srcDir;
  }

  createLogger(baseDir) {
    this._initializeLoggerForModules(path.join(baseDir, `${this.srcDir ?? ''}`));
  }

  _initializeLoggerForModules(rootDir) {
    const folderDependencies = this._collectFolderDependencies(rootDir);
    const patchingOrder = this._determineFolderPatchingOrder(folderDependencies);
    this.utils._clearAppRequireCache();

    patchingOrder.forEach((folderName) => {
      const folderPath = path.join(rootDir, folderName);
      this._applyLogsToFunc(folderPath, folderName);
    });
  }

  _collectFolderDependencies(rootDir) {
    const folderDependencies = {};

    fs.readdirSync(rootDir).forEach((folder) => {
      const folderPath = path.join(rootDir, folder);
      const stat = fs.statSync(folderPath);

      if (stat.isDirectory() && this.utils.shouldProcessDirectory(folder)) {
        folderDependencies[folder] = this._analyzeFolderDependencies(folderPath);
      }
    });
    return folderDependencies;
  }

  _analyzeFolderDependencies(folderPath) {
    const dependencies = new Set();

    fs.readdirSync(folderPath).forEach((file) => {
      const fullPath = path.join(folderPath, file);
      if (this.utils.shouldProcessFile(file)) {
        this.utils._clearModuleCache(fullPath);
        const module = require(fullPath);
        Object.keys(module).forEach((funcName) => {
          if (typeof module[funcName] === 'function') {
            const calledFunctions = this._findCalledModules(module[funcName]);
            calledFunctions.forEach((func) => dependencies.add(func));
          }
        });
      }
    });

    return Array.from(dependencies);
  }

  _findCalledModules(func) {
    const calledModules = new Set();
    const funcString = func.toString();

    try {
      const ast = parser.parse(funcString, {
        sourceType: 'script',
        plugins: ['optionalChaining', 'nullishCoalescingOperator'],
      });

      traverse(ast, {
        CallExpression(path) {
          if (path.node.callee.type === 'Identifier') {
            calledModules.add(path.node.callee.name);
          }
        },
      });
    } catch (error) {
      console.error('Error parsing function:', error);
      throw error;
    }

    return Array.from(calledModules);
  }

  _determineFolderPatchingOrder(folderDependencies) {
    const visited = new Set();
    const order = [];

    const visit = (folder) => {
      if (!visited.has(folder)) {
        visited.add(folder);
        (folderDependencies[folder] || []).forEach(visit);
        order.push(folder);
      }
    };

    Object.keys(folderDependencies).forEach(visit);

    return order.reverse();
  }

  _applyLogsToFunc(folderPath, folderName) {
    fs.readdirSync(folderPath).forEach((file) => {
      const fullPath = path.join(folderPath, file);

      if (this.utils.shouldProcessFile(file)) {
        const module = require(fullPath);
      
        Object.keys(module).forEach((funcName) => {
          const originalFunc = module[funcName];
          if (typeof originalFunc === 'function') {
            module[funcName] = async (...args) => {
              this.console.infoConsole(funcName, args, folderName);
              try {
                const result = await originalFunc.apply(module, args);
                // this.console.infoConsole(`Exiting function: ${funcName} in ${folderName}`);
                return result;
              } catch (error) {
                this.console.errorConsole(funcName, error, folderName);
                throw error;
              }
            };
          }
          
        });
      }
    });
  }

}

module.exports = FunctionLoggerManager;
