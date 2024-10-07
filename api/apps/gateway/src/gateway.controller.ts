import { Controller, Get, Inject } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy) {
  }

  @Get()
  getHello(): string {
    return this.gatewayService.getHello();
  }

  @Get('auth')
  getAuth(): Observable<string> {
    return this.authService.send({ cmd: 'hello-auth' }, '');
  }
}
