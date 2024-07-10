import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('MATZIP API')
    .setDescription('MATZIP 앱 API 문서문서입니다.')
    .setVersion('1.0')
    .addTag('matzip', '맛집 관련입니다.')
    // JWT 인증 헤더에 넣음.
    .addBearerAuth()
    .setTermsOfService('https://policy.naver.com/policy/service.html')
    .setContact('관리자', 'https://www.youtube.com', 'dydals3440@gmailcom')
    .addServer('http://localhost:3000/', 'develop')
    .addServer('http://localhost:4000/', 'stagging')
    .addServer('http://matthew.com/', 'production')
    .setLicense(
      'MIT',
      'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // '/doc'을 뒤에 엔드포인트로 붙이면 나옴 default: /api
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
bootstrap();
