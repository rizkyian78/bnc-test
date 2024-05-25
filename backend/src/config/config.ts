export default () => ({
  db: {
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  broker: {
    path: process.env.RABBIT_MQ_PATH,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'shh',
    expired: process.env.JWT_TOKEN_EXPIRED || '24h',
  },
});
