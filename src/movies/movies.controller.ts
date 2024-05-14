import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as csvParser from 'csv-parser';
import { createReadStream } from 'fs';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import { MoviesService } from './movies.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from 'src/uploads/uploads.service';
import { SearchOptions } from 'src/core/shared/search-options.dto';
import { FavoriteDto } from './dto/favorite.dto';
import { WatchlistDto } from './dto/watchlist.dto';
import { ConfigService } from 'src/config/config.service';

@ApiTags('movies')
@Controller({ version: '1', path: 'movies' })
export class MoviesController {
  private readonly logger = new Logger(MoviesController.name);

  constructor(
    private readonly moviesService: MoviesService,
    private readonly uploadService: UploadsService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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
  async watchlist(@Body() dto: WatchlistDto) {
    // * 1- get some Details from imdb & store into DB
    const imdbMovie =
      await this.moviesService.fetchAdditionalMovieDetailsFromIMDB(
        dto.media_id,
      );

    await this.moviesService.m.findOneAndUpdate(
      { tmdbId: dto.media_id },
      { imdbDetails: imdbMovie },
    );

    // * use TMDB to add movie to watchlist
    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${this.configService.TMDB.token}`,
    };

    const url = `https://api.themoviedb.org/3/account/${this.configService.TMDB.account_id}/watchlist`;

    return this.moviesService.httpPost(url, dto, headers);
  }

  @Get('list/watchlist')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'list movies from watchlist' })
  async listWatchlist() {
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${this.configService.TMDB.token}`,
    };

    const params = {
      language: 'en-US',
      page: 1,
      sort_by: 'created_at.asc',
    };

    const url = `https://api.themoviedb.org/3/account/${this.configService.TMDB.account_id}/watchlist/movies`;

    const { data } = await firstValueFrom(
      this.httpService.get(url, { headers, params }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    const { results } = data;
    const moviesWithIMDBDetails =
      await this.moviesService.populateIMDB(results);

    console.log({ moviesWithIMDBDetails });

    return { ...data, results: moviesWithIMDBDetails };
  }

  @Post('add/favorite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'add or remove from favorite' })
  async favorite(@Body() dto: FavoriteDto) {
    // * 1- get some Details from imdb & store into DB
    const imdbMovie =
      await this.moviesService.fetchAdditionalMovieDetailsFromIMDB(
        dto.media_id,
      );

    await this.moviesService.m.findOneAndUpdate(
      { tmdbId: dto.media_id },
      { imdbDetails: imdbMovie },
    );

    // *2- use TMDB api to add movie to favorite
    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${this.configService.TMDB.token}`,
    };

    const url = `https://api.themoviedb.org/3/account/${this.configService.TMDB.account_id}/favorite`;

    return this.moviesService.httpPost(url, dto, headers);
  }

  @Get('list/favorite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'list movies from favorite' })
  async listFavorite() {
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${this.configService.TMDB.token}`,
    };

    const params = {
      language: 'en-US',
      page: 1,
      sort_by: 'created_at.asc',
    };

    const url = `https://api.themoviedb.org/3/account/${this.configService.TMDB.account_id}/favorite/movies`;

    const { data } = await firstValueFrom(
      this.httpService.get(url, { headers, params }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    const { results } = data;
    const moviesWithIMDBDetails =
      await this.moviesService.populateIMDB(results);

    console.log({ moviesWithIMDBDetails });

    return { ...data, results: moviesWithIMDBDetails };
  }
}
