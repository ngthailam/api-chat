import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from './dto/jwt-payload.js';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/entities/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private usersRepo: Repository<UserEntity>,
  ) {}

  async register(email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.usersRepo.create({ email, passwordHash });
    await this.usersRepo.save(user);

    return this.issueTokens(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException();
    }

    return this.issueTokens(user);
  }

  async refreshToken(userId: string) {
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException();

    return this.issueTokens(user);
  }

  private issueTokens(user: UserEntity) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1d', // TODO: revert to 15m
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
