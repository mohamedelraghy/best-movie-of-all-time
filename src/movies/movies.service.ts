import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async fetchMovieDetailsFromTMDB(title, year) {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<any>('https://api.themoviedb.org/3/search/movie', {
            params: {
              api_key: this.configService.TMDB.api_key,
              include_adult: false,
              query: title,
              year,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw 'An error happened!';
            }),
          ),
      );

      const movie = data.results[0]; // Assuming we are taking the first result

      console.log({ movie });

      return {
        title: movie.title,
        releaseDate: movie.release_date,
        tmdbId: movie.id,
        // Add more relevant data from TMDB if needed
      };
    } catch (error) {
      console.error('Error fetching movie details from TMDB:', error);
      throw error;
    }
  }

  async fetchAdditionalMovieDetailsFromIMDB(tmdbId) {
    try {
      // Use TMDB ID to search for the corresponding IMDB ID

      const { data } = await firstValueFrom(
        this.httpService
          .get(
            'https://api.themoviedb.org/3/movie/' + tmdbId + '/external_ids',
            {
              params: {
                api_key: this.configService.TMDB.api_key,
              },
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw 'An error happened!';
            }),
          ),
      );

      const imdbId = data.imdb_id;

      // Fetch movie details from IMDB using the IMDB ID
      const imdbResponse = await firstValueFrom(
        this.httpService
          .get('http://www.omdbapi.com/', {
            params: {
              apikey: this.configService.IMDB.api_key,
              i: imdbId,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw 'An error happened!';
            }),
          ),
      );

      const imdbMovie = imdbResponse.data;
      return {
        imdbRating: imdbMovie.imdbRating,
        plot: imdbMovie.Plot,
        // Add more relevant data from IMDB if needed
      };
    } catch (error) {
      console.error(
        'Error fetching additional movie details from IMDB:',
        error,
      );
      throw error;
    }
  }

  async enrichMovieData(title, year) {
    try {
      // Fetch basic movie details from TMDB
      const tmdbMovie = await this.fetchMovieDetailsFromTMDB(title, year);

      // Fetch additional movie details from IMDB using TMDB ID
      const imdbMovie = await this.fetchAdditionalMovieDetailsFromIMDB(
        tmdbMovie.tmdbId,
      );

      // Merge data from both sources
      const enrichedMovie = {
        ...tmdbMovie,
        ...imdbMovie,
      };

      console.log({ enrichedMovie });

      return enrichedMovie;
    } catch (error) {
      console.error('Error enriching movie data:', error);
      throw error;
    }
  }

  private async httpGet(url: string, params: any): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get(url, { params }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    return data;
  }
}
