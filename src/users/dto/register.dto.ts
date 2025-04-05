import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Matches, IsOptional, IsEnum, IsPhoneNumber } from 'class-validator';
import { UserRole } from '../users.entity';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(11)
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Password must contain both uppercase and lowercase letters',
  })
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
