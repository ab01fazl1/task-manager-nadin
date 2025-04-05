import { Injectable, NotFoundException, ForbiddenException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './users.entity';
import { Task } from 'src/tasks/tasks.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Repository } from 'typeorm';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    private readonly jwtService: JwtService,
  ) {}
  
  async register(registerDto: RegisterDto): Promise<User> {
    const { username, email, phoneNumber, password, role } = registerDto;

    const existingUser = await this.userRepository.find({
      where: [{ username: username }, { email: email }, { phoneNumber: phoneNumber }],
    });

    if (existingUser.length > 0) {
      throw new BadRequestException('Username, email, or phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      role: role,
    });

    return await this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOneBy({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  // find all users
  async findAll(role?: GetUsersQueryDto): Promise<User[]> {
    if (role) {
      const filter_role = role.role
      return this.userRepository.find({ where: {role: filter_role} })
    }
    return this.userRepository.find();
  }

  // private function for service
  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: number, data: UpdateUserDto, adminId: number): Promise<User> {
    const admin = await this.findOneById(adminId);
    if (admin) {
      await this.userRepository.update(id, data);
      return this.findOneById(id);
    }

    throw new ForbiddenException('only admins can update users')
  }

  async deleteUser(id: number, adminId: number): Promise<string> {
    const admin = await this.findOneById(adminId);

    await this.userRepository.delete(id);
    return 'User deleted successfully';
  }

  async assignRole(userId: number, adminId: number): Promise<User> {
    const admin = await this.findOneById(adminId);

    await this.userRepository.update(userId, { role: UserRole.ADMIN });
    return this.findOneById(userId);
  }

  async findUserTasks(userId: number): Promise<Task[]> {
    const user = await this.findOneById(userId)
    return user.tasks
  }
}
