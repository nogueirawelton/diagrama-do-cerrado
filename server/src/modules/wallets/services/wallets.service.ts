import {
  BadRequestException,
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
    const totalPercentage = createWalletDto.targets.reduce(
      (acc, target) => acc + target.percentage,
      0,
    );

    if (totalPercentage !== 100) {
      throw new BadRequestException('Total de porcentagem deve ser 100.');
    }

    try {
      const wallet = this.walletRepository.create({
        ...createWalletDto,
        user: {
          id: userId,
        },
        targets: createWalletDto.targets.map((target) => ({
          category: {
            id: target.id,
          },
          targetPercentage: target.percentage,
        })),
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
