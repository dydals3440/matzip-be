import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { Image } from '../image/image.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  // Image가 정렬이 안되어있음.
  private getPostsWithOrderImage(posts: Post[]) {
    return posts.map((post) => {
      const { images, ...rest } = post;
      const newImages = [...images].sort((a, b) => a.id - b.id);

      return { ...rest, images: newImages };
    });
  }

  async getPosts(page: number, user: User) {
    const perPage = 10;
    console.log(page);
    const offset = (page - 1) * perPage;

    const posts = await this.postRepository
      .createQueryBuilder('post')
      // 이미지를 받아올떄, 이미지 배열을, post.images안에 넣어줌.
      .leftJoinAndSelect('post.images', 'image')
      .where('post.userId = :userId', { userId: user.id })
      .orderBy('post.date', 'DESC')
      .take(perPage)
      .skip(offset)
      .getMany();

    return this.getPostsWithOrderImage(posts);
  }

  async getPostById(id: number, user: User) {
    try {
      const foundPost = await this.postRepository
        // post table에 있는 포스트
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.images', 'image')
        // 포스트에서 개별 게시글을 가져올떄, 즐겨찾기 한 게시글인지 아닌지를 알 수 있음 이제.
        // 이미지 테이블을 leftJoin을 통해 가져온 것 처럼, leftJoin을 통해 favorite 테이블도 가져옴.
        .leftJoinAndSelect(
          'post.favorites',
          'favorite',
          'favorite.userId = :userId',
          { userId: user.id },
        )
        .where('post.userId = :userId', { userId: user.id })
        // 어떤 포스트냐면
        // where를 이용하면, post.id가 인자로 받는 id와 같은 id를 찾을 것.
        .andWhere('post.id = :id', { id })
        // getMany가 아닌 getOne()
        .getOne();

      if (!foundPost) {
        throw new NotFoundException('존재하지 않는 피드입니다.');
      }

      // 대신 favorite에 관련된 데이터를 모두 보낼 필요는 없음.
      // console.log(foundPost);

      // 그래서 아래와 같이 favorites 여부에 대한 정보를 전달함.
      const { favorites, ...rest } = foundPost;
      // Length > 0보다 크면,즐겨찾기를 한 게시글, 아니면 즐겨찾기를 하지 않은 게시글이다.
      const postWithIsFavorites = { ...rest, isFavorite: favorites.length > 0 };
      // console.log(postWithIsFavorites);
      return postWithIsFavorites;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '장소를 추가하는 도중 에러가 발생했습니다.',
      );
    }
  }

  async createPost(createPostDto: CreatePostDto, user: User) {
    const {
      latitude,
      longitude,
      color,
      score,
      address,
      title,
      description,
      date,
      imageUris,
    } = createPostDto;

    const post = this.postRepository.create({
      latitude,
      longitude,
      color,
      score,
      address,
      title,
      description,
      date,
      user,
    });
    const images = imageUris.map((uri) => this.imageRepository.create(uri));
    post.images = images;

    try {
      await this.imageRepository.save(images);
      // save => DB 저장
      await this.postRepository.save(post);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '장소를 추가하는 도중 에러가 발생했습니다.',
      );
    }
    // 유저 정보 빼고 넘기는법.
    const { user: _, ...postWithoutUser } = post;
    return postWithoutUser;
  }

  async deletePost(id: number, user: User) {
    try {
      const result = await this.postRepository
        .createQueryBuilder('post')
        .delete()
        .from(Post)
        // .where('post.userId = :userId', { userId: user.id })
        .where('userId = :userId', { userId: user.id })
        // id가 인자와 똑같은 아이디를 삭제
        .andWhere('id = :id', { id })
        .execute();
      // 결과가 일어나지 않으면
      if (result.affected === 0) {
        throw new NotFoundException('존재하지 않는 피드입니다.');
      }
      return id;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '삭제하는 도중 에러가 발생했습니다.',
      );
    }
  }

  async updatePost(
    id: number,
    updatePostDto: Omit<CreatePostDto, 'longitude' | 'latitude' | 'address'>,
    user: User,
  ) {
    const post = await this.getPostById(id, user);

    const { title, description, color, date, score, imageUris } = updatePostDto;
    post.title = title;
    post.description = description;
    post.color = color;
    post.date = date;
    post.score = score;

    const images = imageUris.map((uri) => this.imageRepository.create(uri));
    post.images = images;

    // image module
    try {
      await this.imageRepository.save(images);
      await this.postRepository.save(post);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '삭제하는 도중 에러가 발생했습니다.',
      );
    }

    return post;
  }

  async getAllMarkers(user: User) {
    try {
      // 특정 칼럼만 갖어오는 Select
      const markers = await this.postRepository
        .createQueryBuilder('post')
        .where('post.userId = :userId', { userId: user.id })
        .select([
          'post.id',
          'post.latitude',
          'post.longitude',
          'post.color',
          'post.score',
        ])
        .getMany();

      return markers;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '마커를 가져오는 도중 에러가 발생했습니다.',
      );
    }
  }
}
