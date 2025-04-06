import { Controller, Get, Param, Put, Delete, Body, UseGuards, Request, Post, ValidationPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminGuard } from './middleware/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { JwtAuthGuard } from './middleware/JwtAuthGuard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
    
  @ApiOperation({ summary: 'Admin-only: Get all users' })
  @UseGuards(JwtAuthGuard, AdminGuard)
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
  @UseGuards(JwtAuthGuard, AdminGuard)
  async assignRole(@Param('id') userId: number, @Request() req) {
    return this.usersService.assignRole(userId, req.user.id);
  }

  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteUser(@Param('id') id: number, @Request() req) {
    return this.usersService.deleteUser(id, req.user.id);
  }

  @ApiOperation({ summary: 'Admin-only: Update users (except themselves)' })
  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateUser(@Param('id') id: number, @Body(ValidationPipe) updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.updateUser(id, updateUserDto, req.user.id);
  }
}
