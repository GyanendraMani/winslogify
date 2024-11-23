const Utils = require('../utils/utils');
const WinsLogger = require('./winsLogger');

class ConsoleLogger {
  constructor() {
    this.utils = new Utils();
    this.logger = new WinsLogger();
  }
  infoConsole(funcName, args, moduleName) {
    const filteredArgs = args.filter(arg => this.utils._isRequestObject(arg)).map(arg => {
      const logData = {};
      if (Object.keys(arg.body).length) logData.body = arg.body;
      if (Object.keys(arg.params).length) logData.params = arg.params;
      if (Object.keys(arg.query).length) logData.query = arg.query;
      return logData;
    });
    const data = filteredArgs.length ? JSON.stringify(filteredArgs[0]) : JSON.stringify(args[0]);
    this.logger.logInfo(`Entering module: ${moduleName} | Function: ${funcName} | Arguments: ${data}`);
  }

  errorConsole(funcName, error, moduleName) {
    this.logger.logError(`Error in function: ${funcName} of module: ${moduleName}`);
    console.error('Error Details:', error)
  }
}

module.exports = ConsoleLogger;