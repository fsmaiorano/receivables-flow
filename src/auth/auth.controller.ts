import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequest } from './dto/sign.request';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() req: SignInRequest) {
    return this.authService.signIn(req);
  }

  @Post('signout')
  async signOut(@Body() req) {
    return this.authService.signOut(req.user);
  }
}
