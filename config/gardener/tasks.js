const init = require('./tasks/init');
const messages = require('./messages');

exports.initializeRoots = (config, err) => {
  messages.doInfo           (' Initializing Roots.io stack.. ');
  init.initializeTrellis    (config, err);
  init.initializeBedrock    (config, err);
  init.initializeSage       (config, err);
  init.initializeSoil       (config, err);
  messages.doSuccess        (' Roots.io stack initialized. ');
}
