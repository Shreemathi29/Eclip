import {CommonBindings} from '@/common/request-context/common-bindings';
import {GeocoderService} from '@/common/services/geocoder.service';
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
  IMapLocationRequest,
  MAP_LOCATION_REQUEST,
  MAP_LOCATION_RESPONSE,
} from './mapLocation.openapi';

export class MapLocationController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
    @inject(CommonBindings.COMMON_REQ_CTX) private reCtx: any,
    @service(GeocoderService)
    private geocoderServ: GeocoderService,
  ) {}

  @post('/mapLocation/get', {
    responses: {
      '200': MAP_LOCATION_RESPONSE,
    },
  })
  async getMapLocation(
    @requestBody(MAP_LOCATION_REQUEST) reqData: IMapLocationRequest,
  ) {
    return this.geocoderServ.getMapLocation(reqData);
  }
}
