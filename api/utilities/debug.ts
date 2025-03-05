import chalk from 'chalk'

const debug = {
  log: console.log,
  warn: (...args: unknown[]) => console.warn(chalk.yellow('✘'), ...args),
  error: (err: unknown, ...args: unknown[]) => {
    if (err instanceof Error) {
      console.error(chalk.red('✘'), chalk.red(err.name), err.message)
      console.error(chalk.dim(err.stack))
    } else {
      console.error(chalk.red('✘'), err)
    }
    for (const arg of args) {
      console.error(arg)
    }
  },
  info: (...args: unknown[]) => console.info(chalk.blue('•'), ...args),
  success: (...args: unknown[]) => console.info(chalk.green('✔'), ...args),
}

export default debug
