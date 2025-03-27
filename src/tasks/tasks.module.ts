import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './tasks.entity';
import { TaskRepository } from './tasks.repository';  // Import TaskRepository

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskRepository])],  // Register TaskRepository
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
