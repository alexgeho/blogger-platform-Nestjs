import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'access-token-secret',
    });
  }

  /**
   * Эта функция вызывается автоматически, когда токен успешно проверен.
   * В payload приходит то, что ты положил при создании токена (id, login и т.п.)
   * Здесь мы возвращаем объект, который затем попадает в req.user
   *
   * @param payload - данные из JWT (например, { id: string })
   */
  async validate(payload: any) {
    // возвращаем объект в том виде, в каком хотим видеть req.user
    return { userId: payload.id };
  }
}
