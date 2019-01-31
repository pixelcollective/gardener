const shell = require('shelljs');
const messages = require('./../messages');

exports.copyFiles = (config, err) => {
  const tasks = [
    {
      label: 'cp config/bedrock/Dockerfile ' + config.bedrockPath +'/Dockerfile',
      command: shell.cp(config.gardenerPath +'/config/bedrock/Dockerfile', config.bedrockPath +'/Dockerfile'),
    },
    {
      label: 'cp config/bedrock/docker-compose.yml ' + config.bedrockPath +'/docker-compose.yml',
      command: shell.cp(config.gardenerPath +'/config/bedrock/docker-compose.yml', config.bedrockPath +'/docker-compose.yml'),
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
      label: 'cp config/bedrock/php.ini ' + config.bedrockPath +'/config/docker/php.ini',
      command: shell.cp(config.gardenerPath +'/config/bedrock/php.ini', config.bedrockPath +'/config/docker/php.ini'),
    },
    {
      label: 'cp config/bedrock/site.nginx.conf ' + config.bedrockPath +'/config/docker/site.nginx.conf',
      command: shell.cp(config.gardenerPath +'/config/bedrock/site.nginx.conf', config.bedrockPath +'/config/docker/site.nginx.conf'),
    },
  ];

  return doTasks(config.gardenerPath +'/Copying Docker configuration ❖', ' Docker configuration copied', tasks, err);
}

exports.configureEnv = (config, err) => {
  const tasks = [
    {
      label: 'cp -f config/bedrock/env '+ config.bedrockPath +'/.env',
      command: shell.cp('-f', config.gardenerPath +'/config/bedrock/env', config.bedrockPath +'/.env'),
    },
    {
      label: 'sed -i {{ TEST_HOST }} '+ config.testHost +' '+ config.bedrockPath +'/.env',
      command: shell.sed('-i', '{{ TEST_HOST }}', config.testHost, config.bedrockPath +'/.env'),
    },
    {
      label: 'sed -i {{ PROJECT_LABEL }} '+ config.label +' '+ config.bedrockPath +'/.env',
      command: shell.sed('-i', '{{ PROJECT_LABEL }}', config.label, config.bedrockPath +'/.env'),
    },
  ];

  return doTasks('Configuring local .env ❖', ' Local .env configured', tasks, err);
}

exports.createNetwork = (config, err) => {
  const tasks = [
    {
      label: 'docker network create traefikify',
      command: shell.exec('docker network create traefikify'),
    },
  ];

  return doTasks('Creating Docker network ❖', ' Docker network created', tasks, err, true);
}

exports.initializeTraefik = (config, err) => {
  const tasks = [
    {
      label: 'cd '+ config.traefikPath,
      command: shell.cd(config.traefikPath),
    },
    {
      label: 'docker-compose up -d -V',
      command: shell.exec('docker-compose up -d -V'),
    },
  ];

  return doTasks('Initializing Traefik ❖', ' Traefik initialized', tasks, err);
}

exports.initializeWordPress = (config, err) => {
  const tasks = [
    {
      label: 'cd '+ config.bedrockPath,
      command: shell.cd(config.bedrockPath),
    },
    {
      label: 'docker-compose up -d -V',
      command: shell.exec('docker-compose up -d -V'),
    },
  ];

  return doTasks('Initializing WordPress container ❖', ' WordPress container initialized', tasks, err);
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