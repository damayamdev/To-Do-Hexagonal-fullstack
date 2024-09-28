import jwt from 'jsonwebtoken';

export class JWTAdapter {
  constructor(private secretKey: string) {}

  sign(payload: object, expiresIn: string): string {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  verify(token: string): any {
    return jwt.verify(token, this.secretKey);
  }
}