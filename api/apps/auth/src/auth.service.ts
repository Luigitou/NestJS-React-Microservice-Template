import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/libs/prisma/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello auth!';
  }

  async register(data: { email: string; name: string; password: string }) {
    // 1st step: Check if the username already exists
    const user = await firstValueFrom(
      this.userService.send(
        { cmd: 'find-one-user' },
        {
          email: data.email,
        },
      ),
    );

    if (user !== null) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: 'user already exists',
      });
    }

    // 2nd step: Hash the password
    const hash = await bcrypt.hash(data.password, 10);

    // 3rd step: Create a new user
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: hash,
      },
    });

    // 4th step: Send the JWT token
  }

  async authenticate(data: { username: string; password: string }): Promise<{
    accessToken: string;
    username: string;
    userId: string;
  }> {
    return {
      accessToken: 'fake_token',
      username: data.username,
      userId: 'fake_user_id',
    };
  }
}
