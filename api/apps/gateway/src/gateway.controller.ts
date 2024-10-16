import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Role } from '@prisma/client';
import { LoggerService } from '@app/libs/logger/logger.service';

@Controller()
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
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

  @Post('role')
  async createRole(
    @Body() body: { name: string; description: string },
  ): Promise<Role> {
    return this.gatewayService.createRole(body.name, body.description);
  }

  @Get('role')
  async getRoles(): Promise<any> {
    return this.gatewayService.getAllRoles();
  }
}
