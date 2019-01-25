const pad = require('pad');
const colors = require('colors');
const shell = require('shelljs');
const sleep = require('sleep');

doPause = () => {
  sleep.sleep(1);
}

exports.doInfo = (msg) => {
  console.log(pad(colors.blue('🔧 '+ msg)));
  return doPause(1);
}

exports.doSuccess = (msg) => {
  console.log(pad(colors.green('✅ '+ msg)));
  return doPause(1);
}

exports.doError = () => {
  console.log(pad(colors.red('❌ We\'ve got a problem. Script halted at last step.')));
  doPause(1);
  shell.exit(1);
}