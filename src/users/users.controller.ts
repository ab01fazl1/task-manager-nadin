import { Controller, Get, Param, Put, Delete, Body, UseGuards, Request, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User, UserRole } from './users.entity';
import { AdminGuard } from './middleware/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
    
    @ApiOperation({summary: "register user or admin"})
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
      return this.usersService.register(registerDto);
    }
  
    @ApiOperation({summary: "login via user and pass"})
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
      return this.usersService.login(loginDto);
    }

  @ApiOperation({ summary: 'Assign role (Admin only)' })
  @Put(':id/role')
  @UseGuards(AdminGuard)
  async assignRole(@Param('id') userId: number, @Request() req) {
    return this.usersService.assignRole(userId, req.user.id);
  }

  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteUser(@Param('id') id: number, @Request() req) {
    return this.usersService.deleteUser(id, req.user.id);
  }

  @ApiOperation({ summary: 'Admin-only: Update users (except themselves)' })
  @Put(':id')
  @UseGuards(AdminGuard)
  async updateUser(@Param('id') id: number, @Body() data: Partial<User>, @Request() req) {
    return this.usersService.updateUser(id, data, req.user.id);
  }

  @ApiOperation({ summary: 'Admin-only: Get all users' })
  @Get()
  @UseGuards(AdminGuard)
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get current users tasks' })
  @Get(':id/tasks')
  async getUserTasks(@Param('id') id: number) {
    return this.usersService.findUserTasks(id);
  }
}
