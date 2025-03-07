import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { Event } from '../event/entities/event.entity';


const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'events',
  entities: [User, Event],                
  synchronize: true, // Set to false in production
};

export default ormconfig;