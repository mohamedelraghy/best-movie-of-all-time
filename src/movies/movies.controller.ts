import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as csvParser from 'csv-parser';
import { createReadStream } from 'fs';
import { Response } from 'express';

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
    @Res() res: Response,
  ) {
    // * 1- Get CSV file path
    const path = this.uploadService.saveFile(file);

    // * 2- parse csv file
    const results = [];
    const movies = [];

    createReadStream(path)
      .pipe(csvParser())
      .on('data', async (data) => {
        results.push(data);
      })
      .on('end', async () => {
        for (const data of results) {
          // * 3- save movies to db
          const movie = await this.moviesService.enrichMovieData(
            data.Title,
            data.Year,
          );

          // *3.1 check if movie already exists
          const movieDoc = await this.moviesService.findOne({
            tmdbId: movie.tmdbId,
          });

          if (!movieDoc) {
            // *3.2 create Movie Doc if it not exists
            movies.push(movie);
          }
        }

        // * save movie at DB
        await this.moviesService.m.insertMany(movies);
        res.json({ newlyAddedMovies: movies.length, movies });
      });
  }
}
