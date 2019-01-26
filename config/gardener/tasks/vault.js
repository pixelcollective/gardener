const crypto    = require('crypto');
const generator = require('generate-password');
const shell     = require('shelljs');
const messages  = require('../messages');

const generatePassword = () => {
  return generator.generate({ length: 16, numbers: true });
}

const generateWPSalt = () => {
  return crypto.randomBytes(32).toString('base64');
}

exports.fillVault = (env, config, err) => {
  const tasks = [
    {
      label: 'rm -f '+ config.trellisPath +'/group_vars/'+ env +'/vault.yml',
      command: shell.rm('-f', config.trellisPath +'/group_vars/'+ env +'/vault.yml'),
    },
    {
      label: 'cp -f config/trellis/vault.yml '+ config.trellisPath +'/group_vars/'+ env +'/vault.yml',
      command: shell.cp('-f', config.configPath +'/trellis/vault.yml', config.trellisPath +'/group_vars/'+ env +'/vault.yml'),
    },
    {
      label: 'sed -i {{ VAULT_HOST }} '+ config.host +' '+ config.trellisPath +'/group_vars/'+ env +'/vault.yml',
      command: shell.sed('-i', '{{ VAULT_HOST }}', config.host, config.trellisPath +'/group_vars/'+ env +'/vault.yml'),
    },
    {
      label: 'sed -i {{ VAULT_MYSQL_ROOT_PASSWORD }} 🤫  '+ config.trellisPath +'/group_vars/'+ env +'/vault.yml',
      command: shell.sed('-i', '{{ VAULT_MYSQL_ROOT_PASSWORD }}', generatePassword(), config.trellisPath +'/group_vars/'+ env +'/vault.yml'),
    },
    {
      label: 'sed -i {{ VAULT_DB_PASSWORD }} 🤫  '+ config.trellisPath +'/group_vars/'+ env +'/vault.yml',
      command: shell.sed('-i', '{{ VAULT_DB_PASSWORD }}', generatePassword(), config.trellisPath +'/group_vars/'+ env +'/vault.yml'),
    },
    {
      label: 'sed -i {{ VAULT_USERS_PASSWORD }} 🤫  '+ config.trellisPath +'/group_vars/'+ env +'/vault.yml',
      command: shell.sed('-i', '{{ VAULT_USERS_PASSWORD }}', generatePassword(), config.trellisPath +'/group_vars/'+ env +'/vault.yml'),
    },
    {
      label: 'sed -i {{ VAULT_USERS_SALT }} 🤫  '+ config.trellisPath +'/group_vars/'+ env +'/vault.yml',
      command: shell.sed('-i', '{{ VAULT_USERS_SALT }}', generatePassword(), config.trellisPath +'/group_vars/'+ env +'/vault.yml'),
    },
    {
      label: 'sed -i {{ VAULT_AUTH_KEY_SALT }} 🤫  '+ config.trellisPath +'/group_vars/'+ env +'/vault.yml',
      command: shell.sed('-i', '{{ VAULT_AUTH_KEY_SALT }}', generateWPSalt(), config.trellisPath +'/group_vars/'+ env +'/vault.yml'),
    },
    {
      label: 'sed -i {{ VAULT_SECURE_AUTH_KEY }} 🤫  '+ config.trellisPath +'/group_vars/'+ env +'/vault.yml',
      command: shell.sed('-i', '{{ VAULT_SECURE_AUTH_KEY }}', generateWPSalt(), config.trellisPath +'/group_vars/'+ env +'/vault.yml'),
    },
    {
      label: 'sed -i {{ VAULT_LOGGED_IN_KEY }} 🤫  '+ config.trellisPath +'/group_vars/'+ env +'/vault.yml',
      command: shell.sed('-i', '{{ VAULT_LOGGED_IN_KEY }}', generateWPSalt(), config.trellisPath +'/group_vars/'+ env +'/vault.yml'),
    },
    {
      label: 'sed -i {{ VAULT_NONCE_KEY }} 🤫  '+ config.trellisPath +'/group_vars/'+ env +'/vault.yml',
      command: shell.sed('-i', '{{ VAULT_NONCE_KEY }}', generateWPSalt(), config.trellisPath +'/group_vars/'+ env +'/vault.yml'),
    },
    {
      label: 'sed -i {{ VAULT_AUTH_SALT }} 🤫  '+ config.trellisPath +'/group_vars/'+ env +'/vault.yml',
      command: shell.sed('-i', '{{ VAULT_AUTH_SALT }}', generateWPSalt(), config.trellisPath +'/group_vars/'+ env +'/vault.yml'),
    },
    {
      label: 'sed -i {{ VAULT_SECURE_AUTH_SALT }} 🤫  '+ config.trellisPath +'/group_vars/'+ env +'/vault.yml',
      command: shell.sed('-i', '{{ VAULT_SECURE_AUTH_SALT }}', generateWPSalt(), config.trellisPath +'/group_vars/'+ env +'/vault.yml'),
    },
    {
      label: 'sed -i {{ VAULT_LOGGED_IN_SALT }} 🤫  '+ config.trellisPath +'/group_vars/'+ env +'/vault.yml',
      command: shell.sed('-i', '{{ VAULT_LOGGED_IN_SALT }}', generateWPSalt(), config.trellisPath +'/group_vars/'+ env +'/vault.yml'),
    },
    {
      label: 'sed -i {{ VAULT_NONCE_SALT }} 🤫  '+ config.trellisPath +'/group_vars/'+ env +'/vault.yml',
      command: shell.sed('-i', '{{ VAULT_NONCE_SALT }}', generateWPSalt(), config.trellisPath +'/group_vars/'+ env +'/vault.yml'),
    },
  ];
  return doTasks('Generate passwords and salts ❖', ' Generated passwords and salts', tasks, err);
}

exports.encryptVault = (config, err) => {
  const tasks = [
    {
      label: 'cp -f config/trellis/vault_pass '+ config.trellisPath +'/vault_pass',
      command: shell.cp('-f', config.gardenerPath +'/config/trellis/vault_pass', config.trellisPath +'/vault_pass'),
    },
    {
      label: 'sed -i {{ VAULT_PASS }} 🤫  '+ config.trellisPath +'/vault_pass',
      command: shell.sed('-i', '{{ VAULT_PASS }}', generatePassword(), config.trellisPath +'/vault_pass'),
    },
    {
      label: 'cd '+ config.trellisPath,
      command: shell.cd(config.trellisPath),
    },
    {
      label: 'mv config/trellis/vault_pass '+ config.trellisPath +'/.vault_pass',
      command: shell.exec('mv -f '+ config.trellisPath +'/vault_pass '+ config.trellisPath +'/.vault_pass && ansible-vault encrypt group_vars/staging/vault.yml && ansible-vault encrypt group_vars/production/vault.yml'),
    },
  ];
  return doTasks('Encrypt Ansible vault ❖', ' Encrypt Ansible vault', tasks, err);
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