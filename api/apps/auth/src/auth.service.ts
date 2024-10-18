import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/libs/prisma/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@app/libs/jwt/jwt.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Hello auth!';
  }

  /**
   * Create a new user if the user  doesn't exist
   * @param data
   */
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
        message: 'User already exists',
      });
    }

    // 2nd step: Hash the password
    const hash = await bcrypt.hash(data.password, 10);

    // 3rd step: Create a new user
    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: hash,
      },
    });

    // 4th step: Send the JWT token
    return {
      token: this.jwtService.generateToken(newUser),
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    };
  }

  /**
   * return a JWT token from the user
   */
  generateToken(user: User) {
    return this.jwtService.generateToken(user);
  }

  /**
   * Validates a user's credentials
   * @param data
   */
  async validateUser(data: { username: string; password: string }) {
    const user = await firstValueFrom(
      this.userService.send(
        { cmd: 'find-one-user' },
        {
          email: data.username,
        },
      ),
    );

    if (!user) {
      return null;
    }

    if (await bcrypt.compare(data.password, user.passwordHash)) {
      return user;
    } else {
      return null;
    }
  }
}
