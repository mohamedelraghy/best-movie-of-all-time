import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ConfigService } from 'src/config/config.service';
import { BaseService } from 'src/core/shared/base.service';
import { Movie, MovieDoc } from './entities/movie.entity';
import { SearchOptions } from 'src/core/shared/search-options.dto';
import { Pagination } from 'src/core/shared/pagination.dto';
import { FavoriteDto } from './dto/favorite.dto';
import { WatchlistDto } from './dto/watchlist.dto';

@Injectable()
export class MoviesService extends BaseService<MovieDoc> {
  private readonly logger = new Logger(MoviesService.name);
  constructor(
    @InjectModel(Movie.name) readonly m: Model<MovieDoc>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super(m);
  }

  /**
   * Description - Search for a movie using TMDB API
   * @param {string} title
   * @param {string} year
   * @returns {Promise<any>}
   **/
  async fetchMovieDetailsFromTMDB(title: string, year: string): Promise<any> {
    try {
      const data = await this.httpGet(
        'https://api.themoviedb.org/3/search/movie',
        {
          api_key: this.configService.TMDB.api_key,
          include_adult: false,
          query: title,
          year,
        },
      );

      return data.results[0]; // Assuming we are taking the first result
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  /**
   * Description - fetch Additional Movie Details From IMDB
   * @param {string} tmdbId
   * @returns {Promise<any>}
   **/
  async fetchAdditionalMovieDetailsFromIMDB(tmdbId: string): Promise<any> {
    try {
      // Use TMDB ID to search for the corresponding IMDB ID
      const { imdb_id } = await this.httpGet(
        `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids`,
        {
          api_key: this.configService.TMDB.api_key,
        },
      );

      // Fetch movie details from IMDB using the IMDB ID
      const imdbMovie = await this.httpGet('http://www.omdbapi.com/', {
        apikey: this.configService.IMDB.api_key,
        i: imdb_id,
      });

      return imdbMovie;
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  /**
   * Description - collect movie details from TMDB & IMDB
   * @param {string} title
   * @param {string} year
   * @returns {Promise<any>}
   **/
  async enrichMovieData(title: string, year: string): Promise<any> {
    try {
      // Fetch basic movie details from TMDB
      const tmdbMovie = await this.fetchMovieDetailsFromTMDB(title, year);

      // Fetch additional movie details from IMDB using TMDB ID
      const imdbMovie = await this.fetchAdditionalMovieDetailsFromIMDB(
        tmdbMovie.id,
      );

      // Merge data from both sources
      const enrichedMovie = {
        ...tmdbMovie,
        genre: imdbMovie.Genre.split(',').map((genre) => genre.trim()),
        tmdbId: tmdbMovie.id,
        // imdbDetails: imdbMovie,
      };

      return enrichedMovie;
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async findAll(options: SearchOptions): Promise<Pagination> {
    const aggregation = [];

    const {
      sort,
      dir,
      offset,
      size,
      searchTerm,
      filterBy,
      filterByDateFrom,
      filterByDateTo,
    } = options;

    if (sort?.length && dir) {
      this.sort(aggregation, sort, dir);
    }

    if (filterBy?.length) {
      this.filter(aggregation, filterBy);
    }

    if (searchTerm) {
      this.search(aggregation, searchTerm);
    }

    if (filterByDateFrom && filterByDateTo) {
      aggregation.push(
        //change date to string & match
        {
          $addFields: {
            createdAtToString: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
          },
        },
        {
          $match: {
            $and: [
              {
                $or: [
                  {
                    createdAtToString: {
                      $gte: filterByDateFrom,
                      $lte: filterByDateTo,
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          $project: {
            createdAtToString: 0,
          },
        },
      );
    }
    return await this.aggregate(aggregation, offset, size);
  }

  /**
   * Retrieves a paginated list of movies based on the provided search options.
   *
   * @param {SearchOptions} options - The search options to apply.
   * @param {string[]} options.sort - The fields to sort the movies by.
   * @param {string} options.dir - The direction of the sorting (asc or desc).
   * @param {number} options.offset - The number of movies to skip.
   * @param {number} options.size - The maximum number of movies to return.
   * @param {string} options.searchTerm - The search term to match against.
   * @param {Record<string, any>[]} options.filterBy - The filters to apply.
   * @param {string} options.filterByDateFrom - The start date for filtering by date.
   * @param {string} options.filterByDateTo - The end date for filtering by date.
   * @returns {Promise<Pagination>} - A promise that resolves to the paginated list of movies.
   */
  private search(aggregation: any, searchTerm: string): void {
    aggregation.push({
      $match: {
        $or: [
          { title: new RegExp('^' + searchTerm, 'i') },
          { overview: new RegExp('^' + searchTerm, 'i') },
          { title: new RegExp('^' + searchTerm, 'i') },
          { 'imdbDetails.Title': new RegExp('^' + searchTerm, 'i') },
          { 'imdbDetails.Director': new RegExp('^' + searchTerm, 'i') },
          { 'imdbDetails.Writer': new RegExp('^' + searchTerm, 'i') },
          { 'imdbDetails.Actors': new RegExp('^' + searchTerm, 'i') },
          { 'imdbDetails.Plot': new RegExp('^' + searchTerm, 'i') },
          { 'imdbDetails.Country': new RegExp('^' + searchTerm, 'i') },
          { 'imdbDetails.Awards': new RegExp('^' + searchTerm, 'i') },
          { 'imdbDetails.Poster': new RegExp('^' + searchTerm, 'i') },
        ],
      },
    });
  }

  async populateIMDB(movies) {
    for (const movie of movies) {
      const { imdbDetails } = await this.findOne({ tmdbId: movie.id });
      movie.imdbDetails = imdbDetails;
    }
    return movies;
  }

  async httpPost(
    url: string,
    body: WatchlistDto | FavoriteDto,
    headers: any,
  ): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.post(url, body, { headers }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw new Error('An error happened!');
        }),
      ),
    );

    return data;
  }

  private async httpGet(url: string, params: any): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get(url, { params }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw new Error('An error happened!');
        }),
      ),
    );

    return data;
  }
}
