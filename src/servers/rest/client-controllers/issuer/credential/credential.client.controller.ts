import {CommonBindings} from '@/common/request-context/common-bindings';
import {ClientService} from '@/common/services';
import {inject, service} from '@loopback/core';
import {
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {
  CREATE_CREDENTIAL_REQUEST,
  CREATE_CREDENTIAL_RESPONSE,
  FIND_CREDENTIAL_REQUEST,
  FIND_CREDENTIAL_RESPONSE,
  GET_CREDENTIAL_REQUEST,
  GET_CREDENTIAL_RESPONSE,
  ICreateCredential,
  ICredentialRequest,
  ICredentialsRequest,
} from './credential.client.openapi';

export class ClientCredentialController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @service(ClientService) private clientServ: ClientService,
    @inject(CommonBindings.COMMON_REQ_CTX) private reCtx: any,
  ) {}

  // TODO: Testing remaining - Need to sync with Kiran on this
  @post('/issuer/credential/create', {
    responses: {
      '200': CREATE_CREDENTIAL_RESPONSE,
    },
  })
  createCredential(
    @requestBody(CREATE_CREDENTIAL_REQUEST) reqData: ICreateCredential,
  ) {
    return this.clientServ.createCredential(reqData);
  }

  @post('/issuer/credential/get', {
    responses: {
      '200': GET_CREDENTIAL_RESPONSE,
    },
  })
  getCredential(
    @requestBody(GET_CREDENTIAL_REQUEST) reqData: ICredentialRequest,
  ) {
    return this.clientServ.getCredential(reqData);
  }

  @post('/issuer/credential/find', {
    responses: {
      '200': FIND_CREDENTIAL_RESPONSE,
    },
  })
  findCredential(
    @requestBody(FIND_CREDENTIAL_REQUEST) reqData: ICredentialsRequest,
  ) {
    return this.clientServ.findCredentials(reqData);
  }
}
