const init = require('./tasks/init');
const docker = require('./tasks/docker');
const messages = require('./messages');

exports.initializeRoots = (config, err) => {
  messages.doInfo    (' Initializing Roots.io stack.. ');
  init.Trellis       (config, err);
  init.Bedrock       (config, err);
  init.Sage          (config, err);
  init.Soil          (config, err);
  messages.doSuccess (' Roots.io stack initialized. ');
}

exports.configureDocker = (config, err) => {
  messages.doInfo    (' Initializing dev Docker.. ');
  docker.copyFiles   (config, err);
  docker.copyConfig  (config, err);
  messages.doSuccess (' Docker initialized');
}
