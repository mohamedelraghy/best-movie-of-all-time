import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

import { MoviesService } from './movies.service';
import { ConfigService } from 'src/config/config.service';
import { Movie } from './entities/movie.entity';

jest.mock('@nestjs/axios');

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            TMDB: { api_key: 'test_tmdb_api_key' },
            IMDB: { api_key: 'test_imdb_api_key' },
          },
        },
        {
          provide: getModelToken(Movie.name),
          useValue: {
            findOne: jest.fn(),
            aggregate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpService = module.get(HttpService);
  });

  it('can create instance of Movies Services', async () => {
    expect(service).toBeDefined();
  });

  describe('fetch Movie Details From TMDB', () => {
    it('should fetch movie details from TMDB', async () => {
      const mockResponse: AxiosResponse<any> = {
        data: { results: [{ id: 1, title: 'Test Movie' }] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.fetchMovieDetailsFromTMDB(
        'Test Movie',
        '2021',
      );
      expect(result).toEqual({ id: 1, title: 'Test Movie' });
    });

    it('should throw an error if TMDB request fails', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => new Error('error')));

      await expect(
        service.fetchMovieDetailsFromTMDB('Test Movie', '2021'),
      ).rejects.toThrow('error');
    });
  });

  describe('fetch Additional Movie Details From IMDB', () => {
    it('should return movie details from IMDB', async () => {
      const mockTMDBResponse: AxiosResponse<any> = {
        data: { imdb_id: 'tt1234567' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: undefined },
      };

      const mockIMDBResponse: AxiosResponse<any> = {
        data: { Genre: 'Action, Drama', Title: 'Test Movie' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: undefined },
      };
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(of(mockTMDBResponse))
        .mockReturnValueOnce(of(mockIMDBResponse));

      const result = await service.fetchAdditionalMovieDetailsFromIMDB('1');
      expect(result).toEqual({ Genre: 'Action, Drama', Title: 'Test Movie' });
    });

    it('should throw an error if IMDB request fails', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => new Error('error')));

      await expect(
        service.fetchAdditionalMovieDetailsFromIMDB('1'),
      ).rejects.toThrow('error');
    });
  });

  describe('enrich Movie Data', () => {
    it('should enrich movie data', async () => {
      const mockTMDBResponse = { id: '1', title: 'Test Movie' };
      const mockIMDBResponse = { Genre: 'Action, Drama' };

      jest
        .spyOn(service, 'fetchMovieDetailsFromTMDB')
        .mockResolvedValue(mockTMDBResponse);

      jest
        .spyOn(service, 'fetchAdditionalMovieDetailsFromIMDB')
        .mockResolvedValue(mockIMDBResponse);

      const result = await service.enrichMovieData('Test Movie', '2021');
      expect(result).toEqual({
        ...mockTMDBResponse,
        genre: ['Action', 'Drama'],
        tmdbId: '1',
      });
    });

    it('should throw an error if fetching TMDB details fails', async () => {
      jest
        .spyOn(service, 'fetchMovieDetailsFromTMDB')
        .mockRejectedValue('error');

      await expect(
        service.enrichMovieData('Test Movie', '2021'),
      ).rejects.toThrow('error');
    });

    it('should throw an error if fetching IMDB details fails', async () => {
      jest
        .spyOn(service, 'fetchMovieDetailsFromTMDB')
        .mockResolvedValue({ id: '1', title: 'Test Movie' });
      jest
        .spyOn(service, 'fetchAdditionalMovieDetailsFromIMDB')
        .mockRejectedValue('error');

      await expect(
        service.enrichMovieData('Test Movie', '2021'),
      ).rejects.toThrow('error');
    });
  });
});
