import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';

import { MulterModuleConfig } from 'src/config/options/multer.config';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { UploadsModule } from 'src/uploads/uploads.module';
import { ConfigModule } from 'src/config/config.module';
import { Movie, MovieSchema } from './entities/movie.entity';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    MulterModule.registerAsync({ useClass: MulterModuleConfig }),
    UploadsModule,
    HttpModule,
    ConfigModule.Deferred,
  ],
})
export class MoviesModule {}
