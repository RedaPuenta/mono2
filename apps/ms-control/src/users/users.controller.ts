import { Subscribe } from '@lib/decorators';
import { Controller } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { appConfig } from '../common/config/config';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateControlUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ControlUser } from './schemas/control-user.schema';
import { SearchControlUserDto } from './dto/search-cameras.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Subscribe(appConfig(), `users:create`)
  async create(
    @Payload() createParams: CreateUserDto,
  ): Promise<{ user: ControlUser }> {
    try {
      const userCreate = await this.service.createFromScratch(createParams);
      const userRender = await this.service.render<ControlUser>(userCreate);

      return { user: userRender };
    } catch (err: any) {
      throw new RpcException({
        code: 'MCRTL_3',
        message: err.message,
      });
    }
  }

  @Subscribe(appConfig(), `users:exists`)
  async exists(
    @Payload() existsParams: any,
  ): Promise<{ user?: any; found: boolean }> {
    try {
      const user = await this.service.read<ControlUser>(existsParams);

      return { user, found: true };
    } catch (err) {
      return { found: false };
    }
  }

  @Subscribe(appConfig(), `users:search`)
  async search(
    @Payload() searchParams: SearchControlUserDto,
  ): Promise<{ list: any; paging: any }> {
    const { page, limit, order = '-createdAt', ...searchData } = searchParams;
    const { list, paging } = await this.service.paging(searchData, {
      page,
      limit,
      order,
    });
    const formattedList = await this.service.render<ControlUser[]>(list);
    return { list: formattedList, paging };
  }

  @Subscribe(appConfig(), `users:read`)
  async read(
    @Payload() readParams: ReadUserDto,
  ): Promise<{ controlUser: any }> {
    const controlUserRead = await this.service.read(readParams);
    return { controlUser: controlUserRead };
  }

  @Subscribe(appConfig(), `users:update`)
  async update(
    @Payload() updateParams: UpdateControlUserDto,
  ): Promise<{ controlUser: any }> {
    const { userId, ...updateData } = updateParams;
    const controlUser = await this.service.update(userId, updateData);
    return { controlUser };
  }

  @Subscribe(appConfig(), `users:delete`)
  async delete(
    @Payload() { id }: DeleteUserDto,
  ): Promise<{ controlUser: any }> {
    const controlUser = await this.service.delete({ _id: id });
    return { controlUser };
  }
}
