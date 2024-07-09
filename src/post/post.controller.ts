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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller()
export class PostController {
  constructor(private postService: PostService) {}

  @Get('/markers')
  getAllMarkers() {
    return this.postService.getAllMarkers();
  }

  @Get('/posts')
  getPosts(@Query('page') page: number) {
    return this.postService.getPosts(page);
  }

  @Get('/posts/:id')
  // Pipe를 사용해서, Id가 string으로와도, parseInt형태로 바꿀 수 있음.
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }

  @Post('/posts')
  @UsePipes(ValidationPipe)
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Delete('/posts/:id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.deletePost(id);
  }

  @Patch('/posts/:id')
  @UsePipes(ValidationPipe)
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() // 수정할떄는 좌표를 수정하지 않음. 주소랑
    updatePostDto: Omit<CreatePostDto, 'longitude' | 'latitude' | 'address'>,
  ) {
    return this.postService.updatePost(id, updatePostDto);
  }
}
