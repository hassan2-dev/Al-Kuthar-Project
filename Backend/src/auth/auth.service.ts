import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { JwtPayload } from "./jwt.strategy";

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(username: string, password: string) {
    const existing = await this.users.findByUsername(username);
    if (existing) {
      throw new ConflictException("اسم المستخدم مستخدم مسبقاً");
    }
    const user = await this.users.create(username, password);
    return this.issueToken(user.id, user.username);
  }

  async login(username: string, password: string) {
    const user = await this.users.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException("اسم المستخدم خطأ");
    }
    const ok = await this.users.validatePassword(user.passwordHash, password);
    if (!ok) {
      throw new UnauthorizedException("كلمة المرور خطأ");
    }
    return this.issueToken(user.id, user.username);
  }

  private issueToken(userId: string, username: string) {
    const payload: JwtPayload = { sub: userId, username };
    return {
      access_token: this.jwt.sign(payload),
      token: this.jwt.sign(payload),
    };
  }
}
