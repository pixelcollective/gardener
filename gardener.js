var shell = require('shelljs');
var colors = require('colors');
var inquirer = require('inquirer');
var pad = require('pad');

inquirer
  .prompt([
    { type: 'input', name: 'basePath', message: 'What is the path you\'d like to install into? Include a trailing slash. (example: ~/sites/)' },
    { type: 'input', name: 'siteHost', message: 'What is your domain? (`example` in example.com)' },
    { type: 'input', name: 'siteTLD', message: 'What is your TLD? (`com` in example.com)' },
    { type: 'input', name: 'testTLD', message: 'What is your desired local TLD? (`test` in example.test)' },
    { type: 'input', name: 'githubUsername', message: 'What is your github username?' },
    { type: 'input', name: 'adminEmail', message: 'What is your email? (used for WP admin)' }
  ])
  .then(function (answers) {
    gardener = process.cwd(); 
    basePath = answers.basePath;
    domain = answers.siteHost;
    tld = answers.siteTLD;
    test_tld = answers.testTLD;
    github_username = answers.githubUsername;
    admin_email = answers.adminEmail;
    site = {
      url: domain +'.'+ tld ,
      path: basePath + domain +'.'+ tld +'/',
      bedrock: basePath + domain +'.'+ tld +'/site',
      trellis: basePath + domain +'.'+ tld +'/trellis',
      sage: basePath + domain +'.'+ tld +'/site/web/app/themes/' + domain +'/',
    };
    
    shell.echo('Let\'s kick things off\n--------------------------------');
    if(cloneRootsStack(gardener, basePath, domain, tld, test_tld, github_username, admin_email, site) !== false) {
      console.log(colors.red('Bummer! Could not clone Roots.'));
      shell.exit(1);
    }
    if(configureAnsible(gardener, basePath, domain, tld, test_tld, github_username, admin_email, site) !== false) {
      console.log(colors.red('Bummer! Could not configure Ansible.'));
      shell.exit(1);
    }
    if(configureDevelopment(gardener, basePath, domain, tld, test_tld, github_username, admin_email, site) !== false) {
      console.log(colors.red('Bummer! Could not configure Development'));
      shell.exit(1);
    }
    if(configureStaging(gardener, basePath, domain, tld, test_tld, github_username, admin_email, site) !== false) {
      console.log(colors.red('Bummer! Could not configure Staging.'));
      shell.exit(1);
    }
    if(configureProduction(gardener, basePath, domain, tld, test_tld, github_username, admin_email, site) !== false) {
      console.log(colors.red('Bummer! Could not configure Production.'));
      shell.exit(1);
    }
    if(configureSage(gardener, basePath, domain, tld, test_tld, github_username, admin_email, site) !== false) {
      console.log(colors.red('Bummer! Could not configure Sage'));
      shell.exit(1);
    }
    if(createVaultPass(gardener, basePath, domain, tld, test_tld, github_username, admin_email, site) !== false) {
      console.log(colors.red('Bummer! Could not create and configure vault pass'));
      shell.exit(1);
    }
    if(encryptVaults(gardener, basePath, domain, tld, test_tld, github_username, admin_email, site) !== false) {
      console.log(colors.red('Bummer! Could not encrypt the vaults'));
      shell.exit(1);
    }
    if(gitIt(gardener, basePath, domain, tld, test_tld, github_username, admin_email, site) !== false) {
      console.log(colors.red('Bummer! Could not instantiate git repository.'));
      shell.exit(1);
    }
    if(startAnsible(gardener, basePath, domain, tld, test_tld, github_username, admin_email, site) !== false) {
      console.log(colors.red('Bummer! Could not start VM'));
      shell.exit(1);
    }
  });

function cloneRootsStack() {
  console.log(pad(colors.green('Cloning Roots.io stack')));
  var code = false;

  if(shell.mkdir(site.path).code !== 0) code = true;
  if(shell.exec('git clone --depth=1 git@github.com:roots/trellis.git '+ site.trellis).code !== 0) code = true;
  if(shell.rm('-rf', site.trellis +'/.git').code !== 0) code = true;
  if(shell.exec('git clone --depth=1 git@github.com:roots/bedrock.git '+ site.bedrock).code !== 0) code = true;
  if(shell.rm('-rf', site.bedrock +'/.git').code !== 0) code = true;
  if(shell.cd(site.bedrock +'/web/app/themes').code !== 0) code = true;
  if(shell.exec('git clone --depth=1 git@github.com:roots/sage.git '+ domain).code !== 0) code = true;
  if(shell.cd('./'+ domain).code !== 0) code = true;
  if(shell.rm('-rf', site.bedrock +'/web/app/themes/' + domain +'/.git').code !== 0) code = true;
  if(shell.cd(site.bedrock +'/web/app/plugins').code !== 0) code = true;
  if(shell.exec('git clone git@github.com:roots/soil.git '+ site.bedrock +'/web/app/plugins/soil').code !== 0) code = true;
  if(shell.rm('-rf', site.bedrock + '/web/app/plugins/soil/.git').code !== 0) code = true;
  
  return code;
}

function configureAnsible() {
  console.log(pad(colors.yellow('Configuring Ansible')));
  var code = false;

  if(shell.cd(site.trellis).code !== 0) code = true;
  if(shell.rm(site.trellis + '/ansible.cfg').code !== 0) code = true;
  if(shell.cp(gardener + '/configs/trellis/ansible.cfg', site.trellis + '/ansible.cfg').code !== 0) code = true;
  if(shell.rm('server.yml').code !== 0) code = true;
  if(shell.cp(gardener + '/configs/trellis/server.yml', site.trellis + '/server.yml').code !== 0) code = true;
  
  return code;
}

function configureDevelopment() {
  console.log(pad(colors.green('Configuring Development')));
  var code = false;

  if(shell.rm(site.trellis +'/group_vars/development/wordpress_sites.yml').code !== 0) code = true;
  if(shell.cp(gardener +'/configs/trellis/wordpress_sites.dev.yml', site.trellis + '/group_vars/development/wordpress_sites.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ ADMIN_EMAIL }}', admin_email, site.trellis + '/group_vars/development/wordpress_sites.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ DOMAIN }}', domain, site.trellis + '/group_vars/development/wordpress_sites.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ SITE_URL }}', site.url, site.trellis + '/group_vars/development/wordpress_sites.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ TEST_TLD }}', test_tld, site.trellis + '/group_vars/development/wordpress_sites.yml').code !== 0) code = true;

  if(shell.rm(site.trellis + '/group_vars/development/vault.yml').code !== 0) code = true;
  if(shell.cp(gardener +'/configs/trellis/vault.dev.yml', site.trellis + '/group_vars/development/vault.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ SITE_URL }}', site.url, site.trellis + '/group_vars/development/vault.yml').code !== 0) code = true;

  if(shell.rm(site.trellis + '/group_vars/development/main.yml').code !== 0) code = true;
  if(shell.cp(gardener +'/configs/trellis/main.dev.yml', site.trellis + '/group_vars/development/main.yml').code !== 0) code = true;

  return code;
}

function configureStaging() {
  console.log(pad(colors.blue('Configuring Staging')));
  var code = false;

  if(shell.rm(site.trellis +'/group_vars/staging/wordpress_sites.yml').code !== 0) code = true;
  if(shell.cp(gardener +'/configs/trellis/wordpress_sites.staging.yml', site.trellis + '/group_vars/staging/wordpress_sites.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ GITHUB_USER }}', github_username, site.trellis + '/group_vars/staging/wordpress_sites.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ SITE_URL }}',    site.url,        site.trellis + '/group_vars/staging/wordpress_sites.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ SITE_DOMAIN }}', domain,          site.trellis + '/group_vars/staging/wordpress_sites.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ SITE_TLD }}',    tld,             site.trellis + '/group_vars/staging/wordpress_sites.yml').code !== 0) code = true;

  if(shell.rm(site.trellis + '/group_vars/staging/vault.yml').code !== 0) code = true;
  if(shell.cp(gardener +'/configs/trellis/vault.staging.yml', site.trellis + '/group_vars/staging/vault.yml').code !== 0) code = true;

  if(shell.sed('-i', '{{ SITE_URL }}',        site.url,                            site.trellis + '/group_vars/staging/vault.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ MYSQL_ROOT_PASS }}', shell.exec('pwgen -Bs 20 1').stdout, site.trellis + '/group_vars/staging/vault.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ VAULT_PASS }}',      shell.exec('pwgen -Bs 20 1').stdout, site.trellis + '/group_vars/staging/vault.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ VAULT_SALT }}',      '"' + shell.exec('pwgen -Bs 20 1').stdout + '"', site.trellis + '/group_vars/staging/vault.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ DB_PASSWORD }}',     shell.exec('pwgen -Bs 20 1').stdout, site.trellis + '/group_vars/staging/vault.yml').code !== 0) code = true;

  if(shell.rm(site.trellis + '/group_vars/staging/main.yml').code !== 0) code = true;
  if(shell.cp(gardener +'/configs/trellis/main.staging.yml', site.trellis + '/group_vars/staging/main.yml').code !== 0) code = true;

  return code;
}

function configureProduction() {
  console.log(pad(colors.cyan('Configuring Production')));
  var code = false;

  if(shell.rm(site.trellis +'/group_vars/production/wordpress_sites.yml').code !== 0) code = true;
  if(shell.cp(gardener + '/configs/trellis/wordpress_sites.production.yml', site.trellis + '/group_vars/production/wordpress_sites.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ GITHUB_USER }}', github_username, site.trellis + '/group_vars/production/wordpress_sites.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ SITE_URL }}',    site.url, site.trellis + '/group_vars/production/wordpress_sites.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ SITE_DOMAIN }}', domain, site.trellis + '/group_vars/production/wordpress_sites.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ SITE_TLD }}',    tld, site.trellis + '/group_vars/production/wordpress_sites.yml').code !== 0) code = true;

  if(shell.rm(site.trellis + '/group_vars/production/vault.yml').code !== 0) code = true;
  if(shell.cp(gardener +'/configs/trellis/vault.production.yml', site.trellis + '/group_vars/production/vault.yml').code !== 0) code = true;

  if(shell.sed('-i', '{{ SITE_URL }}',        site.url,                                    site.trellis + '/group_vars/production/vault.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ MYSQL_ROOT_PASS }}', shell.exec('pwgen -Bs 20 1').stdout,         site.trellis + '/group_vars/production/vault.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ VAULT_PASS }}',      shell.exec('pwgen -Bs 20 1').stdout,         site.trellis + '/group_vars/production/vault.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ VAULT_SALT }}',      '"'+shell.exec('pwgen -Bs 20 1').stdout+'"', site.trellis + '/group_vars/production/vault.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ DB_PASSWORD }}',     shell.exec('pwgen -Bs 20 1').stdout,         site.trellis + '/group_vars/production/vault.yml').code !== 0) code = true;

  if(shell.rm(site.trellis + '/group_vars/production/main.yml').code !== 0) code = true;
  if(shell.cp(gardener +'/configs/trellis/main.production.yml', site.trellis + '/group_vars/production/main.yml').code !== 0) code = true;

  return code;
}

function configureSage() {
  console.log(pad(colors.magenta('Configuring Sage')));
  var code = false;

  if(shell.rm(site.trellis +'/deploy-hooks/build-before.yml').code !== 0) code = true;
  if(shell.cp(gardener +'/configs/trellis/build-before.yml', site.trellis + '/deploy-hooks/build-before.yml').code !== 0) code = true;
  if(shell.sed('-i', '{{ SITE_URL }}', site.url, site.trellis + '/deploy-hooks/build-before.yml').code !== 0) code = true;  

  return code;
}

function createVaultPass() {
  console.log(pad(colors.blue('Configuring Vault Pass')));
  var code = false;

  if(shell.cd(site.trellis).code !== 0) code = true
  if(shell.cp(gardener +'/configs/trellis/.vault_pass', site.trellis + '/.vault_pass').code !== 0) code = true;
  if(shell.sed('-i', '{{ VAULT_PASS }}', shell.exec('pwgen -Bs 20 1').stdout, site.trellis + '/.vault_pass').code !== 0) code = true;

  return code;
}

function encryptVaults() {
  console.log(pad(colors.yellow('Encrypting Vaults')));
  var code = false;

  if(shell.cd(site.trellis).code !== 0) code = true;
  if(shell.exec('ansible-vault encrypt group_vars/staging/vault.yml').code !== 0) code = true;
  if(shell.exec('ansible-vault encrypt group_vars/production/vault.yml').code !== 0) code = true;

  return code;
}

function gitIt() {
  console.log(pad(colors.green('Version Control')));
  var code = false;

  if(shell.cd(site.path).code !== 0) code = true;
  if(shell.exec('git init').code !== 0) code = true;
  if(shell.exec('git checkout -b development').code !== 0) code = true;
  if(shell.exec('git add -A').code !== 0) code = true;
  if(shell.exec('git commit -m "Initial commit"').code !== 0) code = true;

  return code;
}

function startAnsible() {
  console.log(pad(colors.cyan('Start VM')));
  var code = false;
  
  if(shell.cd(site.trellis).code !== 0) code = true;
  if(shell.exec('vagrant up').code !== 0) code = true;

  return code;
}
