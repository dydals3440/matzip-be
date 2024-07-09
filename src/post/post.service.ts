import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async getPosts(page: number) {
    const perPage = 10;
    const offset = (page - 1) * perPage;
    return this.postRepository
      .createQueryBuilder('post')
      .orderBy('post.date', 'DESC')
      .take(perPage)
      .skip(offset)
      .getMany();
  }

  async getPostById(id: number) {
    try {
      const foundPost = await this.postRepository
        // post table에 있는 포스트
        .createQueryBuilder('post')
        // 어떤 포스트냐면
        // where를 이용하면, post.id가 인자로 받는 id와 같은 id를 찾을 것.
        .where('post.id = id', { id })
        // getMany가 아닌 getOne()
        .getOne();

      if (!foundPost) {
        throw new NotFoundException('존재하지 않는 피드입니다.');
      }

      return foundPost;
    } catch (error) {
      throw new InternalServerErrorException(
        '장소를 추가하는 도중 에러가 발생했습니다.',
      );
    }
  }

  async createPost(createPostDto: CreatePostDto) {
    const {
      latitude,
      longitude,
      color,
      score,
      address,
      title,
      description,
      date,
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
    });

    try {
      // save => DB 저장
      await this.postRepository.save(post);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '장소를 추가하는 도중 에러가 발생했습니다.',
      );
    }
    return post;
  }

  async deletePost(id: number) {
    try {
      const result = await this.postRepository
        .createQueryBuilder('post')
        .delete()
        .from(Post)
        // id가 인자와 똑같은 아이디를 삭제
        .where('id = :id', { id })
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
  ) {
    const post = await this.getPostById(id);

    const { title, description, color, date, score, imageUris } = updatePostDto;
    post.title = title;
    post.description = description;
    post.color = color;
    post.date = date;
    post.score = score;

    // image module
    try {
      await this.postRepository.save(post);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '삭제하는 도중 에러가 발생했습니다.',
      );
    }

    return post;
  }

  async getAllMarkers() {
    try {
      // 특정 칼럼만 갖어오는 Select
      const markers = await this.postRepository
        .createQueryBuilder('post')
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
