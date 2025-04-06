import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { User, UserRole } from '../users/users.entity';
import { NotFoundException, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';

// Mock the TasksService
const mockTasksService = () => ({
  createTask: jest.fn(),
  getUserTasks: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
});

// Mock the User object (adjust as needed)
const mockUser: User = {
  id: 1,
  username: 'testuser',
  email: 'email@user.com',
  phoneNumber: '+989172222222',
  password: 'Aa1234567',
  role: UserRole.ADMIN,
  tasks: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TasksController', () => {
  let controller: TasksController;
  let service: ReturnType<typeof mockTasksService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useFactory: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    const createTaskDto: CreateTaskDto = { name: 'Test Task', description: 'Test Description', attachment: 'test.pdf' };
    const createdTask = { id: 1, ...createTaskDto, userId: mockUser.id };

    it('should return the created task', async () => {
      (service.createTask as jest.Mock).mockResolvedValue(createdTask);
      expect(await controller.createTask(createTaskDto, mockUser)).toEqual(createdTask);
    });
  });

  describe('getUserTasks', () => {
    const paginationDto: PaginationDto = { page: 1, limit: 2 };
    const mockTasks = [
      { id: 1, name: 'Task 1', userId: mockUser.id },
      { id: 2, name: 'Task 2', userId: mockUser.id },
    ];

    it('should return the array of tasks from the service', async () => {
      (service.getUserTasks as jest.Mock).mockResolvedValue(mockTasks);
      expect(await controller.getUserTasks(mockUser, paginationDto)).toEqual(mockTasks);
    });

  });

  describe('updateTask', () => {
    const taskId = 1;
    const updateTaskDto: UpdateTaskDto = { description: 'Updated Description' };
    const updatedTask = { id: 1, name: 'Old Task', ...updateTaskDto, userId: mockUser.id };

    it('should return the updated task', async () => {
      (service.updateTask as jest.Mock).mockResolvedValue(updatedTask);
      expect(await controller.updateTask(taskId, updateTaskDto, mockUser)).toEqual(updatedTask);
    });

    it('should throw NotFoundException if tasksService.updateTask throws it', async () => {
      (service.updateTask as jest.Mock).mockRejectedValue(new NotFoundException());
      await expect(controller.updateTask(taskId, updateTaskDto, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTask', () => {
    const taskId = 1;
    const successMessage = 'Task deleted successfully';

    it('should return the success message from the service', async () => {
      (service.deleteTask as jest.Mock).mockResolvedValue(successMessage);
      expect(await controller.deleteTask(taskId, mockUser)).toEqual(successMessage);
    });

    it('should throw NotFoundException if tasksService.deleteTask throws it', async () => {
      (service.deleteTask as jest.Mock).mockRejectedValue(new NotFoundException());
      await expect(controller.deleteTask(taskId, mockUser)).rejects.toThrow(NotFoundException);
    });
  });
});