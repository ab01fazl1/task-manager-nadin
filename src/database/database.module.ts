import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: 'mothertrucker',
        database: 'task_manager_nadin',
        // host: process.env.DB_HOST || '127.0.0.1',
        // port: process.env.DB_PORT || 3306,
        // username: process.env.DB_USER || 'root',
        // password: process.env.DB_PASSWORD || 'mothertrucker',
        // database: process.env.DB_NAME || 'task_manager_nadin',
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],  // Inject ConfigService here
    }),
  ],
})

export class DatabaseModule {}
