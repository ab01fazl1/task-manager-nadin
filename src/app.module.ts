import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { DocsModule } from './docs/docs.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig),ConfigModule.forRoot({isGlobal: true,}), AuthModule, UsersModule, TasksModule, DocsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
