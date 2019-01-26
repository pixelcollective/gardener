const shell = require('shelljs');
const messages = require('../messages');

exports.install = (config, err) => {
  const tasks = [
    {
      label: 'cd '+ config.sagePath +'/',
      command: shell.cd(config.sagePath),
    },
    {
      label: 'composer install',
      command: shell.exec('composer install'),
    },
    {
      label: 'composer update',
      command: shell.exec('composer update'),
    },
    {
      label: 'yarn',
      command: shell.exec('yarn'),
    },
    {
      label: 'yarn build',
      command: shell.exec('yarn build'),
    }
  ];
  doTasks('Install Sage ❖', ' Sage installed', tasks, err, true);
}

doTasks = (description, success, tasks, err, ignore) => {
  messages.doInfo(description);
  for (let task of tasks) {
    task.command;
    messages.doInfo('Attempted: '+ task.label);
  }
}
