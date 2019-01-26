const shell = require('shelljs');
const parseDomain = require('parse-domain')
const inquirer = require('inquirer');
const pad = require('pad');
const sleep = require('sleep');

const tasks = require('./config/gardener/tasks');

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
      label: parseDomain(answers.host).domain,
      host: answers.host,
      testHost: answers.testHost,
      stagingHost: answers.stagingHost,
      github: answers.github,
      email: answers.email,
      gardenerPath: gardenerPath,
      configPath: gardenerPath  +'/config',
      traefikPath: gardenerPath +'/traefik',
      bedrockPath: gardenerPath +'/' + answers.host,
      trellisPath: gardenerPath +'/trellis',
      sagePath: gardenerPath +'/'+ answers.host +'/web/app/themes/sage',
      soilPath: gardenerPath +'/'+ answers.host +'/web/app/plugins/soil',
    };

    let err = null;

    shell.echo  (pad ('👩‍🚀 Green light for ignition in ...'));
    sleep.sleep (1);
    shell.echo  (pad ('.. 3..,'));
    sleep.sleep (1);
    shell.echo  (pad ('.. 2..,'));
    sleep.sleep (1);
    shell.echo  (pad ('. 1.... 😬,'));
    sleep.sleep (1);
    shell.echo  (pad ('🚀 HYPE'));
    sleep.sleep (1);

    tasks.initializeRoots  (config, err);
    tasks.trellis          (config, err);
    tasks.vault            (config, err);
    tasks.vhost            (config, err);
    tasks.initializeDocker (config, err);
    // tasks.bedrock          (config, err);
    // tasks.sage             (config, err);
  });