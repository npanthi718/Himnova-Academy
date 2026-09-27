import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException({
        success: false,
        error: {
          code: 'USER_NOT_AUTHENTICATED',
          message: 'User is not authenticated for role evaluation.',
        },
      });
    }

    // SUPER_ADMIN has global privileges
    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException({
        success: false,
        error: {
          code: 'INSUFFICIENT_ROLE_PRIVILEGES',
          message: `Access denied. Required role(s): [${requiredRoles.join(', ')}]. Current role: ${user.role}`,
        },
      });
    }

    return true;
  }
}
