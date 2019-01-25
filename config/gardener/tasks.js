const init = require('./tasks/init');
const docker = require('./tasks/docker');
const host = require('./tasks/vhost')
const messages = require('./messages');

exports.initializeRoots = (config, err) => {
  messages.doInfo    (' Initializing Roots.io stack.. ');
  init.Trellis       (config, err);
  init.Bedrock       (config, err);
  init.Sage          (config, err);
  init.Soil          (config, err);
  messages.doSuccess (' Roots.io stack initialized. ');
}

exports.initializeDocker = (config, err) => {
  messages.doInfo            (' Initializing Docker.. ');
  docker.copyFiles           (config, err);
  docker.copyConfig          (config, err);
  docker.configureEnv        (config, err);
  docker.createNetwork       (config, err);
  docker.initializeTraefik   (config, err);
  docker.initializeWordPress (config, err);
  messages.doSuccess         (' Docker initialized');
}

exports.vhost = (config, err) => {
  messages.doInfo     (' Configuring vhost.. ');
  host.configure     (config, err);
  messages.doSuccess  (' vhost set');
}
