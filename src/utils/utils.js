const path = require('path');
const { getConfig } = require('../config/configManager');
const moment = require('moment-timezone');


class Utils {
  constructor() {
    this.config = getConfig();
    this.defaultExcludeDirs = this.config.defaultWinsAutoLog.defaultExcludeDirs;
    this.defaultExcludeFiles = this.config.defaultWinsAutoLog.defaultExcludeFiles;
    this.excludeDirs = this.config.winsAutoLogger?.excludeDirs || [];
    this.allowedFileExtensions = this.config.winsAutoLogger?.allowedFileExtensions || ['.js', '.ts'];
    this.includeDirs = this.config.winsAutoLogger?.includeDirs || [];
    this.excludeDirs = this.config.winsAutoLogger?.excludeDirs || [];
    this.includeFiles = this.config.winsAutoLogger?.includeFiles || [];
    this.excludeFiles = this.config.winsAutoLogger?.excludeFiles || [];
  }
  
  _isRequestObject(arg) {
    return arg && typeof arg === 'object' &&
      ('body' in arg || 'params' in arg || 'query' in arg || 'headers' in arg || 'method' in arg || 'url' in arg);
  }

  _formattedISTTimestamp() {
    return moment().tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss.SSSZ')
  }

  _clearModuleCache(modulePath) {
    delete require.cache[require.resolve(modulePath)];
  }

  _clearAppRequireCache() {
    const appDir = process.cwd();
    Object.keys(require.cache).forEach((modulePath) => {
      if (modulePath.startsWith(appDir)) {
        delete require.cache[modulePath];
      }
    });
  }

  shouldProcessDirectory(dirName) {
    if (this.includeDirs.length > 0) {
      return this.includeDirs.includes(dirName) && !this.excludeDirs.includes(dirName);
    }
    return !this.defaultExcludeDirs.includes(dirName) && !this.excludeDirs.includes(dirName);
  }

  shouldProcessFile(fileName) {
    const fileExtension = path.extname(fileName);

    if (!this.allowedFileExtensions.includes(fileExtension)) {
      return false;
    }

    if (this.includeFiles.length > 0) {
      return this.includeFiles.includes(fileName) && !this.excludeFiles.includes(fileName) && !this.defaultExcludeFiles.includes(fileName);
    }

    if (this.excludeFiles.length > 0) {
      return !this.excludeFiles.includes(fileName) && !this.defaultExcludeFiles.includes(fileName);
    }

    return !this.defaultExcludeFiles.includes(fileName);
  }

}

module.exports = Utils;