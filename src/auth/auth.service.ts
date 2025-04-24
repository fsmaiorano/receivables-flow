import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignInRequest } from './dto/sign.request';
import { SignInResponse } from './dto/sign.response';
import { Result } from '../shared/dto/result.generic';
import { HttpStatusCode } from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async signIn(request: SignInRequest): Promise<Result<SignInResponse>> {
    try {
      const user = await this.validateUser(request.username, request.password);

      if (!user) {
        throw new Error('User not found');
      }

      const payload = { username: user.username, sub: user.id };

      const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
      const refreshToken = this.jwtService.sign(
        {
          ...payload,
          tokenType: 'refresh',
        },
        { expiresIn: '7d' },
      );

      return Result.success<SignInResponse>(
        {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        HttpStatusCode.Ok,
      );
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  async signOut(user: any) {
    console.log(`User ${user.username} logged out`);
    return { message: 'User logged out successfully' };
  }
}
