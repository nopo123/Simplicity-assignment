import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';
import { GetHealthDto } from './dto/get-health.dto';
import { RestApiResponseObject } from 'src/common/decorators/api-response-object.decorator';

@Controller({
  version: '1',
  path: 'health',
})
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @RestApiResponseObject(
    GetHealthDto,
    'Liveness probe',
    'Service is up',
    'Reports whether the API process is running and able to reach the database. Used by container orchestration and by the frontend to detect a cold backend.',
    'Health',
  )
  @Get()
  @HttpCode(HttpStatus.OK)
  async check(): Promise<GetHealthDto> {
    return this.healthService.check();
  }
}
