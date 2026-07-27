import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { collectionId?: string; ownerId?: string }) {
    return this.prisma.bookmark.findMany({
      where: {
        ...(filters?.ownerId ? { ownerId: filters.ownerId } : {}),
        ...(filters?.collectionId ? { collectionId: filters.collectionId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCollectionId(collectionId: string) {
    return this.prisma.bookmark.findMany({
      where: { collectionId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const bookmark = await this.prisma.bookmark.findUnique({ where: { id } });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    return bookmark;
  }

  async create(data: CreateBookmarkDto) {
    return this.prisma.bookmark.create({ data });
  }

  async update(id: string, data: UpdateBookmarkDto) {
    const existing = await this.prisma.bookmark.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Bookmark not found');
    }

    return this.prisma.bookmark.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.bookmark.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Bookmark not found');
    }

    return this.prisma.bookmark.delete({ where: { id } });
  }
}
