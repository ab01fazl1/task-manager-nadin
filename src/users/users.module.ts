import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UserRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
