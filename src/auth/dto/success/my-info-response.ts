import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';
import { LoginType, MarkerColor } from '../../../post/marker-color.enum';

export class MyInfoSuccessDto {
  @ApiProperty({
    example: 1,
    default: 1,
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: LoginType.EMAIL,
    default: LoginType.EMAIL,
    enum: [LoginType.EMAIL, LoginType.KAKAO, LoginType.APPLE],
  })
  @IsString()
  loginType: LoginType;

  @ApiProperty({})
  @IsString()
  email: string;

  @ApiProperty({})
  @IsString()
  nickname: string;

  @ApiProperty({})
  @IsString()
  imageUri: string;

  @ApiProperty({})
  @IsString()
  kakaoImageUri: string;

  @ApiProperty({})
  @IsString()
  RED: string;

  @ApiProperty({})
  @IsString()
  BLUE: string;

  @ApiProperty({})
  @IsString()
  GREEN: string;

  @ApiProperty({})
  @IsString()
  PURLPLE: string;

  @ApiProperty({})
  @IsString()
  YELLOW: string;

  @ApiProperty({
    type: Date,
    description: '날짜를 입력해주세요.',
    example: '2024-07-10T06:57:51.960Z',
    default: '2024-07-10T06:57:51.960Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: '날짜를 입력해주세요.',
    example: '2024-07-10T06:57:51.960Z',
    default: '2024-07-10T06:57:51.960Z',
  })
  @IsDateString()
  updatedAt: Date;

  @ApiProperty({
    type: Date,
    example: '2024-07-10T06:57:51.960Z',
    default: '2024-07-10T06:57:51.960Z',
  })
  @IsDateString()
  deletedAt: Date;
}
