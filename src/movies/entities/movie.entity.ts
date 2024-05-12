import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { BaseEntity } from 'src/core/entities/base.entity';

export type MovieDoc = Movie & Document;
@Schema({ timestamps: true, versionKey: false, id: false })
export class Movie extends BaseEntity {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Boolean, required: true })
  adult: boolean;

  @Prop({ type: Number, required: true })
  tmdbId: number;

  @Prop({ type: String, required: true })
  overview: string;

  @Prop({ type: Number, required: true })
  popularity: number;

  @Prop({ type: String, required: true })
  release_date: string;

  @Prop({ type: Number, required: true })
  vote_average: number;

  @Prop({ type: Number, required: true })
  vote_count: number;

  @Prop({ type: [String], required: true })
  genre: string[];

  @Prop({ type: Object, required: true })
  imdbDetails: object;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
