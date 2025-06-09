const { LOGGING, NODE_ENV } = process.env;

const safeStringify = (obj) => {
  try {
      return JSON.stringify(obj);
  } catch (error) {
      return '[Circular Structure]';
  }
};

const Logger = {
  log: async (...args) => {
    if (LOGGING === 'true') {
      const chalk = (await import('chalk')).default;
      if (NODE_ENV === 'DEV') {
        console.log(chalk.blue('[DEV]'), ...args.map(arg => typeof arg === 'object' ? safeStringify(arg) : arg));
      } else if (NODE_ENV === 'PROD') {
        console.log(chalk.green('[PROD]'), ...args.map(arg => typeof arg === 'object' ? safeStringify(arg) : arg));
      }
    }
  },
  error: async (...args) => {
    if (LOGGING === 'true') {
      const chalk = (await import('chalk')).default;
      if (NODE_ENV === 'DEV') {
        console.error(chalk.red('[DEV] ERROR'), ...args.map(arg => typeof arg === 'object' ? safeStringify(arg) : arg));
      } else if (NODE_ENV === 'PROD') {
        console.error(chalk.red('[PROD] ERROR'), ...args.map(arg => typeof arg === 'object' ? safeStringify(arg) : arg));
      }
    }
  },
  warn: async (...args) => {
    if (LOGGING === 'true') {
      const chalk = (await import('chalk')).default;
      if (NODE_ENV === 'DEV') {
        console.warn(chalk.yellow('[DEV] WARN'), ...args.map(arg => typeof arg === 'object' ? safeStringify(arg) : arg));
      } else if (NODE_ENV === 'PROD') {
        console.warn(chalk.yellow('[PROD] WARN'), ...args.map(arg => typeof arg === 'object' ? safeStringify(arg) : arg));
      }
    }
  }
};

module.exports = Logger;
