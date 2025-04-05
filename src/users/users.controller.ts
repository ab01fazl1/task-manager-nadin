import { Controller, Get, Param, Put, Delete, Body, UseGuards, Request, Post, ValidationPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User, UserRole } from './users.entity';
import { AdminGuard } from './middleware/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { request } from 'http';
import { GetUsersQueryDto } from './dto/get-users-query.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
    
  @ApiOperation({ summary: 'Admin-only: Get all users' })
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get()
  async getAllUsers(@Query(ValidationPipe) role?: GetUsersQueryDto) {
    return this.usersService.findAll(role);
  }

  @ApiOperation({summary: "register user or admin"})
  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.usersService.register(registerDto);
  }

  @ApiOperation({summary: "login via user and pass"})
  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @ApiOperation({ summary: 'Assign role (Admin only)' })
  @Put(':id/role')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async assignRole(@Param('id') userId: number, @Request() req) {
    return this.usersService.assignRole(userId, req.user.id);
  }

  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async deleteUser(@Param('id') id: number, @Request() req) {
    return this.usersService.deleteUser(id, req.user.id);
  }

  @ApiOperation({ summary: 'Admin-only: Update users (except themselves)' })
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async updateUser(@Param('id') id: number, @Body(ValidationPipe) updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.updateUser(id, updateUserDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get current users tasks' })
  @Get(':id/tasks')
  async getUserTasks(@Param('id') id: number) {
    return this.usersService.findUserTasks(id);
  }
}
