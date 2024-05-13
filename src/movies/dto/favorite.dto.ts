import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class FavoriteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'movie' })
  media_type: string = 'movie';

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: '597' })
  media_id: string;

  @IsBoolean()
  @ApiProperty({ type: Boolean, example: true })
  favorite: boolean = true;
}
