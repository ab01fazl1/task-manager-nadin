import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { User } from '../users/users.entity';
import { TaskRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create.task.dto';

@Injectable()
export class TasksService {
  userRepository: any;
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(TaskRepository)
    private readonly taskRepo: TaskRepository,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { name, description, attachment } = createTaskDto
    const task = this.taskRepository.create({ name, description, attachment, user });
    return await this.taskRepository.save(task);
  }

  // async getUserTasks(user: User): Promise<Task[]> {
  //   const tasks = await this.taskRepository.find({ where: { user: user } });
  //   return tasks
  // }

  async updateTask(taskId: number, updateTask: Partial<CreateTaskDto>, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId, user } });
    if (!task) throw new NotFoundException('Task not found');

    return await this.taskRepository.save({...task, ...updateTask});
  }

  async deleteTask(taskId: number, user: User): Promise<string> {
    const result = await this.taskRepository.delete({ id: taskId, user });
    if (result.affected === 0) throw new NotFoundException('Task not found');
    return 'Task deleted successfully';
  }
}
