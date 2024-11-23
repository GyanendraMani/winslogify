const winston = require('winston');
const { getConfig } = require('../config/configManager');
const Utils = require('../utils/utils');

class WinsLogger {
  constructor() {
    this.utils = new Utils();
    const {
      level = 'info',
      format: logFormat = 'timestamped',
      color = false,
      transports = [],
      timestamp = true,
      labels = [],
      metadata = {},
      messageFormat = null,
      handleExceptions = false,
      handleRejections = false,
      logRotation = null,
      silent = false,
    } = getConfig();

    this.logger = winston.createLogger({
      level,
      silent,
      handleExceptions,
      handleRejections,
      transports: this.getTransports(transports, logRotation),
      format: this.getFormat(logFormat, color, timestamp, messageFormat, labels, metadata),
    });
  }

  getFormat(logFormat, color, timestamp, messageFormat, labels, metadata) {
    const timestampFormat = timestamp ? winston.format.timestamp() : winston.format.uncolorize();

    const formats = {
      simple: winston.format.simple(),
      json: winston.format.json(),
      timestamped: winston.format.combine(
        color ? winston.format.colorize() : winston.format.uncolorize(),
        timestampFormat,
        winston.format.timestamp({
          format: this.utils._formattedISTTimestamp()
        }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
      ),
    };

    if (messageFormat) {
      formats.custom = winston.format.printf(({ level, message }) => {
        return messageFormat({ level, message, labels, metadata });
      });
      return formats.custom;
    }

    return formats[logFormat] || formats['timestamped'];
  }

  getTransports(transports, logRotation) {
    const finalTransports = [];

    if (logRotation) {
      finalTransports.push(new winston.transports.File({
        filename: logRotation.filename || 'logs/application.log',
        maxsize: logRotation.maxSize || 10000000, // 10MB
        maxFiles: logRotation.maxFiles || 5,
      }));
    }

    transports.forEach((transport) => {
      if (transport.type === 'console') {
        finalTransports.push(new winston.transports.Console());
      } else if (transport.type === 'file' && transport.filename) {
        finalTransports.push(new winston.transports.File(transport));
      }
      else {
        console.error('Invalid transport type:', transport.type);
      }
    });
    return finalTransports;
  }

  logInfo(message) {
    this.logger.info(message);
  }

  logError(message) {
    this.logger.error(message);
  }
  
}

module.exports = WinsLogger;
