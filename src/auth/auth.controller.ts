import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() registerDto: RegisterAuthDto, @Req() req: Request){
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(@Body() loginDto: LoginAuthDto){
        return this.authService.login(loginDto);
    }
}
