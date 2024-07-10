import { MarkerColor } from '../marker-color.enum';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    required: true,
    type: String,
    description: '위도입니다.',
    example: '127.01',
    // 기본 값
    default: '123.1234',
    // minimum: 6,
    // maximum: 30,
  })
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    required: true,
    type: String,
    description: '경도입니다.',
    example: '127.01',
    // 기본 값
    default: '123.1234',
    // minimum: 6,
    // maximum: 30,
  })
  @IsNotEmpty()
  longitude: number;

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
    type: String,
    description: '주소를 입력해주세요.',
    example: '서울특별시 종로구 홍지문2길 20',
    default: '서울특별시 종로구 홍지문2길 20',
  })
  @IsString()
  address: string;

  @ApiProperty({
    required: true,
    type: String,
    description: '제목을 입력해주세요.',
    example: '이것은 세상에서 제일 멋진 제목입니다.',
    default: '이것은 세상에서 제일 멋진 제목입니다.',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    required: false,
    type: String,
    description: '설명을 입력해주세요.',
    example: '이것은, 제목에 대한 설명입니다!!',
    default: '이것은, 제목에 대한 설명입니다!!',
  })
  @IsString()
  description: string;

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
