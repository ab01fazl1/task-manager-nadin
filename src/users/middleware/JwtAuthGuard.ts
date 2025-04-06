import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  canActivate(context: ExecutionContext) {
    // @ts-ignore
    return super.canActivate(context).catch(() => {
      throw new UnauthorizedException('Invalid credentials or log in');
    });
  }
}