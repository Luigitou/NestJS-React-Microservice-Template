import { Controller, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @MessagePattern({ cmd: 'hello-auth' })
  helloAuth(): string {
    return this.authService.getHello();
  }

  @MessagePattern({ cmd: 'call-user' })
  callUser(): Observable<string> {
    return this.userService.send({ cmd: 'hello-user' }, '');
  }
}
