import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { Wallet } from '../entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async create(userId: number, createWalletDto: CreateWalletDto) {
    try {
      const wallet = this.walletRepository.create({
        ...createWalletDto,
        user: {
          id: userId,
        },
        targets: [
          {
            category: {
              id: 1,
            },
            targetPercentage: 50.0,
          },
          {
            category: {
              id: 5,
            },
            targetPercentage: 50.0,
          },
        ],
      });
      return await this.walletRepository.save(wallet);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Wallet já cadastrada com este número.');
      }

      console.log(error);
      throw error;
    }
  }

  findAll(userId: number) {
    return this.walletRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async findByWalletNumber(userId: number, walletNumber: string) {
    const wallet = await this.walletRepository.findOne({
      where: {
        user: { id: userId },
        walletNumber: walletNumber,
      },

      relations: {
        targets: {
          category: true,
        },
        positions: {
          asset: {
            category: true,
          },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada.');
    }

    return wallet;
  }

  async updateLastSyncDate(walletId: number) {
    this.walletRepository.update(walletId, {
      lastExternalSyncAt: new Date(),
    });

    const wallet = await this.walletRepository.findOne({
      where: {
        id: walletId,
      },

      relations: {
        targets: {
          category: true,
        },
        positions: {
          asset: {
            category: true,
          },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada.');
    }

    return wallet;
  }
}
