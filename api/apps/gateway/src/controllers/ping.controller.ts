import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject } from '@nestjs/common';
import { GatewayService } from '../gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { LoggerService } from '@app/libs/logger/logger.service';
import { Observable } from 'rxjs';

@Controller()
@ApiTags('Ping')
export class PingController {
  constructor(
    private readonly gatewayService: GatewayService,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.log('Hello World from the logs!');
    return this.gatewayService.getHello();
  }

  @Get('auth')
  getAuth(): Observable<string> {
    return this.authService.send({ cmd: 'hello-auth' }, '');
  }

  @Get('user')
  getUser(): Observable<string> {
    return this.userService.send({ cmd: 'hello-user' }, '');
  }

  @Get('call/user')
  callUser(): Observable<string> {
    return this.authService.send({ cmd: 'call-user' }, '');
  }
}
