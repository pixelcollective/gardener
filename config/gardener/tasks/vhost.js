const hostile = require('hostile');
const messages = require('../messages');

exports.configure = (config, err) => {
  const tasks = [
    {
      label: 'Setting rule in /etc/hosts',
      command: hostile.set('127.0.0.1', config.testHost),
    },
  ];
  return doTasks('Configure vhost ❖', ' Configure vhost', tasks, err);
}

doTasks = (description, success, tasks, err, ignore) => {
  messages.doInfo(description);
  for (let task of tasks) {
    if(!ignore) {
      (task.command.code) ? messages.doError('Failed: '+ task.label) : messages.doInfo('Complete: '+ task.label);
    } else {
      task.command;
      messages.doInfo('Attempted: '+ task.label);
    }
  }
  messages.doSuccess(success);
}
