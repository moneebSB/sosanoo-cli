module.exports = class Logger {
  static info(message) {
    console.log(`\x1b[34m[INFO] ${message}\x1b[0m`) // Blue
  }

  static error(message) {
    console.log(`\x1b[31m[ERROR] ${message}\x1b[0m`) // Red
  }

  static fatal(message) {
    this.error(message)
    process.exit(1)
  }

  static success(message) {
    console.log(`\x1b[32m[SUCCESS] ${message}\x1b[0m`) // Green
  }

  static warn (message) {
    console.log(`\x1b[33m[WARNING] ${message}\x1b[0m`) // Yellow
  }
}
