import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/users.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserRepository)
    private readonly userRepo: UserRepository,
    
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { username, email, phoneNumber, password } = registerDto;

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
      role: UserRole.USER,
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
}
