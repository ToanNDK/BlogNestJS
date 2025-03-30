import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService){}

    //post
    @Post('register')
    register(@Body() RegisterUserDto:RegisterUserDto):Promise<User>{
        console.log('register api');
        console.log(RegisterUserDto);
        return this.authService.register(RegisterUserDto);
    }
   
    @Post('login')
    @ApiResponse({status:201 , description:'Login successfully'})
    @ApiResponse({status:401, description:'Login failed'})
    @UsePipes(ValidationPipe)
    login(@Body() LoginUserDto:LoginUserDto):Promise<any>{
        console.log('login api');
        console.log(LoginUserDto);

        return this.authService.login(LoginUserDto);
    }
    
    @Post('refresh-token')
    refreshToken(@Body() {refresh_token}):Promise<any>{
        console.log('refresh_token api');
        return this.authService.refreshToken(refresh_token);
    }
}
