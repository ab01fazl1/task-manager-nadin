import { Injectable, NotFoundException, ForbiddenException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './users.entity';
import { UserRepository } from './users.repository';
import { Task } from 'src/tasks/tasks.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserRepository)
    private readonly userRepo: UserRepository,
    
    private readonly jwtService: JwtService,
    
  ) {}
  
  async register(registerDto: RegisterDto): Promise<User> {
    const { username, email, phoneNumber, password, role } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { phoneNumber }, { username }],
    });

    if (existingUser) {
      throw new BadRequestException('Username, email, or phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      // should just pass role
      role: role ? UserRole.ADMIN : UserRole.USER,
    });

    return await this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  // find all users
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // private function for service
  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: number, data: Partial<User>, adminId: number): Promise<User> {
    const admin = await this.findOneById(adminId);
    // if (admin.role !== UserRole.ADMIN) {
    //   throw new ForbiddenException('Only admins can update user information');
    // }

    await this.userRepository.update(id, data);
    return this.findOneById(id);
  }

  async deleteUser(id: number, adminId: number): Promise<string> {
    const admin = await this.findOneById(adminId);
    // if (admin.role !== UserRole.ADMIN) {
    //   throw new ForbiddenException('Only admins can delete users');
    // }

    await this.userRepository.delete(id);
    return 'User deleted successfully';
  }

  async assignRole(userId: number, adminId: number): Promise<User> {
    const admin = await this.findOneById(adminId);
    // if (admin.role !== UserRole.ADMIN) {
    //   throw new ForbiddenException('Only admins can assign roles');
    // }

    await this.userRepository.update(userId, { role: UserRole.ADMIN });
    return this.findOneById(userId);
  }

  async findUserTasks(userId: number): Promise<Task[]> {
    const user = await this.findOneById(userId)
    return user.tasks
  }
}
