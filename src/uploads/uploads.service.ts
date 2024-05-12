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

      // const url = 'http://localhost:3000' + filename.replace('upload', '');

      return filename;
    } catch (err: unknown) {
      console.error(err);
      unlinkSync(file.path);
    }
  };
}
