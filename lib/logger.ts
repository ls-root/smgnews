type LogMeta = Record<string, unknown>

function now() {
  return new Date().toISOString()
}

function write(level: "info" | "warn" | "error" | "debug", message: string, meta?: LogMeta) {
  const entry = {
    timestamp: now(),
    level,
    message,
    ...(meta && Object.keys(meta).length ? { meta } : {})
  }

  const prefix = `[${entry.level.toUpperCase()}] ${entry.timestamp}`
  if (meta) {
    console.log(prefix, message, meta)
  } else {
    console.log(prefix, message)
  }
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    write('info', message, meta)
  },

  warn(message: string, meta?: LogMeta) {
    write('warn', message, meta)
  },

  error(message: string, meta?: LogMeta) {
    write('error', message, meta)
  },

  debug(message: string, meta?: LogMeta) {
    write('debug', message, meta)
  }
}
