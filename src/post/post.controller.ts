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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GenericApiResponse } from '../@common/@decorators/generic-api-response-decorator';
import { LoginSuccessDto } from '../auth/dto/login-success-dto';

@Controller()
// 모든 요청에 토큰이 필요함.
@UseGuards(AuthGuard())
@ApiTags('posts')
// 자물쇠로 잠구자
@ApiBearerAuth()
export class PostController {
  constructor(private postService: PostService) {}

  @Get('/markers/my')
  getAllMarkers(@GetUser() user: User) {
    return this.postService.getAllMarkers(user);
  }

  @Get('/posts/my')
  @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({
  //   type: CreatePostDto,
  //   isArray: true,
  // })
  @GenericApiResponse({
    model: CreatePostDto,
    isArray: true,
    description: '## 성공적으로 Post 목록을 모두 가져왔습니다.',
    statusCode: 200,
  })
  getPosts(@Query('page') page: number, @GetUser() user: User) {
    return this.postService.getPosts(page, user);
  }

  @Get('/posts/:id')
  // Pipe를 사용해서, Id가 string으로와도, parseInt형태로 바꿀 수 있음.
  getPost(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.postService.getPostById(id, user);
  }

  @Post('/posts')
  @UsePipes(ValidationPipe)
  createPost(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postService.createPost(createPostDto, user);
  }

  @Delete('/posts/:id')
  deletePost(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.postService.deletePost(id, user);
  }

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

  @Get('/posts')
  getPostsByMonth(
    @Query('year') year: number,
    @Query('month') month: number,
    @GetUser() user: User,
  ) {
    return this.postService.getPostsByMonth(year, month, user);
  }

  @Get('/posts/my/search')
  searchMyPostsByTitleAndAddress(
    @Query('query') query: string,
    @Query('page') page: number,
    @GetUser() user: User,
  ) {
    return this.postService.searchMyPostsByTitleAndAddress(query, page, user);
  }
}
