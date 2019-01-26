const shell = require('shelljs');
const messages = require('./../messages');

exports.copyFiles = (config, err) => {
  const tasks = [
    {
      label: 'cp config/trellis/ansible.cfg '+ config.trellisPath +'/ansible.cfg',
      command: shell.cp(config.configPath +'/trellis/ansible.cfg', config.trellisPath +'/ansible.cfg'),
    },
    {
      label: 'cp config/trellis/build-before.yml '+ config.trellisPath +'/deploy-hooks/build-before.yml',
      command: shell.cp('-f', config.configPath +'/trellis/build-before.yml', config.trellisPath +'/deploy-hooks/build-before.yml'),
    },
    {
      label: 'cp config/trellis/staging.yml '+ config.trellisPath +'/group_vars/staging/wordpress_sites.yml',
      command: shell.cp('-f', config.configPath +'/trellis/staging.yml', config.trellisPath +'/group_vars/staging/wordpress_sites.yml'),
    },
    {
      label: 'cp config/trellis/production.yml '+ config.trellisPath +'/group_vars/production/wordpress_sites.yml',
      command: shell.cp('-f', config.configPath +'/trellis/production.yml', config.trellisPath +'/group_vars/production/wordpress_sites.yml'),
    },
  ];

  return doTasks('Copying Trellis configuration files ❖', ' Trellis configuration files copied', tasks, err);
}

exports.configure = (config, err) => {
  const tasks = [
    {
      label: 'sed -i {{ HOST }} '+ config.host +' '+ config.trellisPath +'/group_vars/staging/wordpress_sites.yml',
      command: shell.sed('-i', '{{ HOST }}', config.host, config.trellisPath +'/group_vars/staging/wordpress_sites.yml'),
    },
    {
      label: 'sed -i {{ CANONICAL_HOST }} '+ config.stagingHost +' '+ config.trellisPath +'/group_vars/staging/wordpress_sites.yml',
      command: shell.sed('-i', '{{ CANONICAL_HOST }}', config.stagingHost, config.trellisPath +'/group_vars/staging/wordpress_sites.yml'),
    },
    {
      label: 'sed -i {{ GITHUB_USER }} '+ config.github +' '+ config.trellisPath +'/group_vars/staging/wordpress_sites.yml',
      command: shell.sed('-i', '{{ GITHUB_USER }}', config.github, config.trellisPath +'/group_vars/staging/wordpress_sites.yml'),
    },
    {
      label: 'sed -i {{ BRANCH }} development '+ config.trellisPath +'/group_vars/staging/wordpress_sites.yml',
      command: shell.sed('-i', '{{ BRANCH }}', 'development', config.trellisPath +'/group_vars/staging/wordpress_sites.yml'),
    },
    {
      label: 'sed -i {{ SSL_ENABLED }} true '+ config.trellisPath +'/group_vars/staging/wordpress_sites.yml',
      command: shell.sed('-i', '{{ SSL_ENABLED }}', 'true', config.trellisPath +'/group_vars/staging/wordpress_sites.yml'),
    },
    {
      label: 'sed -i {{ CACHE_ENABLED }} true '+ config.trellisPath +'/group_vars/staging/wordpress_sites.yml',
      command: shell.sed('-i', '{{ CACHE_ENABLED }}', 'true', config.trellisPath +'/group_vars/staging/wordpress_sites.yml'),
    },
    {
      label: 'sed -i {{ HOST }} '+ config.host +' '+ config.trellisPath +'/group_vars/production/wordpress_sites.yml',
      command: shell.sed('-i', '{{ HOST }}', config.host, config.trellisPath +'/group_vars/production/wordpress_sites.yml'),
    },
    {
      label: 'sed -i {{ CANONICAL_HOST }} '+ config.host +' '+ config.trellisPath +'/group_vars/production/wordpress_sites.yml',
      command: shell.sed('-i', '{{ CANONICAL_HOST }}', config.host, config.trellisPath +'/group_vars/production/wordpress_sites.yml'),
    },
    {
      label: 'sed -i {{ GITHUB_USER }} '+ config.github +' '+ config.trellisPath +'/group_vars/production/wordpress_sites.yml',
      command: shell.sed('-i', '{{ GITHUB_USER }}', config.github, config.trellisPath +'/group_vars/production/wordpress_sites.yml'),
    },
    {
      label: 'sed -i {{ BRANCH }} master '+ config.trellisPath +'/group_vars/production/wordpress_sites.yml',
      command: shell.sed('-i', '{{ BRANCH }}', 'master', config.trellisPath +'/group_vars/production/wordpress_sites.yml'),
    },
    {
      label: 'sed -i {{ SSL_ENABLED }} true '+ config.trellisPath +'/group_vars/production/wordpress_sites.yml',
      command: shell.sed('-i', '{{ SSL_ENABLED }}', 'true', config.trellisPath +'/group_vars/production/wordpress_sites.yml'),
    },
    {
      label: 'sed -i {{ CACHE_ENABLED }} true '+ config.trellisPath +'/group_vars/production/wordpress_sites.yml',
      command: shell.sed('-i', '{{ CACHE_ENABLED }}', 'true', config.trellisPath +'/group_vars/production/wordpress_sites.yml'),
    },
  ];

  return doTasks('Configure Trellis ❖', ' Trellis configured', tasks, err);
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