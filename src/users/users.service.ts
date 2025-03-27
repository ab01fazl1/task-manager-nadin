import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './users.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserRepository)
    private readonly userRepo: UserRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: number, data: Partial<User>, adminId: number): Promise<User> {
    const admin = await this.findOneById(adminId);
    if (admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update user information');
    }

    await this.userRepository.update(id, data);
    return this.findOneById(id);
  }

  async deleteUser(id: number, adminId: number): Promise<string> {
    const admin = await this.findOneById(adminId);
    if (admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete users');
    }

    await this.userRepository.delete(id);
    return 'User deleted successfully';
  }

  async assignRole(userId: number, role: UserRole, adminId: number): Promise<User> {
    const admin = await this.findOneById(adminId);
    if (admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can assign roles');
    }

    await this.userRepository.update(userId, { role });
    return this.findOneById(userId);
  }
}
