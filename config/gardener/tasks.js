const init     = require('./tasks/init');
const docker   = require('./tasks/docker');
const host     = require('./tasks/vhost');
const vault    = require('./tasks/vault');
const trellis  = require('./tasks/trellis');
const bedrock  = require('./tasks/bedrock');
const sage     = require('./tasks/sage');
const messages = require('./messages');

exports.initializeRoots = (config, err) => {
  messages.doInfo    (' Initializing Roots.io stack.. ');
  init.Trellis       (config, err);
  init.Bedrock       (config, err);
  init.Sage          (config, err);
  init.Soil          (config, err);
  init.Git           (config, err);
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
  messages.doInfo    (' Configuring vhost.. ');
  host.configure     (config, err);
}

exports.vault = (config, err) => {
  messages.doInfo    (' Keeping secrets');
  vault.fillVault    ('staging', config, err);
  vault.fillVault    ('production', config, err);
  vault.encryptVault (config, err);
  messages.doSuccess    (' Secrets kept');
}

exports.trellis = (config, err) => {
  messages.doInfo    (' Configure Trellis');
  trellis.copyFiles  (config, err);
  trellis.configure  (config, err);
  messages.doSuccess  (' Trellis configured ');
}

exports.bedrock = (config, err) => {
  messages.doInfo    (' Install Bedrock');
  bedrock.install    (config, err);
  messages.doSuccess (' Bedrock installed ');
}

exports.sage = (config, err) => {
  messages.doInfo    (' Install Sage');
  sage.install       (config, err);
  messages.doSuccess (' Sage installed ');
}
