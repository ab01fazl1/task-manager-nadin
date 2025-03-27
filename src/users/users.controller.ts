import { Controller, Get, Param, Put, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User, UserRole } from './users.entity';
import { AdminGuard } from '../auth/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user by ID' })
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }

  @ApiOperation({ summary: 'Assign role (Admin only)' })
  @Put(':id/role')
  @UseGuards(AdminGuard)
  async assignRole(@Param('id') userId: number, @Body('role') role: UserRole, @Request() req) {
    return this.usersService.assignRole(userId, role, req.user.id);
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
}
