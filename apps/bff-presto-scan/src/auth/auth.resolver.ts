import { HttpException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import {
  ResetPasswordDto,
  ResetPasswordResponseDto,
} from './dto/reset-password.dto';

@Resolver()
// @UseGuards(TokenGuard)
export class AuthResolver {
  constructor(private service: AuthService) {}

  // -------------------------
  // Operator user login
  // -------------------------
  @Mutation((returns) => LoginResponseDto)
  async login(@Args() loginParams: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginParams;

    try {
      const {
        auth: { token, validationSteps = [] },
        user,
      } = await this.service.login({
        username,
        password,
      });

      const mustChangePassword = validationSteps.includes(
        'PASSWORD_CHANGE_REQUESTED',
      );

      return {
        auth: {
          status: mustChangePassword ? 'PASSWORD_CHANGE_REQUESTED' : token,
          token: mustChangePassword ? undefined : token,
          validationSteps,
        },
        user,
      };
    } catch (err) {
      console.error(err);
      throw new HttpException('Unknown credentials', 400);
    }
  }

  // -------------------------
  // -------------------------
  @Mutation((returns) => ResetPasswordResponseDto)
  async resetPassword(
    @Args() resetPasswordParams: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    const { username, currentPassword, newPassword } = resetPasswordParams;

    try {
      const { auth, user } = await this.service.resetPassword({
        username,
        currentPassword,
        newPassword,
      });

      return {
        auth,
        user,
      };
    } catch (err) {
      console.error(err);
      throw new HttpException('Unknown credentials', 400);
    }
  }
}
