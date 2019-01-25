const shell = require('shelljs');
const messages = require('./../messages');

exports.copyFiles = (config, err) => {
  const tasks = [
    {
      label: 'cp config/docker-compose/wordpress/Dockerfile ' + config.bedrockPath +'/Dockerfile',
      command: shell.cp('config/docker-compose/wordpress/Dockerfile', config.bedrockPath +'/Dockerfile'),
    },
    {
      label: 'cp config/docker-compose/wordpress/docker-compose.yml ' + config.bedrockPath +'/docker-compose.yml',
      command: shell.cp('config/docker-compose/wordpress/docker-compose.yml', config.bedrockPath +'/docker-compose.yml'),
    },
  ];

  return doTasks('Copying Dockerfile and docker-compose.yml ❖', ' Dockerfile and docker-compose.yml copied', tasks, err);
}

exports.copyConfig = (config, err) => {
  const tasks = [
    {
      label: 'mkdir '+ config.bedrockPath +'/config/docker',
      command: shell.mkdir(config.bedrockPath +'/config/docker'),
    },
    {
      label: 'cp config/docker-compose/wordpress/php.ini ' + config.bedrockPath +'/config/docker/php.ini',
      command: shell.cp('config/docker-compose/wordpress/php.ini', config.bedrockPath +'/config/docker/php.ini'),
    },
    {
      label: 'cp config/docker-compose/wordpress/site.nginx.conf ' + config.bedrockPath +'/config/docker/site.nginx.conf',
      command: shell.cp('config/docker-compose/wordpress/site.nginx.conf', config.bedrockPath +'/config/docker/site.nginx.conf'),
    },
  ];

  return doTasks('Copying Docker configuration ❖', ' Docker configuration copied', tasks, err);
}

doTasks = (description, success, tasks, err) => {
  messages.doInfo(description);
  for (let task of tasks) {
    (task.command.code) ? messages.doError(err) : messages.doInfo('Complete: '+ task.label);
  }
  messages.doSuccess(success);
}