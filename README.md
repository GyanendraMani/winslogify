
# WinsLogify

WinsLogify is a customizable logging library that wraps around `winston` and provides convenient methods for logging, middleware integration, and advanced configuration. 


## Installation

```bash
npm install winslogify
```



### Example Usage

```javascript
const WinsLogify = require('winslogify');

// Initialize a logger instance with custom configuration
const logger = new WinsLogify({
  level: 'info',
  format: 'timestamped',
});

// Log messages
logger.info('This is an info message');
logger.error('This is an error message');
logger.debug('This is a debug message');
```

## Request Logger Middleware

WinsLogify provides a middleware function to log HTTP requests. It can be easily integrated into any Express application.

### Usage Example

```javascript
const express = require('express');
const WinsLogify = require('winslogify');

// Initialize logger
const logger = new WinsLogify({
  level: 'info',
  format: 'timestamped',
});

const app = express();

// Use the request logger middleware
app.use(logger.requestLogger());

// Example route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(3000, () => {
  logger.info('Server is running on port 3000');
});
```

## Request Logger Middleware

WinsLogify provides a middleware function to log HTTP requests. It can be easily integrated into any Express application.

### Usage Example

```javascript
const express = require('express');
const WinsLogify = require('winslogify');

// Initialize logger
const logger = new WinsLogify({
  level: 'info',
  format: 'timestamped',
});

const app = express();

// Use the request logger middleware
app.use(logger.requestLogger({
  format: ':method :url :status :response-time ms',
  logHeaders: true,
  logBody: true,
}));

// Example route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(3000, () => {
  logger.info('Server is running on port 3000');
});
```

# Auto Logger in WinsLogify

`WinsLogify` provides an automatic logger setup that can monitor specified directories in your project and log function calls, enabling easy tracing and debugging. It automatically detects changes and logs functions within the specified directories.

## Configuration

### Configuration Options
You can pass the configuration options to the `WinsLogify` constructor. This should be done in the **project entry file** before any other code.

- **winsAutoLogger**:
  - **srcDir**: The source directory where your code resides (e.g., `'src'`).
  - **includeDirs**: An array of directories within the source folder to monitor (e.g., `['controller', 'services']`).

## Example Usage

```javascript
const WinsLogify = require("winslogify");

const logger = new WinsLogify({
  level: 'info',
  format: 'timestamped',
  winsAutoLogger: {
    srcDir: 'src',
    includeDirs: ['controller', 'services'],
  }
});

logger.startAutoLogger();

const express = require('express');

const app = express();

// Start the server
app.listen(3000, () => {
  logger.info('Server is running on port 3000');
});
```



