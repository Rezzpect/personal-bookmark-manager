import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CreateBookmarkDto, UpdateBookmarkDto } from './bookmark.dto';
import { BookmarkService } from './bookmark.service';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  list(@Query('collectionId') collectionId?: string, @Query('ownerId') ownerId?: string) {
    return this.bookmarkService.findAll({ collectionId, ownerId });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.bookmarkService.findOne(id);
  }

  @Post()
  create(@Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarkService.create(createBookmarkDto);
  }

  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateBookmarkDto: UpdateBookmarkDto) {
    return this.bookmarkService.update(id, updateBookmarkDto);
  }

  @Patch(':id')
  updatePatch(@Param('id') id: string, @Body() updateBookmarkDto: UpdateBookmarkDto) {
    return this.bookmarkService.update(id, updateBookmarkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookmarkService.remove(id);
  }
}
