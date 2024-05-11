import { Injectable } from '@nestjs/common';

import { renameSync, unlinkSync } from 'fs';
import { extname } from 'path';
import { ConfigService } from 'src/config/config.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {}

  saveFile = (file: Express.Multer.File) => {
    try {
      // * get file ext
      const fileExt = extname(file.originalname);

      // Create new name for the uploaded file
      const filename = `upload/${uuidv4()}${fileExt}`;

      // * rename file.path
      renameSync(file.path, filename);

      const url = this.configService.apiUrl + filename.replace('upload', '');

      return { url };
    } catch (err: unknown) {
      console.log(err);
      unlinkSync(file.path);
    }
  };
}
