const path = require('path');
const { updateConfig } = require('./config/configManager.js');
const WinsLogger = require('./lib/winsLogger.js');
const LoggerManager = require('./lib/loggerManager.js');
const requestLoggerMiddleware = require('./lib/winsRequestLogger.js');

class WinsLogify {
  constructor(configOptions = {}) {
    this.configUpdate = updateConfig(configOptions);
    this.logger = new WinsLogger();
    this.initialLog = new LoggerManager();
    this.CWD = path.resolve(process.cwd());
  }

  info(message) {
    this.logger.logInfo(message);
  }

  error(message) {
    this.logger.logError(message);
  }

  warn(message) {
    this.logger.logger.warn(message);
  }

  debug(message) {
    this.logger.logger.debug(message);
  }

  startLog() {
    this.initialLog.createLogger(this.CWD);
  }

  requestLogger(options) {
    return requestLoggerMiddleware(options);
  }

  winston() {
    return this.logger.logger;
  }
}

module.exports = WinsLogify;
