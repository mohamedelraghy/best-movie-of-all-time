import { Module } from '@nestjs/common';

import { UploadsService } from './uploads.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  controllers: [],
  imports: [ConfigModule.Deferred],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
