import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/libs/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello User !';
  }

  async findOneUser(data: { email: string }): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
  }
}
