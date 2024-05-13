import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as csvParser from 'csv-parser';
import { createReadStream } from 'fs';
import { Response } from 'express';

import { MoviesService } from './movies.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from 'src/uploads/uploads.service';
import { SearchOptions } from 'src/core/shared/search-options.dto';
import { WatchlistDto } from './dto/watchlist.dto';
import { ConfigService } from 'src/config/config.service';

@ApiTags('movies')
@Controller({ version: '1', path: 'movies' })
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly uploadService: UploadsService,
    private readonly configService: ConfigService,
  ) {}

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'seed, store, and sync the data from uploaded CSV file',
  })
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

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'search movies' })
  searchMovies(@Body() options: SearchOptions) {
    console.log({ options });
    return this.moviesService.findAll(options);
  }

  @Post('add/watchlist')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'add or remove from watchlist' })
  watchlist(@Body() dto: WatchlistDto) {
    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${this.configService.TMDB.token}`,
    };

    const url = `https://api.themoviedb.org/3/account/${this.configService.TMDB.account_id}/watchlist`;

    return this.moviesService.httpPost(url, dto, headers);
  }
}
