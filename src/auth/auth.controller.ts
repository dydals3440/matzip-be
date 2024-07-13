import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
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
} from '@nestjs/swagger';
import { LoginSuccessDto } from './dto/login-success-dto';
import { ResponseDto } from './dto/generic-response.dto';
import { MyInfoSuccessDto } from './dto/success/my-info-response';

@ApiTags('auth')
@ApiExtraModels(ResponseDto)
@Controller('auth')
export class AuthController {
  // 서비스를 사용할 수 있게
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.OK)
  // @ApiResponse({
  //   status: 200,
  //   description: 'The record has been successfully created.',
  // })
  @ApiResponse({ status: 23505, description: '이미 존재하는 이메일입니다.' })
  @ApiResponse({
    status: 500,
    description: '회원가입 도중 에러가 발생했습니다.',
  })
  // @ApiOkResponse({ description: '회원가입 성공', type: LoginSuccessDto })
  @ApiOkResponse({ description: '회원가입 성공' })
  @ApiOperation({
    // /auth/signup 회원가입하기
    summary: '회원가입하기',
    // Parameter 위에 뜸.
    description: '# 회원가입 API',
    // API 더이상 사용이 불가 한 경우.
    // deprecated: true,
    // externalDocs: {
    //   description: '외부 문서',
    //   url: 'https://www.naver.com',
    // },
  })
  signup(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.signup(authDto);
  }

  // @GenericApiResponse({ model: LoginSuccessDto })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: '토큰 재발급 성공', type: LoginSuccessDto })
  @ApiOperation({
    summary: '로그인.',
    description: '#로그인 API',
  })
  @ApiResponse({
    status: 401,
    description: '이메일 또는 비밀번호가 일치하지 않습니다.',
  })
  @Post('/signin')
  signin(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.signin(authDto);
  }

  // 로그인 한 유저만 Refresh url에 접근 가능.
  // 요청에 유저 정보가 담겨져 있음.
  // @GenericApiResponse({ model: LoginSuccessDto })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: '토큰 재발급 성공', type: LoginSuccessDto })
  @ApiOperation({
    summary: 'access-token 재발급.',
    description: '#refresh-token 활용 access-token 재발급',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @Get('/refresh')
  @UseGuards(AuthGuard())
  refresh(@GetUser() user: User) {
    return this.authService.refreshToken(user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: '유저 프로필 조회 성공',
    type: MyInfoSuccessDto,
  })
  @ApiOperation({
    summary: '내 정보 가져오기.',
    description: '#내 정보 가져오기 API',
  })
  // @GenericApiResponse({ model: MyInfoSuccessDto, isArray: true })
  @Get('/me')
  @UseGuards(AuthGuard())
  getProfile(@GetUser() user: User) {
    return this.authService.getProfile(user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: '유저 프로필 수정 성공',
  })
  @ApiOperation({
    summary: '내 정보 수정.',
    description: '#내 정보 수정 API',
  })
  @Patch('/me')
  @UseGuards(AuthGuard())
  editProfile(@Body() editProfileDto: EditProfileDto, @GetUser() user: User) {
    return this.authService.editProfile(editProfileDto, user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: '로그아웃 성공',
  })
  @ApiOperation({
    summary: '로그아웃.',
    description: '#로그아웃 API',
  })
  @Post('/logout')
  @UseGuards(AuthGuard())
  logout(@GetUser() user: User) {
    return this.authService.deleteRefreshToken(user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: '회원 탈퇴 성공',
  })
  @ApiOperation({
    summary: '회원 탈퇴.',
    description: '#회원 탈퇴 API',
  })
  @Delete('/me')
  @UseGuards(AuthGuard())
  deleteAccount(@GetUser() user: User) {
    return this.authService.deleteAccount(user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '카테고리 내용 수정.',
    description: '#카테고리 내용 수정 API',
  })
  @ApiOkResponse({
    description: '카테고리 내용 수정',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            RED: { type: 'string' },
            BLUE: { type: 'string' },
            YELLOW: { type: 'string' },
            GREEN: { type: 'string' },
            PURPLE: { type: 'string' },
          },
        },
      },
    },
  })
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
  @ApiOperation({
    // /auth/signup 회원가입하기
    summary: '카카오 소셜 로그인 진행',
    // Parameter 위에 뜸.
    description:
      '# 카카오 소셜 로그인 (REDIRECT_URL 설정 필요로 인한 비활성화)',
    // API 더이상 사용이 불가 한 경우.
    deprecated: true,
    externalDocs: {
      description: '카카오 Developers 로그인 문서',
      url: 'https://developers.kakao.com/docs/latest/ko/kakaotalk-channel/common',
    },
  })
  @Post('/oauth/kakao')
  kakaoLogin(@Body() kakaoToken: { token: string }) {
    return this.authService.kakaoLogin(kakaoToken);
  }

  // 애플 로그인
  @ApiOperation({
    // /auth/signup 회원가입하기
    summary: '애플 소셜 로그인 진행',
    // Parameter 위에 뜸.
    description: '# 애플 소셜 로그인 (REDIRECT_URL 설정 필요로 인한 비활성화)',
    // API 더이상 사용이 불가 한 경우.
    deprecated: true,
    externalDocs: {
      description: '애플 Developers 로그인 문서',
      url: 'https://developer.apple.com/kr/',
    },
  })
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
