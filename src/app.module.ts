import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { PostModule } from './post/post.module';

@Module({
  imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'matzip-server',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true
      }),
      PostModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
