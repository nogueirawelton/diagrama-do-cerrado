import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssetDto } from '../dto/create-asset.dto';
import { UpdateAssetDto } from '../dto/update-asset.dto';
import { Asset } from '../entities/asset.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
  ) {}

  async create(createWalletDto: CreateAssetDto) {
    try {
      const asset = this.assetRepository.create(createWalletDto);

      return await this.assetRepository.save(asset);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Asset já cadastrado.');
      }

      console.log(error);
      throw error;
    }
  }

  findByTicker(ticker: string) {
    return this.assetRepository.findOneBy({
      ticker,
    });
  }

  async update(assetId: number, updateAssetDto: UpdateAssetDto) {
    await this.assetRepository.update(assetId, updateAssetDto);
  }
}
