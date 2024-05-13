import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class FavoriteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'movie' })
  media_type: string = 'movie';

  @IsNumber()
  @IsPositive()
  @ApiProperty({ type: Number, example: 597 })
  media_id: number;

  @IsBoolean()
  @ApiProperty({ type: Boolean, example: true })
  favorite: boolean = true;
}
