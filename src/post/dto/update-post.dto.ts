import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { CreatePostDto } from './create-post.dto';
import { MarkerColor } from '../marker-color.enum';
import { PostDto } from './post.dto';

export class UpdatePostDto extends OmitType(CreatePostDto, [
  'longitude',
  'latitude',
  'address',
] as const) {
  @ApiProperty({ required: false })
  title: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({
    required: true,
    enum: ['RED', 'YELLOW', 'BLUE', 'GREEN', 'PURPLE'],
    description: '마커 색상입니다.',
    example: 'RED',
    default: 'RED',
  })
  @IsNotEmpty()
  color: MarkerColor;

  @ApiProperty({
    required: false,
    type: Date,
    description: '날짜를 입력해주세요.',
    example: '2024-03-29T16:57:40.386Z',
    default: '2024-03-29T16:57:40.386Z',
  })
  @IsDateString()
  date: Date;

  @ApiProperty({
    required: false,
    type: Number,
    description: '점수를 입력해주세요.',
    example: 1,
    default: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  score: number;
  @ApiProperty({
    required: false,
    type: String,
    description: '이미지 주소를 입력해주세요. 단, S3를 곁든.',
    example:
      'https://plus.unsplash.com/premium_photo-1666726721652-a15e685e48a0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b3V0ZG9vcnxlbnwwfHwwfHx8MA%3D%3D',
    default:
      'https://plus.unsplash.com/premium_photo-1666726721652-a15e685e48a0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b3V0ZG9vcnxlbnwwfHwwfHx8MA%3D%3D',
  })
  @IsArray()
  imageUris: { uri: string }[];
}
