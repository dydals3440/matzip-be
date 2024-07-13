import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class YearMonthPostDto {
  @ApiProperty({
    description: 'Post ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Title of the post',
    example: '제목',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Address associated with the post',
    example: '서울특별시 야호',
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}
