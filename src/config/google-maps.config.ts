import { ConfigService } from '@nestjs/config';

export const googleMapsConfig = (configService: ConfigService) => ({
  apiKey: configService.get<string>('GOOGLE_MAPS_API_KEY'),
});
