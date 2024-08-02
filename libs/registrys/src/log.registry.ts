export const logRegistry = Object.freeze({
  success: { color: '\x1b[32m%s\x1b[0m', prefix: 'SUCCESS' },
  warn: { color: '\x1b[33m%s\x1b[0m', prefix: 'WARN' },
  error: { color: '\x1b[31m%s\x1b[0m', prefix: 'ERROR' },
  debug: { color: '\x1b[36m%s\x1b[0m', prefix: 'DEBUG' },
} as const);

export type LogRegistryNameType = keyof typeof logRegistry;
