const shell = require('shelljs');
const messages = require('../messages');

exports.install = (config, err) => {
  const tasks = [
    {
      label: 'cd '+ config.bedrockPath +'/',
      command: shell.cd(config.bedrockPath),
    },
  ];
  doTasks('Install Bedrock ❖', ' Bedrock installed', tasks, err, true);
}

doTasks = (description, success, tasks, err, ignore) => {
  messages.doInfo(description);
  for (let task of tasks) {
    task.command;
    messages.doInfo('Attempted: '+ task.label);
  }
}
