import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../wallets/entities/wallet.entity';
import { User } from './entities/user.entity';

export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOne(userId: number) {
    return this.usersRepository.findOne({
      where: { id: userId },
      relations: {
        lastOpenedWallet: true,
      },
    });
  }

  updateLastOpenedWallet(userId: number, wallet: Wallet) {
    return this.usersRepository.update(userId, { lastOpenedWallet: wallet });
  }
}
