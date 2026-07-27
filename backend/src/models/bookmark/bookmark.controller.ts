import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CreateBookmarkDto, UpdateBookmarkDto } from './bookmark.dto';
import { BookmarkService } from './bookmark.service';

@Controller('')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get('/bookmarks')
  list(@Query('collectionId') collectionId?: string, @Query('ownerId') ownerId?: string) {
    return this.bookmarkService.findAll({ collectionId, ownerId });
  }

  @Get('/bookmarks/:id')
  getOne(@Param('id') id: string) {
    return this.bookmarkService.findOne(id);
  }

  @Get('/collections/:id/bookmarks')
  listFromCollection(@Param('id') id: string) {
    return this.bookmarkService.findByCollectionId(id);
  }

  @Post('/bookmarks')
  create(@Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarkService.create(createBookmarkDto);
  }

  @Put('/bookmarks/:id')
  updatePut(@Param('id') id: string, @Body() updateBookmarkDto: UpdateBookmarkDto) {
    return this.bookmarkService.update(id, updateBookmarkDto);
  }

  @Patch('/bookmarks/:id')
  updatePatch(@Param('id') id: string, @Body() updateBookmarkDto: UpdateBookmarkDto) {
    return this.bookmarkService.update(id, updateBookmarkDto);
  }

  @Delete('/bookmarks/:id')
  remove(@Param('id') id: string) {
    return this.bookmarkService.remove(id);
  }
}
