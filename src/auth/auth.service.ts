import {
    HttpException,
    HttpStatus,
    Injectable
  } from '@nestjs/common';
  import { RegisterUserDto } from './dto/register-user.dto';
  import { InjectRepository } from '@nestjs/typeorm';
  import { User } from 'src/user/entities/user.entity';
  import { Repository } from 'typeorm';
  import * as bcrypt from 'bcrypt';
  import { LoginUserDto } from './dto/login-user.dto';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectRepository(User) private userRepository: Repository<User>,
      private jwtService: JwtService,
      private configService: ConfigService
    ) {}
  
    async register(RegisterUserDto: RegisterUserDto): Promise<User> {
      const hashPassword = await this.hashPassword(RegisterUserDto.password);
      return await this.userRepository.save({
        ...RegisterUserDto,
        refresh_token: 'refresh_token_string',
        password: hashPassword,
      });
    }
  
    async login(LoginUserDto: LoginUserDto): Promise<any> {
      const user = await this.userRepository.findOne({
        where: { email: LoginUserDto.email },
      });
  
      await new Promise((resolve) => setTimeout(resolve, 2000));
  
      if (!user) {
        throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
      }
  
      const checkPass = bcrypt.compareSync(
        LoginUserDto.password,
        user.password
      );
      if (!checkPass) {
        throw new HttpException(
          'Password is not correct',
          HttpStatus.UNAUTHORIZED
        );
      }
  
      const payload = { id: user.id, email: user.email };
      return this.generateToken(payload);
    }
  
    async refreshToken(refresh_token: string): Promise<any> {
      try {
        const verify = await this.jwtService.verifyAsync(refresh_token, {
          secret: this.configService.get<string>('SECRET'),
        });
  
        const checkExistToken = await this.userRepository.findOneBy({
          email: verify.email,
          refresh_token,
        });
  
        if (checkExistToken) {
          return this.generateToken({ id: verify.id, email: verify.email });
        } else {
          throw new HttpException(
            'Refresh token is not valid',
            HttpStatus.BAD_REQUEST
          );
        }
      } catch (error) {
        throw new HttpException(
          'Refresh token is not valid',
          HttpStatus.BAD_REQUEST
        );
      }
    }
  
    async socialLogin(profile: any): Promise<any> {
      const { email, name } = profile;
  
      let user = await this.userRepository.findOne({ where: { email } });
  
      // Nếu chưa có user thì tạo mới
      if (!user) {
        const newUser = new User();
        newUser.email = email;
        newUser.first_name = name?.split(' ')[0] || 'OAuth';
        newUser.last_name = name?.split(' ')[1] || '';
        newUser.password = ''; // không có mật khẩu
        newUser.status = 1;
        newUser.refresh_token = 'oauth_refresh_token';
  
        user = await this.userRepository.save(newUser);
      }
  
      const payload = { id: user.id, email: user.email };
      return this.generateToken(payload);
    }
  
    private async generateToken(payload: { id: number; email: string }) {
      const access_token = await this.jwtService.signAsync(payload);
      const refresh_token = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('SECRET'),
        expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
      });
  
      await this.userRepository.update(
        { email: payload.email },
        { refresh_token }
      );
  
      return { access_token, refresh_token };
    }
  
    private async hashPassword(password: string): Promise<string> {
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    }
  }
  