import {CommonBindings} from '@/common/request-context/common-bindings';
import {SAPService} from '@/common/services/sap.service';
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
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_RESPONSE,
  IProductRequest,
} from './product.openapi';

export class ProductController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @inject(CommonBindings.COMMON_REQ_CTX) private reCtx: any,
    @service(SAPService)
    private sapServ: SAPService,
  ) {}

  @post('/product/create', {
    responses: {
      '200': CREATE_PRODUCT_RESPONSE,
    },
  })
  async createProduct(
    @requestBody(CREATE_PRODUCT_REQUEST) reqData: IProductRequest,
  ) {
    return this.sapServ.createProduct(reqData);
  }
}
