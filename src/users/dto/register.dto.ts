import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Matches, IsOptional, isEnum } from 'class-validator';
import { UserRole } from 'src/users/users.entity';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/, {
    message: 'Password must contain both uppercase and lowercase letters',
  })
  password: string;

  @ApiProperty()
  @IsOptional()
  role: UserRole;
}
