import { Controller, Post, Get, Param, Body, Headers, UseGuards, Req } from '@nestjs/common';
import { BookingsService, CreateBookingDto } from './bookings.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createBooking(
    @Body() dto: CreateBookingDto,
    @Headers('idempotency-key') idempotencyHeader: string,
    @Req() req: any,
  ) {
    if (idempotencyHeader && !dto.idempotencyKey) {
      dto.idempotencyKey = idempotencyHeader;
    }
    return this.bookingsService.createBooking(dto, req.user);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyBookings(@Req() req: any) {
    const bookings = await this.bookingsService.getFarmerBookings(req.user.id);
    return {
      success: true,
      count: bookings.length,
      data: bookings,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getBooking(@Param('id') id: string) {
    const booking = await this.bookingsService.getBookingById(id);
    return {
      success: true,
      data: booking,
    };
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelBooking(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    return this.bookingsService.cancelBooking(id, reason, req.user);
  }
}
