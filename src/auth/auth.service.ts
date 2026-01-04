import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { LoggedInUser } from 'src/users/dto/logged-in-user';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string, role: Role = 'buyer') {
    const exists = await this.users.findByEmail(email);
    if (exists) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(password, 10);

    const user = await this.users.create({
      email,
      password: hashed,
      role,
    });

    return this.generateToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }

  private generateToken(user: User): LoggedInUser {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwt.sign(payload),
      ...user
    };
  }
}
