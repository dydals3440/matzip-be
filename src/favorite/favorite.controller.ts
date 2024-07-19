import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavoriteService } from './favorite.service';
import { User } from '../auth/user.entity';
import { GetUser } from '../@common/@decorators/get-user.decorator';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('favorites')
@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  // 1. 즐겨찾기 추가
  @ApiOperation({ summary: '즐겨찾기 추가.', description: '#즐겨찾기 추가' })
  @Post('/:id')
  toggleFavorite(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.favoriteService.toggleFavorite(id, user);
  }

  // 2. 즐겨찾기 게시글만 불러옴.
  @ApiOperation({
    summary: '즐겨찾기 추가한 게시글 모아보기.',
    description: '#즐겨찾기 추가 게시글 모아보기',
  })
  @Get('/my')
  async getMyFavoritePosts(@Query('page') page: number, @GetUser() user: User) {
    return this.favoriteService.getMyFavoritePosts(page, user);
  }
}
