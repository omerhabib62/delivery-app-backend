import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { RidesService } from './rides.service';
import { CreateRideDto } from '../../../common/dto/create-ride.dto';
import { Ride } from './ride.schema';

@Controller('v1/rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Post()
  async create(@Body() createRideDto: CreateRideDto): Promise<Ride> {
    return this.ridesService.createRide(createRideDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<Ride> {
    return this.ridesService.updateRideStatus(id, status);
  }
}
