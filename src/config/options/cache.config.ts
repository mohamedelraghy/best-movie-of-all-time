import { CacheOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';

@Injectable()
export class CacheModuleConfig implements CacheOptionsFactory {
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
            host: 'redis',
            port: 6379,
          },
          ttl: 10,
        }),
    };
  }
}
