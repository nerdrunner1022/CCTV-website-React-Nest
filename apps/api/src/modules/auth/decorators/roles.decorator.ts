import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@cctv/shared';

export const ROLES_KEY = 'roles';

/** Restrict a route to the given roles. Used together with RolesGuard. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
