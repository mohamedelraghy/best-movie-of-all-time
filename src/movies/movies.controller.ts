import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as csvParser from 'csv-parser';
import { createReadStream } from 'fs';

import { MoviesService } from './movies.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from 'src/uploads/uploads.service';

@ApiTags('movies')
@Controller({ version: '1', path: 'movies' })
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly uploadService: UploadsService,
  ) {}

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async syncMovies(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    // * 1- Get CSV file path
    const path = this.uploadService.saveFile(file);

    // * 2- parse csv file
    const results = [];
    createReadStream(path)
      .pipe(csvParser())
      .on('data', async (data) => {
        results.push(data);
        await this.moviesService.enrichMovieData(data.Title, data.Year);
      })
      .on('end', () => {});

    // * 3- save movies to db
  }
}
