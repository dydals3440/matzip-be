import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
@UseGuards(AuthGuard())
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  // 1. 즐겨찾기 추가
  @Post('/:id')
  toggleFavorite(@Param('id', ParseIntPipe) id: number) {
    return this.favoriteService.toggleFavorite(id, user);
  }
}
