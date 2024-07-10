import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { GetUser } from '../@common/@decorators/get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { EditProfileDto } from './dto/edit-profile-dto';
import { MarkerColor } from '../post/marker-color.enum';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { LoginSuccessDto } from './dto/login-success-dto';
import { ResponseDto } from './dto/generic-response.dto';
import { GenericApiResponse } from '../@common/@decorators/generic-api-response-decorator';

@ApiTags('auth')
@ApiExtraModels(ResponseDto)
@Controller('auth')
export class AuthController {
  // 서비스를 사용할 수 있게
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiOkResponse({ description: '회원가입 성공', type: LoginSuccessDto })
  @ApiOperation({
    // /auth/signup 회원가입하기
    summary: '회원가입하기',
    // Parameter 위에 뜸.
    description: '# 회원가입 API',
    // API 더이상 사용이 불가 한 경우.
    // deprecated: true,
    externalDocs: {
      description: '외부 문서',
      url: 'https://www.naver.com',
    },
  })
  signup(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.signup(authDto);
  }

  // @ApiOkResponse({
  //   status: 200,
  //   schema: {
  //     allOf: [
  //       { $ref: getSchemaPath(ResponseDto) },
  //       {
  //         properties: {
  //           data: {
  //             type: 'object',
  //             // items: { $ref: getSchemaPath(LoginSuccessDto) },
  //             // 배열이 아닌 경우는 ref만, 뺴면됨.
  //             $ref: getSchemaPath(LoginSuccessDto),
  //           },
  //         },
  //       },
  //       //   // 배열인 경우
  //       //   properties: {
  //       //     data: {
  //       //       type: 'array',
  //       //       items: { $ref: getSchemaPath(LoginSuccessDto) },
  //       //     },
  //       // },
  //     ],
  //   },
  // })
  @GenericApiResponse({ model: LoginSuccessDto })
  @Post('/signin')
  signin(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.signin(authDto);
  }

  // 로그인 한 유저만 Refresh url에 접근 가능.
  // 요청에 유저 정보가 담겨져 있음.
  @GenericApiResponse({ model: LoginSuccessDto })
  @Get('/refresh')
  @UseGuards(AuthGuard())
  refresh(@GetUser() user: User) {
    return this.authService.refreshToken(user);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getProfile(@GetUser() user: User) {
    return this.authService.getProfile(user);
  }

  @Patch('/me')
  @UseGuards(AuthGuard())
  editProfile(@Body() editProfileDto: EditProfileDto, @GetUser() user: User) {
    return this.authService.editProfile(editProfileDto, user);
  }

  @Post('/logout')
  @UseGuards(AuthGuard())
  logout(@GetUser() user: User) {
    return this.authService.deleteRefreshToken(user);
  }

  @Delete('/me')
  @UseGuards(AuthGuard())
  deleteAccount(@GetUser() user: User) {
    return this.authService.deleteAccount(user);
  }

  @Patch('/category')
  @UseGuards(AuthGuard())
  updateCategory(
    @Body() categories: Record<keyof MarkerColor, string>,
    @GetUser() user: User,
  ) {
    return this.authService.updateCategory(categories, user);
  }

  // 카카오 로그인
  // 클라이언트에서 토큰을줌, 이걸 기반으로 백엔드에서 로그인 구현.
  @Post('/oauth/kakao')
  kakaoLogin(@Body() kakaoToken: { token: string }) {
    return this.authService.kakaoLogin(kakaoToken);
  }

  // 애플 로그인
  @Post('/oauth/apple')
  appleLogin(
    @Body()
    appleIdentity: {
      identityToken: string;
      appId: string;
      nickname: string | null;
    },
  ) {
    return this.authService.appleLogin(appleIdentity);
  }
}
