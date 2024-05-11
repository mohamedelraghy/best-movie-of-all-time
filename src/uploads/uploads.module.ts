import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { MulterModuleConfig } from 'src/config/options/multer.config';
import { UploadsService } from './uploads.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    MulterModule.registerAsync({ useClass: MulterModuleConfig }),
    ConfigModule.Deferred,
  ],
  providers: [UploadsService],
})
export class UploadsModule {}
