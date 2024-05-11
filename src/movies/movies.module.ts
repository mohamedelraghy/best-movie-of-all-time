import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MulterModuleConfig } from 'src/config/options/multer.config';

import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { UploadsModule } from 'src/uploads/uploads.module';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [
    MulterModule.registerAsync({ useClass: MulterModuleConfig }),
    UploadsModule,
  ],
})
export class MoviesModule {}
