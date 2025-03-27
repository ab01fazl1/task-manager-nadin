import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { User } from '../users/users.entity';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(TaskRepository)
    private readonly taskRepo: TaskRepository,
  ) {}

  async createTask(user: User, name: string, description?: string, attachment?: string): Promise<Task> {
    const task = this.taskRepository.create({ name, description, attachment, user });
    return await this.taskRepository.save(task);
  }

  async getUserTasks(user: User): Promise<Task[]> {
    return await this.taskRepository.find({ where: { user } });
  }

  async updateTask(taskId: number, user: User, data: Partial<Task>): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId, user } });
    if (!task) throw new NotFoundException('Task not found');

    Object.assign(task, data);
    return await this.taskRepository.save(task);
  }

  async deleteTask(taskId: number, user: User): Promise<string> {
    const result = await this.taskRepository.delete({ id: taskId, user });
    if (result.affected === 0) throw new NotFoundException('Task not found');
    return 'Task deleted successfully';
  }
}
