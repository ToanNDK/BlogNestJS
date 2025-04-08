import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
    Get,
    Req,
    UseGuards,
    Res
  } from '@nestjs/common';
  import { RegisterUserDto } from './dto/register-user.dto';
  import { AuthService } from './auth.service';
  import { User } from 'src/user/entities/user.entity';
  import { LoginUserDto } from './dto/login-user.dto';
  import { ApiResponse, ApiTags } from '@nestjs/swagger';
  import { Public } from './decorator/public.decorator';
  import { AuthGuard } from '@nestjs/passport';
  
  
  import { Request, Response } from 'express';
  
  @ApiTags('Auth')
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('register')
    @Public()
    register(@Body() RegisterUserDto: RegisterUserDto): Promise<User> {
      return this.authService.register(RegisterUserDto);
    }
  
    @Post('login')
    @Public()
    @ApiResponse({ status: 201, description: 'Login successfully' })
    @ApiResponse({ status: 401, description: 'Login failed' })
    @UsePipes(ValidationPipe)
    login(@Body() LoginUserDto: LoginUserDto): Promise<any> {
      return this.authService.login(LoginUserDto);
    }
  
    @Post('refresh-token')
    @Public()
    refreshToken(@Body() { refresh_token }): Promise<any> {
      return this.authService.refreshToken(refresh_token);
    }
  
    // ===== GOOGLE LOGIN =====
    @Get('google')
    @Public()
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
      // Redirect sẽ được handle bởi Passport
    }
  
    @Get('google/redirect')
    @Public()
    @UseGuards(AuthGuard('google'))
    async googleRedirect(@Req() req: Request, @Res() res: Response) {
      const result = await this.authService.socialLogin((req as any).user);
      return (res as Response).redirect(`http://localhost:3000/oauth-success?token=${result.access_token}`);
    }
  
    // ===== GITHUB LOGIN =====
    @Get('github')
    @Public()
    @UseGuards(AuthGuard('github'))
    async githubAuth() {
      // Redirect sẽ được handle bởi Passport
    }
  
    @Get('github/redirect')
    @Public()
    @UseGuards(AuthGuard('github'))
    async githubRedirect(@Req() req: Request, @Res() res: Response) {
      const result = await this.authService.socialLogin((req as any).user);
      return (res as Response).redirect(`http://localhost:3000/oauth-success?token=${result.access_token}`);
    }
  }
  