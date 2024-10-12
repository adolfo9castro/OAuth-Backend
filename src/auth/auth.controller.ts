import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res: Response) {
    const { access_token } = req.user;
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    res.redirect(`${clientUrl}/auth/callback?token=${access_token}`);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookLoginCallback(@Req() req, @Res() res: Response) {
    const { access_token } = req.user;
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    res.redirect(`${clientUrl}/auth/callback?token=${access_token}`);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubLoginCallback(@Req() req, @Res() res: Response) {
    const { access_token } = req.user;
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    res.redirect(`${clientUrl}/auth/callback?token=${access_token}`);
  }
}
