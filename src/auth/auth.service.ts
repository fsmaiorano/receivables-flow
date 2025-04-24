import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignInRequest } from './dto/sign.request';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async signIn(request: SignInRequest) {
    const user = await this.prismaService.user.findUnique({
      where: { username: request.username },
    });

    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== request.password) {
      throw new Error('Invalid password');
    }

    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signOut(user: any) {
    console.log(`User ${user.username} logged out`);
    return { message: 'User logged out successfully' };
  }
}
