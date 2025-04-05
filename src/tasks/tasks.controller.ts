import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards, ValidationPipe, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/create.task.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateTaskDto } from './dto/update.task.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @Post()
  async createTask(@Body(ValidationPipe) createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.createTask(createTaskDto, req.user);
  }

  @ApiOperation({ summary: 'Get current users tasks' })
  @Get()
  async getUserTasks(@Request() req, @Query(ValidationPipe) paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.tasksService.getUserTasks(req.user, page, limit);
  }

  @ApiOperation({ summary: 'Update task: user can update their task' })
  @Put(':id')
  async updateTask(@Param('id') id: number, @Body(ValidationPipe) updateTaskDto: UpdateTaskDto, @Request() req) {
    return this.tasksService.updateTask(id, updateTaskDto, req.user);
  }

  @ApiOperation({ summary: 'Delete task' })
  @Delete(':id')
  async deleteTask(@Param('id') id: number, @Request() req) {
    return this.tasksService.deleteTask(id, req.user);
  }
}
