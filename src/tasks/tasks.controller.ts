import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create.task.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @Post()
  // async createTask(@Body() body: { name: string; description?: string; attachment?: string }, @Request() req) {
  async createTask(@Body() data: CreateTaskDto, @Request() req) {
    return this.tasksService.createTask(data, req.user);
  }

  // @ApiOperation({ summary: 'Get current users tasks' })
  // @Get()
  // async getUserTasks(@Request() req) {
  //   console.log(req.user)
  //   return this.tasksService.getUserTasks(req.user);
  // }

  @ApiOperation({ summary: 'Update task: user can update their task' })
  @Put(':id')
  // use createtaskdto because there is no need to create updatetaskdto
  async updateTask(@Param('id') id: number, @Body() updateTask: CreateTaskDto, @Request() req) {
    return this.tasksService.updateTask(id, updateTask, req.user);
  }

  @ApiOperation({ summary: 'Delete task' })
  @Delete(':id')
  async deleteTask(@Param('id') id: number, @Request() req) {
    return this.tasksService.deleteTask(id, req.user);
  }
}
