import { Controller, Get, Patch, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService, UpdateProfileDto, AddTrustedHelperDto } from './users.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req: any) {
    const user = await this.usersService.getProfile(req.user.id);
    return {
      success: true,
      data: user,
    };
  }

  @Patch('profile')
  async updateProfile(@Body() dto: UpdateProfileDto, @Req() req: any) {
    const updated = await this.usersService.updateProfile(req.user.id, dto);
    return {
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    };
  }

  @Post('helpers')
  async addHelper(@Body() dto: AddTrustedHelperDto, @Req() req: any) {
    const helper = await this.usersService.addTrustedHelper(req.user.id, dto);
    return {
      success: true,
      message: 'Trusted helper authorized successfully',
      data: helper,
    };
  }

  @Delete('helpers/:id')
  async revokeHelper(@Param('id') id: string, @Req() req: any) {
    const result = await this.usersService.revokeTrustedHelper(req.user.id, id);
    return {
      success: true,
      message: 'Helper authorization revoked',
      data: result,
    };
  }
}
