import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { CommentModule } from './comments/comments.module';
import { BookroomModule } from './bookroom/bookroom.module';
import { LocationModule } from './location/location.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), AuthModule, PrismaModule, UserModule, CommentModule, BookroomModule, LocationModule, RoomModule],
})
export class AppModule { }
