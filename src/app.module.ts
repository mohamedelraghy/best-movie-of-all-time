import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MoviesModule } from './movies/movies.module';
import { CoreModule } from './core/core.module';
import { ConfigModule } from './config/config.module';
import { ConfigModuleConfig } from './config/options/config.config';
import { UploadsModule } from './uploads/uploads.module';
import { MongooseModuleConfig } from './config/options/database.config';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
