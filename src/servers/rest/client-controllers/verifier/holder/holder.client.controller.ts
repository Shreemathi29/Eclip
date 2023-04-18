import {CommonBindings} from '@/common/request-context/common-bindings';
import {ClientService} from '@/domain-services/client.service';
import {inject} from '@loopback/context';
import {service} from '@loopback/core';
import {
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {
  GET_HOLDERS_REQUEST,
  GET_HOLDERS_RESPONSE,
  GET_HOLDER_REQUEST,
  GET_HOLDER_RESPONSE,
  IHolderRequest,
  IHoldersRequest,
} from './holder.client.openapi';

// @intercept(validateLicense, validateHolder)
export class ClientVerificationHolderController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @service(ClientService) private clientServ: ClientService,
    @inject(CommonBindings.COMMON_REQ_CTX) private reCtx: any,
  ) {}

  @post('/verifier/holder/get', {
    responses: {
      '200': GET_HOLDER_RESPONSE,
    },
  })
  async getVerificationHolder(
    @requestBody(GET_HOLDER_REQUEST) reqData: IHolderRequest,
  ) {
    return this.clientServ.getHolder(reqData);
  }

  @post('/verifier/holder/find', {
    responses: {
      '200': GET_HOLDERS_RESPONSE,
    },
  })
  async findVerificationHolders(
    @requestBody(GET_HOLDERS_REQUEST) reqData: IHoldersRequest,
  ) {
    return this.clientServ.findHolders(reqData);
  }
}
