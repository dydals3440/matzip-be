import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EditProfileDto } from './dto/edit-profile-dto';
import { MarkerColor } from '../post/marker-color.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(authDto: AuthDto) {
    const { email, password } = authDto;
    // password 암호화 bcrypt이용 salt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      loginType: 'email',
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      // 이미 존재하는 이메일 있을 경우
      if (error.code === '23505') {
        throw new ConflictException('이미 존재하는 이메일입니다.');
      }
      throw new InternalServerErrorException(
        '회원가입 도중 에러가 발생했습니다.',
      );
    }
  }

  private async getTokens(payload: { email: string }) {
    // accessToken과 refreshToken은 순차적으로 만들 필요가 없고, 같이 만들어도됨.
    const [accessToken, refreshToken] = await Promise.all([
      // accessToken 생성
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION'),
      }),
      // refreshToken 생성
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async signin(authDto: AuthDto) {
    const { email, password } = authDto;
    const user = await this.userRepository.findOneBy({ email });
    // 유저가 존재하지않거나, 비밀번호를 해독한 후 같은게 없는 경우
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    // 토큰 생성
    const { accessToken, refreshToken } = await this.getTokens({ email });
    // refreshToken 저장
    await this.updateHashedRefreshToken(user.id, refreshToken);

    return {
      message: '성공',
      statusCode: 200,
      data: { accessToken, refreshToken },
    };
  }

  private async updateHashedRefreshToken(id: number, refreshToken: string) {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    try {
      await this.userRepository.update(id, { hashedRefreshToken });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async refreshToken(user: User) {
    const { email } = user;
    const { accessToken, refreshToken } = await this.getTokens({ email });

    if (!user.hashedRefreshToken) {
      throw new ForbiddenException();
    }

    await this.updateHashedRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async getProfile(user: User) {
    // password, hashedRefreshToken을 제외하고, rest 나머지만 보내줌.
    const { password, hashedRefreshToken, ...rest } = user;
    return { ...rest };
  }

  async editProfile(editProfileDto: EditProfileDto, user: User) {
    const profile = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId: user.id })
      .getOne();
    const { nickname, imageUri } = editProfileDto;

    profile.nickname = nickname;
    profile.imageUri = imageUri;

    if (!profile) {
      throw new NotFoundException('존재하지 않는 사용자 입니다.');
    }

    try {
      await this.userRepository.save(profile);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '프로필 수정 도중 에러가 발생했습니다.',
      );
    }
  }
  async deleteRefreshToken(user: User) {
    try {
      await this.userRepository.update(user.id, { hashedRefreshToken: null });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteAccount(user: User) {
    try {
      await this.userRepository
        .createQueryBuilder('user')
        .delete()
        .from(User)
        .where('id = :id', { id: user.id })
        .execute();
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        '탈퇴할 수 없습니다. 남은 데이터가 존재하는지 확인해주세요.',
      );
    }
  }

  async updateCategory(
    categories: Record<keyof MarkerColor, string>,
    user: User,
  ) {
    const { RED, YELLOW, BLUE, GREEN, PURPLE } = MarkerColor;

    // 만약 카테고리가, 카테고리스의 키가, 컬러 형식이 아니라면, 예외처리를 해줌.
    if (
      !Object.keys(categories).every((color: MarkerColor) =>
        [RED, YELLOW, BLUE, GREEN, PURPLE].includes(color),
      )
    ) {
      throw new BadRequestException('유효하지 않은 카테고리입니다.');
    }
    user[RED] = categories[RED];
    user[YELLOW] = categories[YELLOW];
    user[BLUE] = categories[BLUE];
    user[GREEN] = categories[GREEN];
    user[PURPLE] = categories[PURPLE];

    try {
      await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '카테고리 수정 도중 에러가 발생했습니다.',
      );
    }

    const { password, hashedRefreshToken, ...rest } = user;

    return { ...rest };
  }

  async kakaoLogin(kakaoToken: { token: string }) {
    const url = 'https://kapi.kakao.com/v2/user/me';
    const headers = {
      Authorization: `Bearer ${kakaoToken.token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    try {
      const response = await axios.get(url, { headers });
      const userData = response.data;
      const { id: kakaoId, kakao_acount } = userData;
      const nickname = kakao_acount?.profile.nickname;
      const imageUri = kakao_acount?.profile.thumbnail_image_uri?.replace(
        /^http:/,
        'https:',
      );

      const existingUser = await this.userRepository.findOneBy({
        email: kakaoId,
      });

      if (existingUser) {
        const { accessToken, refreshToken } = await this.getTokens({
          email: existingUser.email,
        });

        await this.updateHashedRefreshToken(existingUser.id, refreshToken);
        return { accessToken, refreshToken };
      }

      const newUser = this.userRepository.create({
        email: kakaoId,
        password: nickname ?? '',
        nickname,
        kakaoImageUri: imageUri ?? null,
        loginType: 'kakao',
      });

      try {
        await this.userRepository.save(newUser);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }

      const { accessToken, refreshToken } = await this.getTokens({
        email: newUser.email,
      });

      await this.updateHashedRefreshToken(newUser.id, refreshToken);
      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Kakao 서버 에러가 발생했습니다.');
    }
  }
}
