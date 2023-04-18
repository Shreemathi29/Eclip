/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {
  authAndAuthZ,
  authenticateMethod,
} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {RoleActions, RoleSubjects} from '@/common/services/app-ability.service';
import {bind, BindingScope, inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {Context} from 'vm';
import {IRole, Role} from './role.model';

type thisModelType = IRole;
type findType = Parameters<typeof Role.find>[0];

@bind({scope: BindingScope.SINGLETON})
export class RoleCommonService extends RequestCtxAbs {
  constructor(@inject.context() protected ctx: Context) {
    super(ctx);
  }

  @authAndAuthZ('read', 'Role')
  async getRoles() {
    const roles = await Role.find({});

    return roles;
  }

  @authAndAuthZ('create', 'Role')
  async createRole(args: any) {
    const role = await Role.create(args);
    return role;
  }

  @authAndAuthZ('manage', 'Role')
  async getRolePermissionMeta(args: any) {
    return {
      subjects: RoleSubjects, //TODO append
      actions: RoleActions,
    };
  }

  @authenticateMethod
  async getMyRole(args: any) {
    return (await this.getAccessUser()).role;
  }

  // @authAndAuthZ('update', 'Role')
  // async addPermissions({
  //   role,
  //   permissions,
  // }: {
  //   role: string;
  //   permissions: IRole['permissions'];
  // }) {
  //   if (role.toLowerCase().trim() === 'admin')
  //     throw new HttpErrors.BadRequest('You cannot edit admin roles');

  //   console.log('permissions=>', permissions);
  //   const updatedRole = await Role.findOneAndUpdate(
  //     {name: role},
  //     {
  //       $addToSet: {permissions: {$each: permissions}},
  //     },
  //     {new: true},
  //   );

  //   return updatedRole;
  // }

  // @authAndAuthZ('update', 'Role')
  // async removePermissions({
  //   role,
  //   permissions,
  // }: {
  //   role: string;
  //   permissions: IRole['permissions'];
  // }) {
  //   if (role.toLowerCase().trim() === 'admin')
  //     throw new HttpErrors.BadRequest('You cannot edit admin roles');

  //   const updatedRole = await Role.findOneAndUpdate(
  //     {name: role},
  //     {
  //       $pull: {permissions: {$in: permissions}},
  //     },
  //     {new: true},
  //   );
  //   return updatedRole;
  // }

  @authAndAuthZ('update', 'Role')
  async updatePermissions({
    role,
    permissions,
  }: {
    role: string;
    permissions: IRole['permissions'];
  }) {
    if (role.toLowerCase().trim() === 'admin')
      throw new HttpErrors.BadRequest('You cannot edit admin roles');

    const updatedRole = await Role.findOneAndUpdate(
      {name: role},
      {
        permissions,
      },
      {new: true},
    );
    return updatedRole;
  }
}
