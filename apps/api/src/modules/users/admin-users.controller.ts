import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { userRoleSchema, type UserRole } from '@cctv/shared';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from './users.service';

/** Staff-only directory. Used by the admin portal's assignment pickers. */
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SALES')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list(@Query('role') role?: string) {
    const parsed = role ? userRoleSchema.safeParse(role) : null;
    return this.usersService.listStaff(
      parsed?.success ? (parsed.data as UserRole) : undefined,
    );
  }
}
