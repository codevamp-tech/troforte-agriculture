// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url.startsWith('/symbolicate')) {
        req.url = '/index.bundle?platform=android';
      }
      return middleware(req, res, next);
    };
  }
};

module.exports = config;