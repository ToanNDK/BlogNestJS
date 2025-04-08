import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

// 👉 THÊM VÀO: Các import cần cho Passport, Google & GitHub strategy
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: '123456',
      signOptions: { expiresIn: '1d' }
    }),
    ConfigModule,

    // 👉 THÊM VÀO
    PassportModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,

    // 👉 THÊM VÀO
    GoogleStrategy,
    GithubStrategy
  ]
})
export class AuthModule {}
