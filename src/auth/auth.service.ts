import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginAuthDto, RegisterAuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterAuthDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const dataImport = await this.prismaService.user.create({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          password: hashedPassword,
          gender: registerDto.gender,
          phone: registerDto.phone,
          birthday: new Date(registerDto.birthday),
          role: 'Customer',
        },
        select: {
          id: true,
          email: true,
          password: true,
          gender: true,
        },
      });
      return dataImport;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email is already registered!');
      }
    }
  }

  async login(loginDto: LoginAuthDto) {
    const user = await this.prismaService.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found!');
    }

    const passwordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatched) {
      throw new ForbiddenException('Incorrect password');
    }

    return await this.signJwtToken(user.id, user.email);
  }

  async signJwtToken(userId: number, email: string) {
    const payload = { sub: userId, email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '60m',
      secret: this.configService.get('JWT_SECRET'),
    });
    return { accessToken };
  }
}
