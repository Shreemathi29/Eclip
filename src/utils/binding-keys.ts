import {BindingKey} from '@loopback/context';

export namespace GlobalBindingKeys {
  export const CACHE_CONFIG = BindingKey.create<string | undefined>(
    'config.cache-config',
  );
}
