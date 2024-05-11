import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { MoviesService } from './movies.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import * as csvParser from 'csv-parser';
import { UploadsService } from 'src/uploads/uploads.service';

@ApiTags('movies')
@Controller({ version: '1', path: 'movies' })
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly uploadService: UploadsService,
  ) {}

  @Post('sync')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async syncMovies(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    console.log({ file });
    // * 1- Get CSV file path
    const path = this.uploadService.saveFile(file);
    console.log({ path });
    // * 2- parse csv file
    const results = [];
    createReadStream(path)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        // Here you have the parsed CSV data in `results` array
        console.log({ results });
      });
    // * 3- save movies to db
  }
}
