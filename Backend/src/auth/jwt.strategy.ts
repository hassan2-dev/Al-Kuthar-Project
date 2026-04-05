import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";

export type JwtPayload = { sub: string; username: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly users: UsersService,
  ) {
    const secret = config.get<string>("JWT_SECRET");
    if (!secret) {
      throw new Error("JWT_SECRET is required");
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.users.findByUsername(payload.username);
    if (!user || user.id !== payload.sub) {
      throw new UnauthorizedException();
    }
    return { userId: user.id, username: user.username };
  }
}
