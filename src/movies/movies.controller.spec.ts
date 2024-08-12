import * as fs from 'fs';

import { UploadsService } from 'src/uploads/uploads.service';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ConfigService } from 'src/config/config.service';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: MoviesService;
  let uploadsService: UploadsService;
  let configService: ConfigService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            enrichMovieData: jest.fn(),
            findOne: jest.fn(),
            m: {
              insertMany: jest.fn(),
              findOneAndUpdate: jest.fn(),
            },
            fetchAdditionalMovieDetailsFromIMDB: jest.fn(),
            httpPost: jest.fn(),
            findAll: jest.fn(),
            populateIMDB: jest.fn(),
          },
        },
        { provide: UploadsService, useValue: { saveFile: jest.fn() } },
        {
          provide: ConfigService,
          useValue: {
            TMDB: { token: 'mock-token', account_id: 'mock-account-id' },
          },
        },
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
    uploadsService = module.get<UploadsService>(UploadsService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
