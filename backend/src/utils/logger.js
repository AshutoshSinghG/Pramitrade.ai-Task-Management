import fs from 'fs'
import path from 'path'
import morgan from 'morgan'

const logsDir = path.resolve(process.cwd(), 'backend', 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' })

export const httpLogger = morgan('combined', { stream: accessLogStream })

export function writeErrorLog(err) {
  try {
    const line = `[${new Date().toISOString()}] ${err.statusCode || 500} ${err.message}\n${err.stack || ''}\n`
    fs.appendFileSync(path.join(logsDir, 'error.log'), line, 'utf8')
  } catch (_) {
    // ignore file log errors
  }
}


