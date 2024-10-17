import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule } from '@nestjs/microservices';
import { microservicesConfig } from '@app/libs/config/microservices/microservices.config';
import { PrismaService } from '@app/libs/prisma/prisma.service';

@Module({
  imports: [ClientsModule.register(microservicesConfig)],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [PrismaService],
})
export class AuthModule {}
