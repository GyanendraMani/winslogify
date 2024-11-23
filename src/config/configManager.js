const path = require('path');
const fs = require('fs');

let defaultConfig = {
  level: 'info',
  format: 'simple',
  color: false,
  timestamp: true,
  transports: [
    { type: 'console' }
  ],
  handleExceptions: false,
  handleRejections: false,
  silent: false,
  winsAutoLogs: true,
  winsAutoLogger: {},
  defaultWinsAutoLog: {
    defaultExcludeDirs: ['node_modules', '__test__', 'build', 'dist', 'public', 'assets'],
    defaultExcludeFiles: [/\.config\.js$/, /\.json$/, /\.env$/, /\.test\.js$/],
  }
}

let config = { ...defaultConfig };
const userConfigPath = path.resolve(process.cwd(), 'config.wins.js');
if (fs.existsSync(userConfigPath)) {
  const userConfig = require(userConfigPath);
  config = { ...config, ...userConfig };
}

class ConfigManager {
  static get(key) {
    return config[key];
  }

  static set(key, value) {
    config[key] = value;
  }

  static getConfig() {
    return config;
  }

  static updateConfig(userConfig) {
    config = { ...config, ...userConfig };
    return config
  }

  static reset() {
    config = { ...defaultConfig };
  }
}

module.exports = ConfigManager;
