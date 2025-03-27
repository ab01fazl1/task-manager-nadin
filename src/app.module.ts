import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    TasksModule,
  ],
})
export class AppModule {}
