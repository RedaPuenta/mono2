import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UpsEntity } from '../ups/entities/ups.entity';
import { UpsService } from '../ups/ups.service';
import { ControlUsersService } from './control-users.service';
import { ControlUserEntity } from './entities/control-user.entity';
import { UpdatePasswordResponseDto } from './dto/update-password.response';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FrontGuard, LoginGuard } from '@lib/guards';
import { User } from '@lib/decorators';

@UseGuards(FrontGuard, LoginGuard)
@Resolver(() => ControlUserEntity)
export class ControlUsersResolver {
  constructor(
    private service: ControlUsersService,
    private upsService: UpsService,
  ) {}

  // -------------------------
  // Get control user's informations
  // -------------------------
  @Query((returns) => ControlUserEntity)
  async me(@User() user: any): Promise<any> {
    const { userId } = user;
    const { controlUser } = await this.service.read(userId);
    return controlUser;
  }

  // -------------------------
  // Get UPS list linked to the connected user
  // -------------------------
  @ResolveField()
  async ups(
    // @User() user,
    @Parent() user: ControlUserEntity,
  ): Promise<[UpsEntity]> {
    const { ups: upsIds } = user;
    const { list, paging } = await this.upsService.search({
      limit: 300,
      page: 1,
      upsIds,
    });
    return list;
  }

  // -------------------------
  // Update password
  // -------------------------
  @Mutation((returns) => UpdatePasswordResponseDto)
  async updatePassword(
    @User() user: any,
    @Args('input') params: UpdatePasswordDto,
  ): Promise<UpdatePasswordResponseDto> {
    const { userId } = user;
    const { currentPassword, newPassword } = params;

    const { success } = await this.service.updatePassword({
      userId,
      currentPassword,
      newPassword,
    });

    return { success };
  }
}
