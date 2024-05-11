import { Module } from '@nestjs/common';

import { MoviesModule } from './movies/movies.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule, MoviesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
