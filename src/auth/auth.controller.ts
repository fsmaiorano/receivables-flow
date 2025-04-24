import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/logout')
  async logout(@Body() req) {
    return req.logout();
  }
}
