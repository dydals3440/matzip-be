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

  async getMyFavoritePosts(page: number, user: User) {
    const perPage = 10;
    // 페이지당 10개씩 들고올 수 있게 만듬.
    const offset = (page - 1) * perPage;
    const favorites = await this.favoriteRepository
      .createQueryBuilder('favorite')
      // 포스트 테이블과 결합해서 가져옴.
      // 즐겨찾기 한 게시글만 가져와야 함.
      // 두 테이블 간의 조건을 만족할 때 가져올 수 있는 innerJoinAndSelect를 이용해서,
      // favorite의 post를 가져옴.
      .innerJoinAndSelect('favorite.post', 'post')
      // post 데이터를 갖고왔으면, 그데 해당하는 이미지도 갖고와야함.
      .leftJoinAndSelect('post.images', 'image')
      // 조건을 이용해서, 내것만 가져와야하고.
      .where('favorite.userId = :userId', { userId: user.id })
      .orderBy('post.date', 'DESC')
      // 마지막으로 10개씩 가져오 skip과 take 이용
      .skip(offset)
      .take(perPage)
      .getMany();

    console.log(
      await this.favoriteRepository
        .createQueryBuilder('favorite')
        .innerJoinAndSelect('favorite.post', 'post')
        .leftJoinAndSelect('post.images', 'image')
        .where('favorite.userId = :userId', { userId: user.id })
        .getMany(),
    );

    // 이미지가 정렬이 안되있을 수 있기 때문에, 이미지를 정렬해서 반환해줌.
    const newPosts = favorites.map((favorite) => {
      const post = favorite.post;
      const images = [...post.images].sort((a, b) => a.id - b.id);
      return { ...post, images };
    });
    return newPosts;
  }
}
