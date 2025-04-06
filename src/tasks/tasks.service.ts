import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { User } from '../users/users.entity';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';

@Injectable()
export class TasksService {
  userRepository: any;
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { name, description, attachment } = createTaskDto
    const task = this.taskRepository.create({ name, description, attachment, user });
    return await this.taskRepository.save(task);
  }

  async getUserTasks(user: User, page: number=1, limit: number=2): Promise<Task[]> {
    const skip = (page - 1) * limit;
    return await this.taskRepository.find({ where: { userId: user.id }, skip: skip, take: limit });
  }

  async updateTask(taskId: number, updateTask: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId, userId: user.id } });
    if (!task) throw new NotFoundException('Task not found');

    return await this.taskRepository.save({...task, ...updateTask});
  }

  async deleteTask(taskId: number, user: User): Promise<string> {
    const result = await this.taskRepository.delete({ id: taskId, user });
    if (result.affected === 0) throw new NotFoundException('Task not found');
    return 'Task deleted successfully';
  }
}
