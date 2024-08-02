export const appRegistry = Object.freeze({
  MS_CONTROL: {
    pattern: 'control',
    code: 'MCON',
    localPort: 3001,
    specimen: 'microservice',
    naming: 'control',
  },
  BFF_PRESTO_SCAN: {
    pattern: 'bff:presto-scan',
    code: 'BPRSC',
    localPort: 8000,
    specimen: 'bff',
    naming: 'presto-scan',
  },
  API_CONTROL: {
    pattern: 'api:control',
    code: 'ACON',
    localPort: 3045,
    specimen: 'api',
    naming: 'control',
  },
  API_HEALTH: {
    pattern: 'api:health',
    code: 'AHEL',
    localPort: 3002,
    specimen: 'api',
    naming: 'health',
  },
  API_LEGACY: {
    pattern: 'api:legacy',
    code: 'ALEG',
    localPort: 3003,
    specimen: 'api',
    naming: 'legacy',
  },
  MS_CLIENT: {
    pattern: 'clients',
    code: 'MCLI',
    localPort: 3004,
    specimen: 'microservice',
    naming: 'client',
  },
  API_TOOLS: {
    pattern: 'api:tools',
    code: 'ATOO',
    localPort: 3005,
    specimen: 'api',
    naming: 'tools',
  },
  API_ACCOUNT: {
    pattern: 'api:accounts',
    code: 'AACNT',
    localPort: 3006,
    specimen: 'api',
    naming: 'accounts',
  },
  MS_LEGACY: {
    pattern: 'legacy',
    code: 'MLEG',
    localPort: 3007,
    specimen: 'microservice',
    naming: 'legacy',
  },
  BFF_RESOURCES: {
    pattern: 'bff:resources',
    code: 'BRES',
    localPort: 3008,
    specimen: 'bff',
    naming: 'resources',
  },
  API_ONSTREET: {
    pattern: 'api:onstreet',
    code: 'AON',
    localPort: 3009,
    specimen: 'api',
    naming: 'onstreet',
  },
} as const);

export type AppRegistryNameType = keyof typeof appRegistry;
export type AppRegistryNamingType =
  (typeof appRegistry)[AppRegistryNameType]['naming'];
export type AppRegistrySpecimenType =
  (typeof appRegistry)[AppRegistryNameType]['specimen'];
