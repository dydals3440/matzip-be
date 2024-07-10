import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginSuccessDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWF0IjoxNzIwNTg4NzQxLCJleHAiOjE3MjA1OTA1NDF9.7V0nMc8oTChle3XtE845PEtw8sfKOfNanlrWuYVLm30',
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWF0IjoxNzIwNTg4NzQxLCJleHAiOjE3MjA1OTA1NDF9.7V0nMc8oTChle3XtE845PEtw8sfKOfNanlrWuYVLm30',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWF0IjoxNzIwNTg4NzQxLCJleHAiOjE3MjMxODA3NDF9.9GhITQhSSz50DSsqSgtanIBwA2Ewa7Wg5G8OjT4As-Y',
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWF0IjoxNzIwNTg4NzQxLCJleHAiOjE3MjMxODA3NDF9.9GhITQhSSz50DSsqSgtanIBwA2Ewa7Wg5G8OjT4As-Y',
  })
  @IsString()
  refreshToken: string;
}

// {
//   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWF0IjoxNzIwNTg4NzQxLCJleHAiOjE3MjA1OTA1NDF9.7V0nMc8oTChle3XtE845PEtw8sfKOfNanlrWuYVLm30",
//   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWF0IjoxNzIwNTg4NzQxLCJleHAiOjE3MjMxODA3NDF9.9GhITQhSSz50DSsqSgtanIBwA2Ewa7Wg5G8OjT4As-Y"
// }
