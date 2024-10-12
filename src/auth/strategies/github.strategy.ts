import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { emails, photos, username } = profile;
    const [firstName, ...lastNameParts] = (
      profile.displayName || username
    ).split(' ');
    const lastName = lastNameParts.join(' ') || '';

    const user = {
      email: emails[0].value,
      firstName,
      lastName,
      picture: photos[0]?.value,
      accessToken,
      id: profile.id,
    };

    const result = await this.authService.validateOAuthLogin(
      user,
      'github',
      accessToken,
      refreshToken,
    );
    done(null, result);
  }
}
