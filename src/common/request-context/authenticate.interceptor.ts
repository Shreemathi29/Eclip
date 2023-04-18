/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {MonarchaClient} from '@/clients/rest/monarcha.client';
import {log, pretty} from '@/utils';
import {getServiceName} from '@/utils/loopbackUtils';
import {HttpErrors, Request} from '@loopback/rest';
import {RoleActions, RoleSubjects} from '../services/app-ability.service';
import {CommonBindings, DECODED_JWT_AND_USER} from './common-bindings';
import {DecodedJWTAndUser} from './decode-jwt.provider';
import {RequestCtxAbs} from './request-ctx-abs';

export function authenticateMethod(
  target: any,
  propertyName: any,
  descriptor: any,
) {
  const method = descriptor.value;
  descriptor.value = async function (...args: any) {
    const fullDecoded = await this.ctx.get(DECODED_JWT_AND_USER);
    // console.log(fullDecoded);
    const ret = await method.apply(this, args);
    return ret;
  };
}

export function authAndAuthZ(
  action: typeof RoleActions[number],
  subject: typeof RoleSubjects[number],
  canOrCannot: 'can' | 'cannot' | undefined = 'can',
) {
  return function (target: any, propertyName: any, descriptor: any) {
    const method = descriptor.value;
    descriptor.value = async function (...args: any) {
      // -------------------------------------------

      if (!this.ctx?.get) {
        const msg = `authAndAuthZ , the class does not have a loopback context==> at ${
          (this as any)?.constructor?.name
        }, propertyName: ${propertyName}. \n args: ${pretty(args)}`;
        log.error(msg);
        throw new HttpErrors.InternalServerError(msg);
      }
      // ---------------------------------------------------------
      const fullDecoded = (await this.ctx.get(
        DECODED_JWT_AND_USER,
      )) as DecodedJWTAndUser;

      // ---------------------------------------
      const ability = fullDecoded.ability;
      const isValidAction =
        canOrCannot === 'can'
          ? ability?.can(action, subject)
          : ability?.cannot(action, subject);

      if (!isValidAction) {
        const msg = `Unauthorized. User cannot perform action ${action} on ${subject}.`;
        log.warn(
          `Unauthorized. User cannot perform action ${action} on ${subject}. at ${
            (this as any)?.constructor?.name
          },canOrCannot: ${canOrCannot}, propertyName: ${propertyName}. \n args: ${pretty(
            args,
          )}`,
        );
        // *---------------------------------------------
        throw new HttpErrors.Unauthorized(msg);
      }

      // ----------------------------debug------------------------
      const debugMsg = `Authorization success.  action: ${action}, subject: ${subject}. userEmail:${
        fullDecoded.user?.email
      } , role: ${fullDecoded.role?.name}, class:${
        (this as any)?.constructor?.name
      }, propertyName: ${propertyName}.}`;

      console.log(debugMsg);
      // ---------------------------------------------------------

      const ret = await method.apply(this, args);
      return ret;
    };
  };
}

export function clientAuth(target: any, propertyName: any, descriptor: any) {
  const method = descriptor.value;
  descriptor.value = async function (...args: any) {
    const ctx: RequestCtxAbs['ctx'] = (this as any).ctx;
    const request = ctx.getSync(CommonBindings.REQUEST) as Request;
    const {client_id, access_token} = request?.body || {};
    const monarchaClient = ctx.getSync(
      getServiceName(MonarchaClient),
    ) as MonarchaClient;
    try {
      const resp = await monarchaClient.verifyIdentity({
        access_token,
        client_id,
      });
      log.warn(
        `Success => client Auth at ${
          (this as any)?.constructor?.name
        }propertyName: ${propertyName}.`,
      );
    } catch (err) {
      log.warn(
        `Unauthorized. at ${
          (this as any)?.constructor?.name
        }propertyName: ${propertyName}. \n args: ${pretty(args)}`,
      );
      // *---------------------------------------------
      throw new HttpErrors.Unauthorized(`Unauthorized`);
    }
    const ret = await method.apply(this, args);
    return ret;
  };
}

// export function personaFilter(target: any, propertyName: any, descriptor: any) {
//   const method = descriptor.value;
//   descriptor.value = async function (...args: any) {
//     const ret = await method.apply(this, args);
//     const keyvals = ret.keyvals;
//     const role = await Role.findOne({name: 'Customer'});

//     return ret;
//   };
// }
