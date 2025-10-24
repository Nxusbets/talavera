export default {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'talavera_user',
      password: process.env.DB_PASSWORD || 'talavera_password',
      database: process.env.DB_NAME || 'talavera_saas'
    },
    migrations: {
      directory: './migrations',
      extension: 'ts'
    },
    seeds: {
      directory: './seeds',
      extension: 'ts'
    }
  },
  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'talavera_user',
      password: 'talavera_password',
      database: 'talavera_saas_test'
    },
    migrations: {
      directory: './migrations',
      extension: 'ts'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations',
      extension: 'ts'
    }
  }
};
