import { UserPayload } from "../types/index";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config";

export class Tokens {
  static generateRefreshToken(user: UserPayload, expiresIn: string = "7d") {
    const refreshToken = jwt.sign(user, env.REFRESH_JWT_KEY as string, { expiresIn } as SignOptions);
    return { refreshToken };
  }

  static generateAccessToken(user: UserPayload, expiresIn: string = "1m") {
    const accessToken = jwt.sign(user, env.ACCESS_JWT_KEY as string, { expiresIn } as SignOptions);
    return { accessToken };
  }

  static generateTemp2FAToken(user: UserPayload, expiresIn: string = "1m") {
    const temp2FAToken = jwt.sign(
      { ...user, is2FAEnabled: true, is2FAVerified: false },
      env.TEMP_2FA_JWT_KEY as string,
      { expiresIn } as SignOptions
    );
    return { temp2FAToken };
  }

  static generateResetToken(email: string, expiresIn: string = "5m") {
    const resetToken = jwt.sign({ email }, env.RESET_JWT_KEY as string, { expiresIn } as SignOptions);
    return { resetToken };
  }
}
