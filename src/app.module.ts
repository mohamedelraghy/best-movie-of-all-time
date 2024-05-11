import { Module } from '@nestjs/common';

import { MoviesModule } from './movies/movies.module';
import { CoreModule } from './core/core.module';
import { ConfigModule } from './config/config.module';
import { ConfigModuleConfig } from './config/options/config.config';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    CoreModule,
    ConfigModule.forRootAsync(ConfigModule, { useClass: ConfigModuleConfig }),
    MoviesModule,
    UploadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
