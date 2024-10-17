import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PrismaService } from '@app/libs/prisma/prisma.service';
import { LoggerService } from '@app/libs/logger/logger.service';
import { LoggerInterceptor } from '@app/libs/logger/logger.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { microservicesConfig } from '@app/libs/config/microservices/microservices.config';
import { ClientsModule } from '@nestjs/microservices';
import { PingController } from './controllers/ping.controller';
import { AuthenticationController } from './controllers/authentication.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(5000),
      }),
      envFilePath: ['.env.local', '.env'],
    }),
    ClientsModule.register(microservicesConfig),
  ],
  controllers: [AuthenticationController, PingController],
  providers: [
    GatewayService,
    PrismaService,
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
  exports: [PrismaService, LoggerService],
})
export class GatewayModule {}
