const WinsLogger = require('./winsLogger');

class WinsRequestLogger {
  constructor(options = {}) {
    this.format = options.format || ':method :url :status :response-time ms';
    this.logger = new WinsLogger()
  }

  getRequestLoggerMiddleware() {
    return (req, res, next) => {
      const startTime = process.hrtime();

      res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const duration = (seconds * 1000 + nanoseconds / 1e6).toFixed(3);

        // Construct the log line
        const logLine = this.formatLogLine(req, res, duration);
        this.logger.logInfo(logLine);
      });

      next();
    };
  }

  formatLogLine(req, res, duration) {
    return this.format
      .replace(':method', req.method)
      .replace(':url', req.originalUrl || req.url)
      .replace(':status', res.statusCode)
      .replace(':response-time', duration);
  }
}

function requestLoggerMiddleware(options) {
  const loggerInstance = new WinsRequestLogger(options);
  return loggerInstance.getRequestLoggerMiddleware();
}

module.exports = requestLoggerMiddleware;
