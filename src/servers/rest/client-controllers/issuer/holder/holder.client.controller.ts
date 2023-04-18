import {CommonBindings} from '@/common/request-context/common-bindings';
import {ClientService} from '@/domain-services/client.service';
import {getServiceName} from '@/utils/loopbackUtils';
import {inject} from '@loopback/context';
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

export class ClientIssuerHolderController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    // @service(ClientService) private clientServ: ClientService,
    @inject(CommonBindings.COMMON_REQ_CTX) private reCtx: any,
  ) {}

  @post('/issuer/holder/get', {
    responses: {
      '200': GET_HOLDER_RESPONSE,
    },
  })
  async getIssuerHolder(
    @requestBody(GET_HOLDER_REQUEST) reqData: IHolderRequest,
  ) {
    return this.getClientService().getHolder(reqData);
  }

  @post('/issuer/holder/find', {
    responses: {
      '200': GET_HOLDERS_RESPONSE,
    },
  })
  async findIssuerHolders(
    @requestBody(GET_HOLDERS_REQUEST) reqData: IHoldersRequest,
  ) {
    return this.getClientService().findHolders(reqData);
  }

  // ----------------------------------------------
  private getClientService() {
    return this.reCtx.getSync(getServiceName(ClientService)) as ClientService;
  }
}
