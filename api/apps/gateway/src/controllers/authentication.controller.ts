import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GatewayService } from '../gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { LoggerService } from '@app/libs/logger/logger.service';
import { Observable } from 'rxjs';

@Controller()
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(
    private readonly gatewayService: GatewayService,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    private readonly logger: LoggerService,
  ) {}

  @Post('auth/register')
  async register(
    @Body() data: { email: string; name: string; password: string },
  ): Promise<Observable<any>> {
    return this.authService.send({ cmd: 'register' }, data);
  }

  @Post('auth/login')
  async getAuthToken(
    @Body() data: { username: string; password: string },
  ): Promise<
    Observable<{
      accessToken: string;
      username: string;
      userId: string;
    }>
  > {
    return this.authService.send(
      { cmd: 'login' },
      { username: data.username, password: data.password },
    );
  }
}
