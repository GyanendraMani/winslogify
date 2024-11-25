const WinsLogger = require('./winsLogger');

class WinsRequestLogger {
  constructor(options = {}) {
    this.format = options.format || ':method :url :status :response-time ms';
    this.logHeaders = options.logHeaders || false;
    this.logBody = options.logBody || false;
    this.logger = new WinsLogger();
  }

  getRequestLoggerMiddleware() {
    return (req, res, next) => {
      const startTime = process.hrtime();

      res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const duration = (seconds * 1000 + nanoseconds / 1e6).toFixed(3);

        const logLine = this.formatLogLine(req, res, duration);
        this.logger.logInfo(logLine);

        if (this.logHeaders) {
          this.logger.logInfo(`Headers: ${JSON.stringify(req.headers)}`);
        }

        if (this.logBody && req.body) {
          this.logger.logInfo(`Body: ${JSON.stringify(req.body)}`);
        }
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
