import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/shared/types/role';
import { ROLES_KEY } from 'src/shared/constants';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
