const hostile = require('hostile');
const messages = require('../messages');

exports.configure = (config, err) => {
  const tasks = [
    {
      label: 'Setting rule in /etc/hosts',
      command: hostile.set('127.0.0.1', config.testHost),
    },
  ];
  doTasks('Configure vhost ❖', ' Configure vhost', tasks, err, true);
}

doTasks = (description, success, tasks, err, ignore) => {
  messages.doInfo(description);
  for (let task of tasks) {
    task.command;
    messages.doInfo('Attempted: '+ task.label);
  }
}
