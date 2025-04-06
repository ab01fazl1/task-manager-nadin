import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { User, UserRole } from '../users/users.entity';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { NotFoundException } from '@nestjs/common';

// Define mock repositories
const mockTaskRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

// Define a mock User entity
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

// Define types for mock repositories
type MockRepository<Task extends ObjectLiteral> = Mock<Repository<Task>>;
type Mock<T> = jest.Mocked<T>;

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: MockRepository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    const createTaskDto: CreateTaskDto = { name: 'Test Task', description: 'Test Description', attachment: 'test.pdf' };
    const createdTask: Task = { id: 1, ...createTaskDto, user: mockUser, userId: 2, createdAt: new Date(), updatedAt: new Date() };

    // these two tests verify that the right args are passed
    it('should call taskRepository.create with the provided DTO and user', async () => {
      taskRepository.create.mockReturnValue(createdTask);
      await service.createTask(createTaskDto, mockUser);
      expect(taskRepository.create).toHaveBeenCalledWith({ ...createTaskDto, user: mockUser });
    });
    it('should call taskRepository.save with the created task', async () => {
      taskRepository.create.mockReturnValue(createdTask);
      taskRepository.save.mockResolvedValue(createdTask);
      await service.createTask(createTaskDto, mockUser);
      expect(taskRepository.save).toHaveBeenCalledWith(createdTask);
    });
    // verification of the returned value
    it('should return the saved task', async () => {
      taskRepository.create.mockReturnValue(createdTask);
      taskRepository.save.mockResolvedValue(createdTask);
      const result = await service.createTask(createTaskDto, mockUser);
      expect(result).toEqual(createdTask);
    });
  });

  describe('getUserTasks', () => {
    const mockTasks: Task[] = [
      { id: 1, name: 'Task 1', description: 'Desc 1', attachment: '1.pds', user: mockUser, userId: mockUser.id, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Task 2', description: 'Desc 2', attachment: '1.pds', user: mockUser, userId: mockUser.id, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Task 3', description: 'Desc 3', attachment: '1.pds', user: mockUser, userId: mockUser.id, createdAt: new Date(), updatedAt: new Date() },
    ];

    it('should call taskRepository.find with the correct where, skip, and take options', async () => {
      const page = 2;
      const limit = 2;
      await service.getUserTasks(mockUser, page, limit);
      expect(taskRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        skip: (page - 1) * limit,
        take: limit,
      });
    });

    it('should return an array of tasks for the given user with default pagination', async () => {
      taskRepository.find.mockResolvedValue([mockTasks[0], mockTasks[1]]);
      const result = await service.getUserTasks(mockUser);
      expect(result).toEqual([mockTasks[0], mockTasks[1]]);
    });

    it('should return an array of tasks for the given user with specified pagination', async () => {
      const page = 2;
      const limit = 1;
      taskRepository.find.mockResolvedValue([mockTasks[1]]);
      const result = await service.getUserTasks(mockUser, page, limit);
      expect(result).toEqual([mockTasks[1]]);
    });

    it('should return an empty array if no tasks are found for the user', async () => {
      taskRepository.find.mockResolvedValue([]);
      const result = await service.getUserTasks(mockUser);
      expect(result).toEqual([]);
    });
  });

  describe('updateTask', () => {
    const taskId = 1;
    const updateTaskDto: UpdateTaskDto = { description: 'Updated Description'};
    const existingTask: Task = { id: taskId, name: 'Old Task', description: 'Old Description', attachment: '1.pds', user: mockUser, userId: mockUser.id, createdAt: new Date(), updatedAt: new Date() };
    const updatedTask: Task = { ...existingTask, ...updateTaskDto, updatedAt: new Date() };

    it('should call taskRepository.findOne with the correct task ID and user ID', async () => {
      taskRepository.findOne.mockResolvedValue(existingTask);
      await service.updateTask(taskId, updateTaskDto, mockUser);
      expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: taskId, userId: mockUser.id } });
    });

    it('should throw NotFoundException if the task is not found for the user', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      await expect(service.updateTask(taskId, updateTaskDto, mockUser)).rejects.toThrow(NotFoundException);
    });

    it('should call taskRepository.save with the merged task data', async () => {
      taskRepository.findOne.mockResolvedValue(existingTask);
      taskRepository.save.mockResolvedValue(updatedTask);
      await service.updateTask(taskId, updateTaskDto, mockUser);
      expect(taskRepository.save).toHaveBeenCalledWith(updatedTask);
    });

    it('should return the updated task', async () => {
      taskRepository.findOne.mockResolvedValue(existingTask);
      taskRepository.save.mockResolvedValue(updatedTask);
      const result = await service.updateTask(taskId, updateTaskDto, mockUser);
      expect(result).toEqual(updatedTask);
    });
  });

  describe('deleteTask', () => {
    const taskId = 1;

    it('should call taskRepository.delete with the correct task ID and user', async () => {
      
      taskRepository.delete.mockResolvedValue({ affected: 1, raw: {} });
      await service.deleteTask(taskId, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({ id: taskId, user: mockUser });
    });

    it('should throw NotFoundException if no task is deleted (result.affected === 0)', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0, raw: {} });
      await expect(service.deleteTask(taskId, mockUser)).rejects.toThrow(NotFoundException);
    });

    it('should return "Task deleted successfully" if a task is successfully deleted', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1, raw: {} });
      const result = await service.deleteTask(taskId, mockUser);
      expect(result).toEqual('Task deleted successfully');
    });
  });
});