const shell = require('shelljs');
const inquirer = require('inquirer');
const pad = require('pad');
const sleep = require('sleep');

const messages = require('./config/messages');
const tasks = require('./config/tasks');

inquirer
  .prompt([
    {
      type: 'input',
      name: 'host',
      message: 'Hostname? (example.com)',
    },
    {
      type: 'input',
      name: 'testHost',
      message: 'Test host? (example.test)',
    },
    {
      type: 'input',
      name: 'stagingHost',
      message: 'Staging host? (staging.example.com)',
    },
    {
      type: 'input',
      name: 'github',
      message: 'What Github user or organization name will be used for deployment?',
    },
    {
      type: 'input',
      name: 'email',
      message: 'Admin email for WordPress?',
    },
  ])
  .then( ( answers ) => {

    const gardenerPath = process.cwd();

    const config = {
      host: answers.host,
      testHost: answers.testHost,
      stagingHost: answers.stagingHost,
      github: answers.github,
      email: answers.email,
      configPath: gardenerPath + '/config',
      bedrockPath: gardenerPath + '/' + answers.host,
      trellisPath: gardenerPath + '/trellis',
      sagePath: gardenerPath + '/' + answers.host + '/web/app/themes/sage',
      soilPath: gardenerPath + '/' + answers.host + '/web/app/plugins/soil',
    };

    let err = null;

    shell.echo  (pad('👩‍🚀 Green light for ignition in ...'));
    sleep.sleep (1);
    shell.echo  (pad('.. 3..,'));
    sleep.sleep (1);
    shell.echo  (pad('.. 2..,'));
    sleep.sleep (1);
    shell.echo  (pad('. 1.... 😬,'));
    sleep.sleep (1);
    shell.echo  (pad('🚀 HYPE'));
    sleep.sleep (1);

    initializeRootsStack(config, err);

  });

function initializeRootsStack(config, err) {
  messages.doInfo            (' Initializing Roots.io stack.. ');
  tasks.initializeTrellis    (config, err);
  tasks.initializeBedrock    (config, err);
  tasks.initializeSage       (config, err);
  tasks.initializeSoil       (config, err);
  messages.doSuccess         (' Roots.io stack initialized. ');
}