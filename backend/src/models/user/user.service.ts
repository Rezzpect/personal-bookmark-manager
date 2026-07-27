import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    console.log(`Finding user with ID: ${id}`);
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        id: data.email,
        email: data.email,
        name: data.name,
      },
    });
  }

  async findOrCreateFromOidc(id: string, email?: string | null, name?: string | null) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      return existingUser;
    }

    return this.prisma.user.create({
      data: {
        id,
        email: email ?? null,
        name: name ?? null,
      },
    });
  }
}
