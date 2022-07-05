import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default (): TypeOrmModuleOptions => {
  const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DATABASE,
  } = process.env;

  return {
    type: 'postgres',
    host: POSTGRES_HOST,
    port: parseInt(POSTGRES_PORT, 10),
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DATABASE,
    autoLoadEntities: true,
    entities: ['../entities/*.entity{.ts,.js}'],
    ssl: false,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };
};
