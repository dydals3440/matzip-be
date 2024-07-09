import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller()
// 모든 요청에 토큰이 필요함.
@UseGuards(AuthGuard())
export class PostController {
  constructor(private postService: PostService) {}

  @Get('/markers/my')
  getAllMarkers(@GetUser() user: User) {
    return this.postService.getAllMarkers(user);
  }

  @Get('/posts/my')
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
}
