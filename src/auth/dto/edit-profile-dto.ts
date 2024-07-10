import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditProfileDto {
  @ApiProperty({
    required: false,
    type: String,
    description: '변경하실 닉네임을 입력해주세요.',
    example: '야호닉네임변경',
    default: '야호닉네임변경',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  nickname: string;

  @ApiProperty({
    required: false,
    type: String,
    description: '이미지 주소를 입력해주세요. 단, S3를 곁든.',
    example:
      'https://plus.unsplash.com/premium_photo-1666726721652-a15e685e48a0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b3V0ZG9vcnxlbnwwfHwwfHx8MA%3D%3D',
    default:
      'https://plus.unsplash.com/premium_photo-1666726721652-a15e685e48a0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b3V0ZG9vcnxlbnwwfHwwfHx8MA%3D%3D',
  })
  @IsString()
  imageUri: string;
}
