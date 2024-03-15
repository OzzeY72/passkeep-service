import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports:[
    ConfigModule.forRoot(),
  ],
  providers: [PasswordService],
  controllers: [PasswordController]
})
export class PasswordModule {}
