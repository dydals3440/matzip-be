import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  async toggleFavorite(postId: number, user: User) {
    if (!postId) {
      throw new BadRequestException('존재하지 않는 피드입니다.');
    }

    const existingFavorite = await this.favoriteRepository.findOne({
      where: {
        postId,
        userId: user.id,
      },
    });
    // 즐겨찾기 삭제
    if (existingFavorite) {
      await this.favoriteRepository.delete(existingFavorite.id);

      return existingFavorite.postId;
    }
    // 즐겨찾기 추가
    const favorite = this.favoriteRepository.create({
      postId,
      userId: user.id,
    });

    await this.favoriteRepository.save(favorite);

    return favorite.postId;
  }
}
