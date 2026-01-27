import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CurrentUser,
  type UserPayload,
} from '../auth/decorators/current-user.decorator';
import { AtGuard } from '../auth/guards/at.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AtGuard)
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  findMe(@CurrentUser() user: UserPayload) {
    const { sub } = user;

    return this.usersService.findOne(sub);
  }
}
