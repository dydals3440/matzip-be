import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname, basename } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { numbers } from 'src/@common/constants';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('create uploads folder');
  fs.mkdirSync('uploads');
}

@Controller('image')
@ApiTags('image')
@UseGuards(AuthGuard())
export class ImageController {
  @UseInterceptors(
    FilesInterceptor('images', numbers.MAX_IMAGE_COUNT, {
      storage: diskStorage({
        destination(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename(req, file, cb) {
          const ext = extname(file.originalname);
          cb(null, basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
      limits: { fileSize: numbers.MAX_IMAGE_SIZE },
    }),
  )
  @Post('/')
  @ApiOperation({
    summary: '이미지 Presigned URL 반환 API.',
    description: '#Presigned Image Url API',
  })
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    console.log(files);
    const uris = files.map((file) => file.filename);
    console.log('야호123', uris);
    return uris;
  }
}
