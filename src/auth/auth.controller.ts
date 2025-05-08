import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInRequest } from './dto/sign.request';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Sign in to get JWT token' })
  async signIn(@Body() req: SignInRequest) {
    return this.authService.signIn(req);
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Sign out (requires authentication)' })
  async signOut(@Body() req) {
    return this.authService.signOut(req.user);
  }
}
