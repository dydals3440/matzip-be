import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../@common/@decorators/get-user.decorator';
import { User } from '../auth/user.entity';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller()
// 모든 요청에 토큰이 필요함.
@UseGuards(AuthGuard())
@ApiTags('posts')
// 자물쇠로 잠구자
@ApiBearerAuth()
export class PostController {
  constructor(private postService: PostService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: '내 마커를 조회합니다.',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              latitude: { type: 'number' },
              longitude: { type: 'number' },
              color: {
                type: 'string',
                enum: ['RED', 'BLUE', 'YELLOW', 'GREEN', 'PURPLE'],
              },
              score: { type: 'number' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: '마커를 가져오는 도중 에러가 발생했습니다.',
  })
  @ApiOperation({ summary: '마커를 가져옵니다.', description: '#마커 API' })
  @Get('/markers/my')
  getAllMarkers(@GetUser() user: User) {
    return this.postService.getAllMarkers(user);
  }

  @Get('/posts/my')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '내가 쓴 게시글 조회.',
    description: '#내가 쓴 게시글 조회 API',
  })
  @ApiOkResponse({ status: 200, type: CreatePostDto })
  getPosts(@Query('page') page: number, @GetUser() user: User) {
    return this.postService.getPosts(page, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/posts/:id')
  @ApiOperation({
    summary: '상세 게시글 조회.',
    description: '#상세 게시글 조회 API',
  })
  @ApiOkResponse({ status: 200, type: PostDto })
  getPost(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.postService.getPostById(id, user);
  }

  @Post('/posts')
  @ApiOperation({
    summary: '게시글 작성.',
    description: '#게시글 작성 API',
  })
  @UsePipes(ValidationPipe)
  createPost(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postService.createPost(createPostDto, user);
  }

  @Delete('/posts/:id')
  @ApiOperation({
    summary: '게시글 삭제.',
    description: '#게시글 삭제 API',
  })
  @ApiOkResponse({ status: 200, description: '성공적으로 삭제됨' })
  @ApiResponse({ status: 404, description: '존재하지 않는 피드입니다.' })
  @ApiResponse({
    status: 500,
    description: '삭제하는 도중 에러가 발생했습니다.',
  })
  deletePost(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.postService.deletePost(id, user);
  }

  @ApiOkResponse({
    status: 200,
    type: UpdatePostDto,
  })
  @ApiOperation({
    summary: '게시글 수정.',
    description: '#게시글 수정 API',
  })
  @Patch('/posts/:id')
  @UsePipes(ValidationPipe)
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() // 수정할떄는 좌표를 수정하지 않음. 주소랑
    updatePostDto: Omit<CreatePostDto, 'longitude' | 'latitude' | 'address'>,
  ) {
    return this.postService.updatePost(id, updatePostDto, user);
  }

  @ApiOkResponse({
    status: 200,
    description:
      '{ "일" : [{ "id": 8,\n' +
      '            "title": "제목",\n' +
      '            "address": "서울특별시 야호" }] }' +
      '의 데이터 구조로 받습니다.',
  })
  @ApiOperation({
    summary: '게시글 연/월을 통한 조회.',
    description: '#게시글 날짜별 조회',
  })
  @Get('/posts')
  getPostsByMonth(
    @Query('year') year: number,
    @Query('month') month: number,
    @GetUser() user: User,
  ) {
    return this.postService.getPostsByMonth(year, month, user);
  }

  @ApiOkResponse({
    status: 200,
    isArray: true,
    type: PostDto,
  })
  @ApiOperation({
    summary: '게시글 검색.',
    description: '#게시글 검색어 조회',
  })
  @Get('/posts/my/search')
  searchMyPostsByTitleAndAddress(
    @Query('query') query: string,
    @Query('page') page: number,
    @GetUser() user: User,
  ) {
    return this.postService.searchMyPostsByTitleAndAddress(query, page, user);
  }
}
