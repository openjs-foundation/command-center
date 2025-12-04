# OpenJS Security Monitor

A security monitoring tool for tracking security practices of top OpenJS Foundation packages.

## Features

- **SECURITY.md Monitoring**: Checks for the presence and tracks changes to SECURITY.md files in repositories
- **Security Best Practices**: Evaluates repositories against security best practices

## Monitored Packages

Currently monitors these OpenJS Foundation packages:

1. **Node.js** (nodejs/node)
2. **Express** (expressjs/express)
3. **webpack** (webpack/webpack)
4. **Electron** (electron/electron)
5. **jQuery** (jquery/jquery)
6. **Fastify** (fastify/fastify)
7. **Node-RED** (node-red/node-red)
8. **ESLint** (eslint/eslint)
9. **Jest** (jestjs/jest)
10. **Mocha** (mochajs/mocha)
11. **Lodash** (lodash/lodash)
12. **WebdriverIO** (webdriverio/webdriverio)

## Installation

```bash
git clone https://github.com/your-username/openjs-security-monitor.git
cd openjs-security-monitor
```

## Usage

Run the monitor:

```bash
npm run start
```

## Adding More Repositories

To monitor additional repositories, add entries to the `REPOSITORIES` array in `monitor.js`:

```javascript
{
  name: 'Package Name',
  owner: 'github-owner',
  repo: 'repo-name',
  securityFilePath: 'SECURITY.md',
  branch: 'main'
}
```

## License

MIT
