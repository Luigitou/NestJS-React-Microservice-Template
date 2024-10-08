import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @MessagePattern({ cmd: 'hello-auth' })
  helloAuth(data: any): string {
    console.log(data);
    return this.authService.getHello();
  }
}
