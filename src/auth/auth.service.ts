import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateOAuthLogin(
    profile: any,
    provider: string,
    accessToken: string,
    refreshToken: string,
  ) {
    const user = await this.usersService.findOrCreateUser(
      {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        picture: profile.picture,
      },
      {
        provider,
        providerId: profile.id,
        accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 3600 * 1000), // Ejemplo: expira en 1 hora
      },
    );

    const payload = {
      userId: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
  async validateUser(payload: any): Promise<any> {
    return this.usersService.findOne(payload.userId);
  }
}
