const shell = require('shelljs');
const messages = require('../messages');

exports.install = (config, err) => {
  const tasks = [
    {
      label: 'cp -f '+ config.gardenerPath +'/config/sage/config.json '+ config.sagePath +'/resources/assets/config.json',
      command: shell.cp(config.gardererPath +'/config/sage/config.json', config.sagePath +'/resources/assets/config.json'),
    },
    {
      label: 'sed -i {{ DEV_HOST }} '+ config.testHost +' '+ config.sagePath +'/resources/assets/config.json',
      command: shell.sed('-i', '{{ DEV_HOST }}', config.testHost, config.sagePath +'/resources/assets/config.json'),
    },
    {
      label: 'cd '+ config.sagePath +'/',
      command: shell.cd(config.sagePath),
    },
    {
      label: 'yarn',
      command: shell.exec('yarn'),
    },
    {
      label: 'yarn build',
      command: shell.exec('yarn build'),
    },
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
