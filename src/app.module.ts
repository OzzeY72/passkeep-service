import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PasswordModule } from './password/password.module';

@Module({
  imports: [UsersModule, PasswordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
