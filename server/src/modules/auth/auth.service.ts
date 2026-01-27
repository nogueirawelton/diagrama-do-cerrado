import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';

type Tokens = {
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async getTokens(userId: number, username: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username },
        { secret: process.env.JWT_AUTH_SECRET_KEY, expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { sub: userId, username },
        { secret: process.env.JWT_REFRESH_SECRET_KEY, expiresIn: '7d' },
      ),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await argon2.hash(refreshToken);

    await this.usersRepository.update(userId, {
      refreshToken: hashedToken,
    });
  }

  async register(registerDto: RegisterDto) {
    try {
      const hashedPassword = await argon2.hash(registerDto.password);

      const user = this.usersRepository.create({
        ...registerDto,
        password: hashedPassword,
      });

      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Usuário ou E-mail já cadastrados.');
      }

      console.log(error);
      throw error;
    }
  }

  async login(authDto: AuthDto): Promise<Tokens> {
    const user = await this.usersRepository.findOneBy({
      username: authDto.username,
    });

    if (!user) throw new UnauthorizedException('Usuário ou senha inválidos');

    const passwordMatches = await argon2.verify(
      user.password,
      authDto.password,
    );

    if (!passwordMatches)
      throw new UnauthorizedException('Usuário ou senha inválidos');

    const tokens = await this.getTokens(user.id, user.username);

    this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number) {
    await this.usersRepository.update(userId, {
      refreshToken: null,
    });
  }

  async refreshToken(userId: number, refreshToken?: string): Promise<Tokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Token ausente');
    }

    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Usuário ou token inválidos');
    }

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches)
      throw new UnauthorizedException('Usuário ou token inválidos');

    const tokens = await this.getTokens(user.id, user.username);

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }
}
