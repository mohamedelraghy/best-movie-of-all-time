import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { MoviesService } from './movies.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('movies')
@Controller({ version: '1', path: 'movies' })
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post('sync')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async syncMovies(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    console.log({ file });
    // * 1- Get CSV file buffer
    const { buffer } = file;

    // * 2- parse csv file

    // * 3- save movies to db
  }
}
