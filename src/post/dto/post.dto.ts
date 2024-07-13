import { ApiProperty } from '@nestjs/swagger';

class ImageDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  uri: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  deletedAt: string | null;
}

export class PostDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  color: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  deletedAt: string | null;

  @ApiProperty({ type: [ImageDto] })
  images: ImageDto[];

  @ApiProperty()
  isFavorite: boolean;
}
