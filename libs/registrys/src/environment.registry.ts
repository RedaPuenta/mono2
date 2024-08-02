export const environment = Object.freeze({
  local: 'local',
  development: 'development',
  staging: 'staging',
  production: 'production',
} as const);

export type EnvironmentType = keyof typeof environment;
