import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';
import { WalletPosition } from '../entities/wallet-position.entity';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(WalletPosition)
    private walletPositionRepository: Repository<WalletPosition>,
  ) {}

  findByWalletAndAsset(walletId: number, assetId: number) {
    return this.walletPositionRepository.findOneBy({
      wallet: { id: walletId },
      asset: { id: assetId },
    });
  }

  async create(createPositionDto: CreatePositionDto) {
    try {
      const position = this.walletPositionRepository.create(createPositionDto);

      return await this.walletPositionRepository.save(position);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Wallet já cadastrada com este número.');
      }

      console.log(error);
      throw error;
    }
  }

  async update(positionId: number, updatePositionDto: UpdatePositionDto) {
    await this.walletPositionRepository.update(positionId, updatePositionDto);
  }
}
