import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ride } from './ride.schema';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { googleMapsConfig } from '../../../config/google-maps.config';
import { KafkaProducerService } from '../../../modules/kafka/kafka.producer';
import { CreateRideDto } from '../../../common/dto/create-ride.dto';

@Injectable()
export class RidesService {
  private googleMapsApiKey: string;

  constructor(
    @InjectModel(Ride.name) private rideModel: Model<Ride>,
    private kafkaProducerService: KafkaProducerService,
    private configService: ConfigService,
  ) {
    this.googleMapsApiKey = googleMapsConfig(configService).apiKey;
  }

  async createRide(createRideDto: CreateRideDto): Promise<Ride> {
    const { pickupLocation, dropoffLocation } = createRideDto;

    // Calculate distance and estimated time using Google Maps API
    const distanceMatrix = await this.getDistanceMatrix(
      pickupLocation,
      dropoffLocation,
    );

    const ride = new this.rideModel({
      ...createRideDto,
      status: 'pending',
      distance: distanceMatrix.distance,
      estimatedTime: distanceMatrix.duration,
    });

    await ride.save();

    // Emit Kafka event for ride creation
    await this.kafkaProducerService.produce({
      topic: 'ride.created',
      messages: [{ value: JSON.stringify(ride) }],
    });

    return ride;
  }

  private async getDistanceMatrix(
    pickup: { lat: number; lng: number },
    dropoff: { lat: number; lng: number },
  ) {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickup.lat},${pickup.lng}&destinations=${dropoff.lat},${dropoff.lng}&key=${this.googleMapsApiKey}`;
    const response = await axios.get(url);
    const element = response.data.rows[0].elements[0];
    return {
      distance: element.distance.value / 1000, // Convert to kilometers
      duration: element.duration.value / 60, // Convert to minutes
    };
  }

  async updateRideStatus(rideId: string, status: string): Promise<Ride> {
    const ride = await this.rideModel.findByIdAndUpdate(
      rideId,
      { status },
      { new: true },
    );
    await this.kafkaProducerService.produce({
      topic: 'ride.updated',
      messages: [{ value: JSON.stringify(ride) }],
    });
    return ride;
  }
}
