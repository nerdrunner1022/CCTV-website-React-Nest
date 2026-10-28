import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { loginSchema, registerSchema } from '@cctv/shared';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedUser } from './interfaces/jwt-payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: unknown) {
    return this.authService.register(registerSchema.parse(body));
  }

  @Post('login')
  login(@Body() body: unknown) {
    return this.authService.login(loginSchema.parse(body));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
