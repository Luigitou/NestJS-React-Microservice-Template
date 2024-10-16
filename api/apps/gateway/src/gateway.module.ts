import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from '@app/libs/prisma/prisma.service';
import { LoggerService } from '@app/libs/logger/logger.service';
import { LoggerInterceptor } from '@app/libs/logger/logger.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(5000),
      }),
      envFilePath: ['.env.local', '.env'],
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'auth',
          port: 5001,
        },
      },
    ]),
  ],
  controllers: [GatewayController],
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
