const pad = require('pad');
const colors = require('colors');
const shell = require('shelljs');
const sleep = require('sleep');

doPause = () => {
  sleep.sleep(1);
}

exports.doInfo = (msg) => {
  console.log(pad(colors.blue('🔧 '+ msg)));
  return doPause();
}

exports.doSuccess = (msg) => {
  console.log(pad(colors.green('✅ '+ msg)));
  return doPause();
}

exports.doError = (msg) => {
  msg ? console.log(pad(colors.red('❌ '+ msg))) : console.log(pad(colors.red('❌ We\'ve got a problem. Script halted at last step.')));
  doPause();
  shell.exit(1);
}