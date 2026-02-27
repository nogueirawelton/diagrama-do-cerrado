import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  type UserPayload,
} from '../auth/decorators/current-user.decorator';
import { AtGuard } from '../auth/guards/at.guard';
import { ContributionService } from './contribution.service';
import { CreateContributionDto } from './dto/create-contribution.dto';

@Controller('contributions')
export class ContributionController {
  constructor(private contributionService: ContributionService) {}

  @UseGuards(AtGuard)
  @Post(':walletNumber')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: UserPayload,
    @Param('walletNumber') walletNumber: string,
    @Body() createContributionDto: CreateContributionDto,
  ) {
    const { sub } = user;

    return this.contributionService.create(
      sub,
      walletNumber,
      createContributionDto,
    );
  }
}
