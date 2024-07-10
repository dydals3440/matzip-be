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

@Controller('favorites')
@UseGuards(AuthGuard())
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  // 1. 즐겨찾기 추가
  @Post('/:id')
  toggleFavorite(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.favoriteService.toggleFavorite(id, user);
  }

  // 2. 즐겨찾기 게시글만 불러옴.
  @Get('/my')
  async getMyFavoritePosts(@Query('page') page: number, @GetUser() user: User) {
    return this.favoriteService.getMyFavoritePosts(page, user);
  }
}
