module.exports = {
  apps: [
    {
      name: 'api-control',
      script: 'npx',
      args: 'nest start --watch api-control',
      watch: false,
      env: {},
    },
    {
      name: 'bff-presto-scan',
      script: 'npx',
      args: 'nest start --watch bff-presto-scan',
      watch: false,
      env: {},
    },
    {
      name: 'ms-clients',
      script: 'npx',
      args: 'nest start --watch ms-clients',
      watch: false,
      env: {},
    },
    {
      name: 'ms-control',
      script: 'npx',
      args: 'nest start --watch ms-control',
      watch: false,
      env: {},
    },
  ],
};
