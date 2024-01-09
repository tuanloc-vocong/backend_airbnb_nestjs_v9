import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [JwtModule.register({})]
})
export class AuthModule {}
