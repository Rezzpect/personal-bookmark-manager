import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CreateCollectionDto, UpdateCollectionDto } from './collection.dto';
import { CollectionService } from './collection.service';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  list(@Query('name') name?: string, @Query('ownerId') ownerId?: string) {
    return this.collectionService.findAll({ name, ownerId });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.collectionService.findOne(id);
  }

  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.create(createCollectionDto);
  }

  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateCollectionDto: UpdateCollectionDto) {
    return this.collectionService.update(id, updateCollectionDto);
  }

  @Patch(':id')
  updatePatch(@Param('id') id: string, @Body() updateCollectionDto: UpdateCollectionDto) {
    return this.collectionService.update(id, updateCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectionService.remove(id);
  }
}
