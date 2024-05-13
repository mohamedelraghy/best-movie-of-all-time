import { IsEnum, IsIn, IsNumber, IsPositive, IsString } from 'class-validator';

enum Environment {
  Development = 'development',
  Test = 'test',
  Staging = 'staging',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsIn(Object.values(Environment))
  NODE_ENV = Environment.Development;

  @IsNumber()
  @IsPositive()
  PORT: number;

  @IsString()
  MONGO_URI: string;

  @IsNumber()
  RATE_LIMIT: number;

  @IsString()
  GLOBAL_PREFIX: string;

  @IsString()
  API_URL: string;

  @IsString()
  TMDB_API_KEY: string;

  @IsString()
  TMDB_ACCOUNT_ID: string;

  @IsString()
  TMDB_TOKEN: string;

  @IsString()
  IMDB_API_KEY: string;
}
