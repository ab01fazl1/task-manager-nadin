import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Task } from './tasks.entity';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @Post()
  async createTask(@Body() body: { name: string; description?: string; attachment?: string }, @Request() req) {
    return this.tasksService.createTask(req.user, body.name, body.description, body.attachment);
  }

  @ApiOperation({ summary: 'Get user tasks' })
  @Get()
  async getUserTasks(@Request() req) {
    return this.tasksService.getUserTasks(req.user);
  }

  @ApiOperation({ summary: 'Update task' })
  @Put(':id')
  async updateTask(@Param('id') id: number, @Body() data: Partial<Task>, @Request() req) {
    return this.tasksService.updateTask(id, req.user, data);
  }

  @ApiOperation({ summary: 'Delete task' })
  @Delete(':id')
  async deleteTask(@Param('id') id: number, @Request() req) {
    return this.tasksService.deleteTask(id, req.user);
  }
}
