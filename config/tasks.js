const shell = require('shelljs');
const messages = require('./messages');

exports.initializeTrellis = (config, err) => {
  const tasks = [
    {
      label: 'git clone --depth=1 git@github.com:roots/trellis.git ' + config.trellisPath,
      command: shell.exec('git clone --depth=1 git@github.com:roots/trellis.git ' + config.trellisPath),
    },
    {
      label: 'rm -rf '+ config.trellisPath +' /.git',
      command: shell.rm('-rf', config.trellisPath +'/.git'),
    }
  ];

  return doTasks('Initializing Trellis ❖', ' Trellis initialized', tasks, err);
}

exports.initializeBedrock = (config, err) => {
  const tasks = [
    {
      label: 'git clone --depth=1 git@github.com:roots/bedrock.git ' + config.bedrockPath,
      command: shell.exec('git clone --depth=1 git@github.com:roots/bedrock.git ' + config.bedrockPath),
    },
    {
      label: 'rm -rf '+ config.bedrockPath +' /.git',
      command: shell.rm('-rf', config.bedrockPath +'/.git'),
    }
  ];

  return doTasks('Initializing Bedrock ❖', ' Bedrock initialized', tasks, err);
}

exports.initializeSage = (config, err) => {
  const tasks = [
    {
      label: 'git clone --depth=1 git@github.com:roots/sage.git ' + config.sagePath,
      command: shell.exec('git clone --depth=1 git@github.com:roots/sage.git ' + config.sagePath),
    },
    {
      label: 'rm -rf '+ config.sagePath +' /.git',
      command: shell.rm('-rf', config.sagePath +'/.git'),
    }
  ];

  return doTasks('Initializing Sage ❖', ' Sage initialized', tasks, err);
}

exports.initializeSoil = (config, err) => {
  const tasks = [
    {
      label: 'git clone --depth=1 git@github.com:roots/soil.git',
      command: shell.exec('git clone --depth=1 git@github.com:roots/soil.git '+ config.soilPath),
    },
    {
      label: 'rm -rf '+ config.soilPath +' /.git',
      command: shell.rm('-rf', config.soilPath +'/.git'),
    }
  ];

  return doTasks('Initializing Soil ❖', ' Soil initialized', tasks, err);
}

doTasks = (description, success, tasks, err) => {
  messages.doInfo(description);
  for (let task of tasks) {
    (task.command.code) ? messages.doError(err) : messages.doInfo('Complete: '+ task.label);
  }
  messages.doSuccess(success);
}