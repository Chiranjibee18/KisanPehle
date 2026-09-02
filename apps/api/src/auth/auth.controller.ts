import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService, RegisterDto, LoginDto, VerifyOtpDto } from './auth.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(['send-otp', 'otp/send'])
  async sendOtp(@Body('mobile') mobile: string) {
    return this.authService.sendOtp(mobile);
  }

  @Post(['verify-otp', 'otp/verify'])
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('demo-login')
  async demoLogin(@Body('role') role: string) {
    return this.authService.quickDemoLogin(role || 'FARMER');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    const user = await this.authService.getUserProfile(req.user.id);
    return {
      success: true,
      user: user || req.user,
    };
  }
}
