import { CacheOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigService } from '../config.service';

@Injectable()
export class CacheModuleConfig implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createCacheOptions():
    | CacheOptions<Record<string, any>>
    | Promise<CacheOptions<Record<string, any>>> {
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      store: async () =>
        await redisStore({
          // Store-specific configuration:
          socket: {
            host: this.configService.REDIS.host,
            port: this.configService.REDIS.port,
          },
          ttl: 10,
        }),
    };
  }
}
