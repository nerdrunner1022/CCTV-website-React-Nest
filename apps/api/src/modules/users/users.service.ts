import { Injectable } from '@nestjs/common';
import type { UserRole } from '@cctv/shared';
import { PrismaService } from '../../prisma/prisma.service';

/** Staff directory used for lead assignment and (later) scheduling. */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Internal users only — customers are excluded from assignment pickers. */
  async listStaff(role?: UserRole) {
    return this.prisma.user.findMany({
      where: role ? { role } : { role: { not: 'CUSTOMER' } },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, email: true, role: true },
    });
  }
}
