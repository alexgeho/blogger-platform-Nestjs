import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  async comparePasswords(args: {
    password: string;
    hash: string;
  }): Promise<boolean> {
    return bcrypt.compare(args.password, args.hash);
  }
}
