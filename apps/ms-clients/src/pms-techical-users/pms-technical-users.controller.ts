import { Subscribe } from '@lib/decorators';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { appConfig } from '../common/config/config';
import { DeleteDto } from '../common/types/generic.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { SearchUserDto } from './dto/search-cameras.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PmsTechnicalUsersService } from './pms-technical-users.service';
import { PmsTechnicalUser } from './schemas/pms-technical-user.schema';

@Controller('pms-technical-users')
export class PmsTechnicalUsersController {
  constructor(private readonly service: PmsTechnicalUsersService) {}

  @Subscribe(appConfig(), `pms:technical-users:create`)
  async create(
    @Payload() createParams: CreateUserDto,
  ): Promise<{ user: PmsTechnicalUser }> {
    const userCreate = await this.service.createFromScratch(createParams);
    const userRender = await this.service.render<PmsTechnicalUser>(userCreate);
    return { user: userRender };
  }

  @Subscribe(appConfig(), `pms:technical-users:exists`)
  async exists(
    @Payload() existsParams: any,
  ): Promise<{ user?: any; found: boolean }> {
    try {
      const user = await this.service.read<PmsTechnicalUser>(existsParams);

      return { user, found: true };
    } catch (err) {
      return { found: false };
    }
  }

  @Subscribe(appConfig(), `pms:technical-users:search`)
  async search(
    @Payload() searchParams: SearchUserDto,
  ): Promise<{ list: any; paging: any }> {
    const { page, limit, order = '-createdAt', ...searchData } = searchParams;
    const { list, paging } = await this.service.paging(searchData, {
      page,
      limit,
      order,
    });
    const formattedList = await this.service.render<PmsTechnicalUser[]>(list);
    return { list: formattedList, paging };
  }

  @Subscribe(appConfig(), `pms:technical-users:read`)
  async read(
    @Payload() readParams: ReadUserDto,
  ): Promise<{ technicalUser: any }> {
    const technicalUserRead = await this.service.read(readParams);

    return { technicalUser: technicalUserRead };
  }

  @Subscribe(appConfig(), `pms:technical-users:update`)
  async update(
    @Payload() updateParams: UpdateUserDto,
  ): Promise<{ technicalUser: any }> {
    const { userId, ...updateData } = updateParams;
    const technicalUser = await this.service.update(userId, updateData);
    return { technicalUser };
  }

  @Subscribe(appConfig(), `pms:technical-users:delete`)
  async delete(@Payload() { id }: DeleteDto): Promise<boolean> {
    await this.service.remove(id);
    return true;
  }
}
