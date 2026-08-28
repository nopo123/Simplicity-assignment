import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import dayjs from 'dayjs';
import { GetHealthDto } from './dto/get-health.dto';

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  async check(): Promise<GetHealthDto> {
    const isDatabaseReachable = await this.isDatabaseReachable();

    return {
      status: isDatabaseReachable ? 'ok' : 'degraded',
      database: isDatabaseReachable,
      timestamp: dayjs().toISOString(),
    };
  }

  private async isDatabaseReachable(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');

      return true;
    } catch {
      return false;
    }
  }
}
