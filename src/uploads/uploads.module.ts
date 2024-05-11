import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { MulterModuleConfig } from 'src/config/options/multer.config';
import { UploadsService } from './uploads.service';

@Module({
  imports: [MulterModule.registerAsync({ useClass: MulterModuleConfig })],
  providers: [UploadsService],
})
export class UploadsModule {}
