import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('User Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'View current authenticated employee profile' })
  @ApiResponse({ status: 200, description: 'Profile details returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getOwnProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getOwnProfile(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update limited profile fields (phone, address, avatar) for current employee' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateOwnProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateOwnProfile(userId, dto);
  }
}
