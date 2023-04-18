import {CommonBindings} from '@/common/request-context/common-bindings';
import {CommonRequestContext} from '@/common/request-context/request-context';
import {ClientService} from '@/common/services';
import {getServiceName} from '@/utils/loopbackUtils';
import {inject, service} from '@loopback/core';
import {
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {
  GET_ACCESS_TOKEN_REQUEST,
  GET_ACCESS_TOKEN_RESPONSE,
  IAccessTokenInput,
} from './common.client.openapi';

export class ClientCommonController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @service(ClientService) private clientServ: ClientService,
    @inject(CommonBindings.COMMON_REQ_CTX) private reCtx: CommonRequestContext,
  ) {}

  @post('/access-token/get', {
    responses: {
      '200': GET_ACCESS_TOKEN_RESPONSE,
    },
  })
  async getAccessToken(
    @requestBody(GET_ACCESS_TOKEN_REQUEST) reqData: IAccessTokenInput,
  ) {
    return this.getClientService().getAccessToken(reqData);
  }

  private getClientService() {
    return this.reCtx.getSync(getServiceName(ClientService)) as ClientService;
  }
}
