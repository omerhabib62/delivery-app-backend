import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { User } from './user.schema';
import { Roles } from '../../../common/decorators/roles.decorators';
import { UsersService } from './users.service';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: any): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  @UseGuards(RolesGuard)
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
