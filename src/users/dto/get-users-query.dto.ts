import { IsEnum, IsOptional } from "class-validator";
import { UserRole } from "../users.entity";

export class GetUsersQueryDto {
    @IsOptional()
    @IsEnum(UserRole, { message: 'query must be either USER or ADMIN'})
    role: UserRole;
}