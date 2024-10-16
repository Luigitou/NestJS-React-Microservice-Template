import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule } from '@nestjs/microservices';
import { microservicesConfig } from '@app/libs/config/microservices/microservices.config';

@Module({
  imports: [ClientsModule.register(microservicesConfig)],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
