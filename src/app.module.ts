import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedisClientOptions } from 'redis';

import { MoviesModule } from './movies/movies.module';
import { CoreModule } from './core/core.module';
import { ConfigModule } from './config/config.module';
import { ConfigModuleConfig } from './config/options/config.config';
import { UploadsModule } from './uploads/uploads.module';
import { MongooseModuleConfig } from './config/options/database.config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { CacheModuleConfig } from './config/options/cache.config';

@Module({
  imports: [
    CoreModule,
    ConfigModule.forRootAsync(ConfigModule, { useClass: ConfigModuleConfig }),
    MoviesModule,
    UploadsModule,
    MongooseModule.forRootAsync({
      useClass: MongooseModuleConfig,
      imports: [ConfigModule.Deferred],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      useClass: CacheModuleConfig,
      imports: [ConfigModule.Deferred],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
