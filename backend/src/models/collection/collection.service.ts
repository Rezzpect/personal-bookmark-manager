import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCollectionDto, UpdateCollectionDto } from './collection.dto';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { name?: string; ownerId?: string }) {
    return this.prisma.collection.findMany({
      where: {
        ...(filters?.ownerId ? { ownerId: filters.ownerId } : {}),
        ...(filters?.name ? { name: { contains: filters.name } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: { bookmarks: true },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    return collection;
  }

  async create(data: CreateCollectionDto) {
    return this.prisma.collection.create({ data });
  }

  async update(id: string, data: UpdateCollectionDto) {
    const existing = await this.prisma.collection.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Collection not found');
    }

    return this.prisma.collection.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.collection.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Collection not found');
    }

    return this.prisma.collection.delete({ where: { id } });
  }
}
