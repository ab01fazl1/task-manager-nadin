import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: true,
        // host: '127.0.0.1',
        // port: 3306,
        // username: 'root',
        // password: 'mothertrucker',
        // database: 'task_manager_nadin',
      }),
      inject: [ConfigService],  // Inject ConfigService here
    }),
  ],
})

export class DatabaseModule {}
