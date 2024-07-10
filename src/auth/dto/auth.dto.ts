import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    required: true,
    type: String,
    description: '이메일 형식에 맞는 이메일을 입력해주세요.',
    example: 'example@gmail.com',
    default: 'example@gmail.com',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: '이메일 형식이 아닙니다.',
  })
  email: string;

  @ApiProperty({
    required: true,
    type: String,
    description: '비밀번호를 입력해주세요. (8자~20자이내)',
    example: 'password!',
    default: 'password!',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^[a-zA-z0-9]*$/, {
    message: '비밀번호가 영어 또는 숫자 조합이 아닙니다.',
  })
  password: string;
}
