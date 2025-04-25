import { VAULTS_ALL_ROLES_MAP } from 'modules/vaults';

export const permissions = VAULTS_ALL_ROLES_MAP;

export const permissionsKeys = Object.keys(permissions) as PERMISSION[];
export type EntirePermissionsType = typeof permissions;
export type PERMISSION = keyof EntirePermissionsType;
