import {IMapLocationRequest} from '@/servers/rest/controllers/mapLocation/mapLocation.openapi';
import {log} from '@/utils';
import {bind, BindingScope, config} from '@loopback/core';
import geoip from 'geoip-lite';
import NodeGeocoder from 'node-geocoder';
import {GeoLocation} from '../modules/scanLog';

export type GeocoderConfig = NodeGeocoder.Options;

@bind({scope: BindingScope.SINGLETON})
export class GeocoderService {
  private geocoderInst: any;
  constructor(@config() private geocoderConfig: GeocoderConfig) {
    const geocoder = NodeGeocoder(geocoderConfig);
    this.geocoderInst = geocoder;
  }
  async getMapLocation(reqData: IMapLocationRequest) {
    const mapLocation = await this.geocoderInst.geocode({
      address: reqData.city,
      zipcode: reqData.zipcode,
    });
    return mapLocation;
  }

  public async getLoc({lat, lon}: {lat?: number; lon?: number}) {
    try {
      let geoCoordinates: GeoLocation['geoCoordinates'] = undefined;
      if (lat && lon) geoCoordinates = {type: 'Point', coordinates: [lon, lat]};
      const location: GeoLocation = {geoCoordinates};

      const coordts = location?.geoCoordinates?.coordinates;
      if (coordts) {
        const data = await this.getLocationAddrNoError({
          lat: coordts?.[1],
          lon: coordts?.[0],
        });
        if (data && location) {
          location.city = data.city;
          location.region = data.region;
          location.country = data.country;
          location.type = 'geoc';
        }
      }
      return location;
    } catch (err: any) {
      console.error(`error while getLoc ${err.message}`);
      return undefined;
    }
  }

  private async getLocationAddr({lat, lon}: {lat: number; lon: number}) {
    if (!lat || !lon) return null;
    const res = await this.geocoderInst.reverse({
      lat,
      lon,
    });
    return {
      fullOutput: res,
      city:
        res?.[0]?.administrativeLevels?.level2short ||
        (res as any)?.[0]?.administrativeLevels?.level3short,
      country: res?.[0]?.countryCode,
      region: (res as any)?.[0]?.administrativeLevels.level1short,
    };
  }

  private async getLocationAddrNoError(args: {lat: number; lon: number}) {
    try {
      const ret = await this.getLocationAddr(args);
      return ret;
    } catch (err) {
      log.warn(`error getting reverse geocode info for ${err.message}`, {args});
      return null;
    }
  }

  private geoIPLookup(ip?: string) {
    if (ip) return geoip.lookup(ip);
    return null;
  }

  async getLocationFromIPorGeoCoordts({
    ip,
    latitude,
    longitude,
  }: {
    ip?: string;
    latitude?: number;
    longitude?: number;
  }) {
    const location = (await this.getLoc({lat: latitude, lon: longitude})) || {};
    if (!location?.geoCoordinates?.coordinates) {
      if (!ip) return {location: undefined};
      const geoIPLookup = this.geoIPLookup(ip);
      // console.log('geoIPLookup', geoIPLookup);
      location['city'] = geoIPLookup?.city;
      location['region'] = geoIPLookup?.region;
      location['country'] = geoIPLookup?.country;
      location['type'] = 'ip';
    }
    // console.log('location', location);
    return {location};
  }
}
