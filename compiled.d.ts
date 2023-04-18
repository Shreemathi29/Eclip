import * as $protobuf from 'protobufjs';
/** Namespace ks1. */
export namespace ks1 {
  /** Represents a KS1Service */
  class KS1Service extends $protobuf.rpc.Service {
    /**
     * Constructs a new KS1Service service.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     */
    constructor(
      rpcImpl: $protobuf.RPCImpl,
      requestDelimited?: boolean,
      responseDelimited?: boolean,
    );

    /**
     * Creates new KS1Service service using the specified rpc implementation.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     * @returns RPC service. Useful where requests and/or responses are streamed.
     */
    public static create(
      rpcImpl: $protobuf.RPCImpl,
      requestDelimited?: boolean,
      responseDelimited?: boolean,
    ): KS1Service;

    /**
     * Calls encode.
     * @param request EncodeRequest message or plain object
     * @param callback Node-style callback called with the error, if any, and EncodeResponse
     */
    public encode(
      request: ks1.IEncodeRequest,
      callback: ks1.KS1Service.encodeCallback,
    ): void;

    /**
     * Calls encode.
     * @param request EncodeRequest message or plain object
     * @returns Promise
     */
    public encode(request: ks1.IEncodeRequest): Promise<ks1.EncodeResponse>;

    /**
     * Calls decode.
     * @param request DecodeRequest message or plain object
     * @param callback Node-style callback called with the error, if any, and DecodeResponse
     */
    public decode(
      request: ks1.IDecodeRequest,
      callback: ks1.KS1Service.decodeCallback,
    ): void;

    /**
     * Calls decode.
     * @param request DecodeRequest message or plain object
     * @returns Promise
     */
    public decode(request: ks1.IDecodeRequest): Promise<ks1.DecodeResponse>;

    /**
     * Calls encrypt.
     * @param request EncryptRequest message or plain object
     * @param callback Node-style callback called with the error, if any, and EncryptResponse
     */
    public encrypt(
      request: ks1.IEncryptRequest,
      callback: ks1.KS1Service.encryptCallback,
    ): void;

    /**
     * Calls encrypt.
     * @param request EncryptRequest message or plain object
     * @returns Promise
     */
    public encrypt(request: ks1.IEncryptRequest): Promise<ks1.EncryptResponse>;

    /**
     * Calls decrypt.
     * @param request DecryptRequest message or plain object
     * @param callback Node-style callback called with the error, if any, and DecryptResponse
     */
    public decrypt(
      request: ks1.IDecryptRequest,
      callback: ks1.KS1Service.decryptCallback,
    ): void;

    /**
     * Calls decrypt.
     * @param request DecryptRequest message or plain object
     * @returns Promise
     */
    public decrypt(request: ks1.IDecryptRequest): Promise<ks1.DecryptResponse>;

    /**
     * Calls ks1Encrypt.
     * @param request KS1EncryptRequest message or plain object
     * @param callback Node-style callback called with the error, if any, and KS1EncryptResponse
     */
    public ks1Encrypt(
      request: ks1.IKS1EncryptRequest,
      callback: ks1.KS1Service.ks1EncryptCallback,
    ): void;

    /**
     * Calls ks1Encrypt.
     * @param request KS1EncryptRequest message or plain object
     * @returns Promise
     */
    public ks1Encrypt(
      request: ks1.IKS1EncryptRequest,
    ): Promise<ks1.KS1EncryptResponse>;

    /**
     * Calls ks1EncryptBulkSNo.
     * @param request KS1EncryptBulkSNoRequest message or plain object
     * @param callback Node-style callback called with the error, if any, and KS1EncryptBulkSNoResponse
     */
    public ks1EncryptBulkSNo(
      request: ks1.IKS1EncryptBulkSNoRequest,
      callback: ks1.KS1Service.ks1EncryptBulkSNoCallback,
    ): void;

    /**
     * Calls ks1EncryptBulkSNo.
     * @param request KS1EncryptBulkSNoRequest message or plain object
     * @returns Promise
     */
    public ks1EncryptBulkSNo(
      request: ks1.IKS1EncryptBulkSNoRequest,
    ): Promise<ks1.KS1EncryptBulkSNoResponse>;

    /**
     * Calls ks1Decrypt.
     * @param request KS1DecryptRequest message or plain object
     * @param callback Node-style callback called with the error, if any, and KS1DecryptResponse
     */
    public ks1Decrypt(
      request: ks1.IKS1DecryptRequest,
      callback: ks1.KS1Service.ks1DecryptCallback,
    ): void;

    /**
     * Calls ks1Decrypt.
     * @param request KS1DecryptRequest message or plain object
     * @returns Promise
     */
    public ks1Decrypt(
      request: ks1.IKS1DecryptRequest,
    ): Promise<ks1.KS1DecryptResponse>;
  }

  namespace KS1Service {
    /**
     * Callback as used by {@link ks1.KS1Service#encode}.
     * @param error Error, if any
     * @param [response] EncodeResponse
     */
    type encodeCallback = (
      error: Error | null,
      response?: ks1.EncodeResponse,
    ) => void;

    /**
     * Callback as used by {@link ks1.KS1Service#decode}.
     * @param error Error, if any
     * @param [response] DecodeResponse
     */
    type decodeCallback = (
      error: Error | null,
      response?: ks1.DecodeResponse,
    ) => void;

    /**
     * Callback as used by {@link ks1.KS1Service#encrypt}.
     * @param error Error, if any
     * @param [response] EncryptResponse
     */
    type encryptCallback = (
      error: Error | null,
      response?: ks1.EncryptResponse,
    ) => void;

    /**
     * Callback as used by {@link ks1.KS1Service#decrypt}.
     * @param error Error, if any
     * @param [response] DecryptResponse
     */
    type decryptCallback = (
      error: Error | null,
      response?: ks1.DecryptResponse,
    ) => void;

    /**
     * Callback as used by {@link ks1.KS1Service#ks1Encrypt}.
     * @param error Error, if any
     * @param [response] KS1EncryptResponse
     */
    type ks1EncryptCallback = (
      error: Error | null,
      response?: ks1.KS1EncryptResponse,
    ) => void;

    /**
     * Callback as used by {@link ks1.KS1Service#ks1EncryptBulkSNo}.
     * @param error Error, if any
     * @param [response] KS1EncryptBulkSNoResponse
     */
    type ks1EncryptBulkSNoCallback = (
      error: Error | null,
      response?: ks1.KS1EncryptBulkSNoResponse,
    ) => void;

    /**
     * Callback as used by {@link ks1.KS1Service#ks1Decrypt}.
     * @param error Error, if any
     * @param [response] KS1DecryptResponse
     */
    type ks1DecryptCallback = (
      error: Error | null,
      response?: ks1.KS1DecryptResponse,
    ) => void;
  }

  /** Properties of a KS1EncryptBulkSNoRequest. */
  interface IKS1EncryptBulkSNoRequest {
    /** KS1EncryptBulkSNoRequest version */
    version: string;

    /** KS1EncryptBulkSNoRequest params */
    params: ks1.IKS1EncodeBulkSNoParam;

    /** KS1EncryptBulkSNoRequest type */
    type: string;

    /** KS1EncryptBulkSNoRequest uid */
    uid?: string | null;
  }

  /** Represents a KS1EncryptBulkSNoRequest. */
  class KS1EncryptBulkSNoRequest implements IKS1EncryptBulkSNoRequest {
    /**
     * Constructs a new KS1EncryptBulkSNoRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IKS1EncryptBulkSNoRequest);

    /** KS1EncryptBulkSNoRequest version. */
    public version: string;

    /** KS1EncryptBulkSNoRequest params. */
    public params: ks1.IKS1EncodeBulkSNoParam;

    /** KS1EncryptBulkSNoRequest type. */
    public type: string;

    /** KS1EncryptBulkSNoRequest uid. */
    public uid?: string | null;

    /** KS1EncryptBulkSNoRequest _uid. */
    public _uid?: 'uid';

    /**
     * Creates a new KS1EncryptBulkSNoRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns KS1EncryptBulkSNoRequest instance
     */
    public static create(
      properties?: ks1.IKS1EncryptBulkSNoRequest,
    ): ks1.KS1EncryptBulkSNoRequest;

    /**
     * Encodes the specified KS1EncryptBulkSNoRequest message. Does not implicitly {@link ks1.KS1EncryptBulkSNoRequest.verify|verify} messages.
     * @param message KS1EncryptBulkSNoRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IKS1EncryptBulkSNoRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified KS1EncryptBulkSNoRequest message, length delimited. Does not implicitly {@link ks1.KS1EncryptBulkSNoRequest.verify|verify} messages.
     * @param message KS1EncryptBulkSNoRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IKS1EncryptBulkSNoRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a KS1EncryptBulkSNoRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns KS1EncryptBulkSNoRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.KS1EncryptBulkSNoRequest;

    /**
     * Decodes a KS1EncryptBulkSNoRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns KS1EncryptBulkSNoRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.KS1EncryptBulkSNoRequest;

    /**
     * Verifies a KS1EncryptBulkSNoRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates a KS1EncryptBulkSNoRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns KS1EncryptBulkSNoRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): ks1.KS1EncryptBulkSNoRequest;

    /**
     * Creates a plain object from a KS1EncryptBulkSNoRequest message. Also converts values to other types if specified.
     * @param message KS1EncryptBulkSNoRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.KS1EncryptBulkSNoRequest,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this KS1EncryptBulkSNoRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of a KS1EncodeBulkSNoParam. */
  interface IKS1EncodeBulkSNoParam {
    /** KS1EncodeBulkSNoParam vc */
    vc?: string | null;

    /** KS1EncodeBulkSNoParam nop */
    nop?: string | null;

    /** KS1EncodeBulkSNoParam org */
    org: string;

    /** KS1EncodeBulkSNoParam batch */
    batch?: string | null;

    /** KS1EncodeBulkSNoParam serialNoStart */
    serialNoStart: number;

    /** KS1EncodeBulkSNoParam serialNoEnd */
    serialNoEnd: number;
  }

  /** Represents a KS1EncodeBulkSNoParam. */
  class KS1EncodeBulkSNoParam implements IKS1EncodeBulkSNoParam {
    /**
     * Constructs a new KS1EncodeBulkSNoParam.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IKS1EncodeBulkSNoParam);

    /** KS1EncodeBulkSNoParam vc. */
    public vc?: string | null;

    /** KS1EncodeBulkSNoParam nop. */
    public nop?: string | null;

    /** KS1EncodeBulkSNoParam org. */
    public org: string;

    /** KS1EncodeBulkSNoParam batch. */
    public batch?: string | null;

    /** KS1EncodeBulkSNoParam serialNoStart. */
    public serialNoStart: number;

    /** KS1EncodeBulkSNoParam serialNoEnd. */
    public serialNoEnd: number;

    /** KS1EncodeBulkSNoParam _vc. */
    public _vc?: 'vc';

    /** KS1EncodeBulkSNoParam _nop. */
    public _nop?: 'nop';

    /** KS1EncodeBulkSNoParam _batch. */
    public _batch?: 'batch';

    /**
     * Creates a new KS1EncodeBulkSNoParam instance using the specified properties.
     * @param [properties] Properties to set
     * @returns KS1EncodeBulkSNoParam instance
     */
    public static create(
      properties?: ks1.IKS1EncodeBulkSNoParam,
    ): ks1.KS1EncodeBulkSNoParam;

    /**
     * Encodes the specified KS1EncodeBulkSNoParam message. Does not implicitly {@link ks1.KS1EncodeBulkSNoParam.verify|verify} messages.
     * @param message KS1EncodeBulkSNoParam message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IKS1EncodeBulkSNoParam,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified KS1EncodeBulkSNoParam message, length delimited. Does not implicitly {@link ks1.KS1EncodeBulkSNoParam.verify|verify} messages.
     * @param message KS1EncodeBulkSNoParam message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IKS1EncodeBulkSNoParam,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a KS1EncodeBulkSNoParam message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns KS1EncodeBulkSNoParam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.KS1EncodeBulkSNoParam;

    /**
     * Decodes a KS1EncodeBulkSNoParam message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns KS1EncodeBulkSNoParam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.KS1EncodeBulkSNoParam;

    /**
     * Verifies a KS1EncodeBulkSNoParam message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates a KS1EncodeBulkSNoParam message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns KS1EncodeBulkSNoParam
     */
    public static fromObject(object: {
      [k: string]: any;
    }): ks1.KS1EncodeBulkSNoParam;

    /**
     * Creates a plain object from a KS1EncodeBulkSNoParam message. Also converts values to other types if specified.
     * @param message KS1EncodeBulkSNoParam
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.KS1EncodeBulkSNoParam,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this KS1EncodeBulkSNoParam to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of a KS1EncryptBulkSNoResponse. */
  interface IKS1EncryptBulkSNoResponse {
    /** KS1EncryptBulkSNoResponse hash */
    hash?: string | null;

    /** KS1EncryptBulkSNoResponse serialNo */
    serialNo?: number | null;
  }

  /** Represents a KS1EncryptBulkSNoResponse. */
  class KS1EncryptBulkSNoResponse implements IKS1EncryptBulkSNoResponse {
    /**
     * Constructs a new KS1EncryptBulkSNoResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IKS1EncryptBulkSNoResponse);

    /** KS1EncryptBulkSNoResponse hash. */
    public hash?: string | null;

    /** KS1EncryptBulkSNoResponse serialNo. */
    public serialNo?: number | null;

    /** KS1EncryptBulkSNoResponse _hash. */
    public _hash?: 'hash';

    /** KS1EncryptBulkSNoResponse _serialNo. */
    public _serialNo?: 'serialNo';

    /**
     * Creates a new KS1EncryptBulkSNoResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns KS1EncryptBulkSNoResponse instance
     */
    public static create(
      properties?: ks1.IKS1EncryptBulkSNoResponse,
    ): ks1.KS1EncryptBulkSNoResponse;

    /**
     * Encodes the specified KS1EncryptBulkSNoResponse message. Does not implicitly {@link ks1.KS1EncryptBulkSNoResponse.verify|verify} messages.
     * @param message KS1EncryptBulkSNoResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IKS1EncryptBulkSNoResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified KS1EncryptBulkSNoResponse message, length delimited. Does not implicitly {@link ks1.KS1EncryptBulkSNoResponse.verify|verify} messages.
     * @param message KS1EncryptBulkSNoResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IKS1EncryptBulkSNoResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a KS1EncryptBulkSNoResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns KS1EncryptBulkSNoResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.KS1EncryptBulkSNoResponse;

    /**
     * Decodes a KS1EncryptBulkSNoResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns KS1EncryptBulkSNoResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.KS1EncryptBulkSNoResponse;

    /**
     * Verifies a KS1EncryptBulkSNoResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates a KS1EncryptBulkSNoResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns KS1EncryptBulkSNoResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): ks1.KS1EncryptBulkSNoResponse;

    /**
     * Creates a plain object from a KS1EncryptBulkSNoResponse message. Also converts values to other types if specified.
     * @param message KS1EncryptBulkSNoResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.KS1EncryptBulkSNoResponse,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this KS1EncryptBulkSNoResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of a KS1EncodeParam. */
  interface IKS1EncodeParam {
    /** KS1EncodeParam vc */
    vc?: string | null;

    /** KS1EncodeParam nop */
    nop?: string | null;

    /** KS1EncodeParam org */
    org: string;

    /** KS1EncodeParam batch */
    batch?: string | null;

    /** KS1EncodeParam serialNo */
    serialNo?: string | null;
  }

  /** Represents a KS1EncodeParam. */
  class KS1EncodeParam implements IKS1EncodeParam {
    /**
     * Constructs a new KS1EncodeParam.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IKS1EncodeParam);

    /** KS1EncodeParam vc. */
    public vc?: string | null;

    /** KS1EncodeParam nop. */
    public nop?: string | null;

    /** KS1EncodeParam org. */
    public org: string;

    /** KS1EncodeParam batch. */
    public batch?: string | null;

    /** KS1EncodeParam serialNo. */
    public serialNo?: string | null;

    /** KS1EncodeParam _vc. */
    public _vc?: 'vc';

    /** KS1EncodeParam _nop. */
    public _nop?: 'nop';

    /** KS1EncodeParam _batch. */
    public _batch?: 'batch';

    /** KS1EncodeParam _serialNo. */
    public _serialNo?: 'serialNo';

    /**
     * Creates a new KS1EncodeParam instance using the specified properties.
     * @param [properties] Properties to set
     * @returns KS1EncodeParam instance
     */
    public static create(properties?: ks1.IKS1EncodeParam): ks1.KS1EncodeParam;

    /**
     * Encodes the specified KS1EncodeParam message. Does not implicitly {@link ks1.KS1EncodeParam.verify|verify} messages.
     * @param message KS1EncodeParam message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IKS1EncodeParam,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified KS1EncodeParam message, length delimited. Does not implicitly {@link ks1.KS1EncodeParam.verify|verify} messages.
     * @param message KS1EncodeParam message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IKS1EncodeParam,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a KS1EncodeParam message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns KS1EncodeParam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.KS1EncodeParam;

    /**
     * Decodes a KS1EncodeParam message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns KS1EncodeParam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.KS1EncodeParam;

    /**
     * Verifies a KS1EncodeParam message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates a KS1EncodeParam message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns KS1EncodeParam
     */
    public static fromObject(object: {[k: string]: any}): ks1.KS1EncodeParam;

    /**
     * Creates a plain object from a KS1EncodeParam message. Also converts values to other types if specified.
     * @param message KS1EncodeParam
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.KS1EncodeParam,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this KS1EncodeParam to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of a KS1EncryptRequest. */
  interface IKS1EncryptRequest {
    /** KS1EncryptRequest version */
    version: string;

    /** KS1EncryptRequest params */
    params: ks1.IKS1EncodeParam;

    /** KS1EncryptRequest type */
    type: string;

    /** KS1EncryptRequest uid */
    uid?: string | null;
  }

  /** Represents a KS1EncryptRequest. */
  class KS1EncryptRequest implements IKS1EncryptRequest {
    /**
     * Constructs a new KS1EncryptRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IKS1EncryptRequest);

    /** KS1EncryptRequest version. */
    public version: string;

    /** KS1EncryptRequest params. */
    public params: ks1.IKS1EncodeParam;

    /** KS1EncryptRequest type. */
    public type: string;

    /** KS1EncryptRequest uid. */
    public uid?: string | null;

    /** KS1EncryptRequest _uid. */
    public _uid?: 'uid';

    /**
     * Creates a new KS1EncryptRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns KS1EncryptRequest instance
     */
    public static create(
      properties?: ks1.IKS1EncryptRequest,
    ): ks1.KS1EncryptRequest;

    /**
     * Encodes the specified KS1EncryptRequest message. Does not implicitly {@link ks1.KS1EncryptRequest.verify|verify} messages.
     * @param message KS1EncryptRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IKS1EncryptRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified KS1EncryptRequest message, length delimited. Does not implicitly {@link ks1.KS1EncryptRequest.verify|verify} messages.
     * @param message KS1EncryptRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IKS1EncryptRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a KS1EncryptRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns KS1EncryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.KS1EncryptRequest;

    /**
     * Decodes a KS1EncryptRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns KS1EncryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.KS1EncryptRequest;

    /**
     * Verifies a KS1EncryptRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates a KS1EncryptRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns KS1EncryptRequest
     */
    public static fromObject(object: {[k: string]: any}): ks1.KS1EncryptRequest;

    /**
     * Creates a plain object from a KS1EncryptRequest message. Also converts values to other types if specified.
     * @param message KS1EncryptRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.KS1EncryptRequest,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this KS1EncryptRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of a KS1EncryptResponse. */
  interface IKS1EncryptResponse {
    /** KS1EncryptResponse hash */
    hash: string;
  }

  /** Represents a KS1EncryptResponse. */
  class KS1EncryptResponse implements IKS1EncryptResponse {
    /**
     * Constructs a new KS1EncryptResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IKS1EncryptResponse);

    /** KS1EncryptResponse hash. */
    public hash: string;

    /**
     * Creates a new KS1EncryptResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns KS1EncryptResponse instance
     */
    public static create(
      properties?: ks1.IKS1EncryptResponse,
    ): ks1.KS1EncryptResponse;

    /**
     * Encodes the specified KS1EncryptResponse message. Does not implicitly {@link ks1.KS1EncryptResponse.verify|verify} messages.
     * @param message KS1EncryptResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IKS1EncryptResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified KS1EncryptResponse message, length delimited. Does not implicitly {@link ks1.KS1EncryptResponse.verify|verify} messages.
     * @param message KS1EncryptResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IKS1EncryptResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a KS1EncryptResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns KS1EncryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.KS1EncryptResponse;

    /**
     * Decodes a KS1EncryptResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns KS1EncryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.KS1EncryptResponse;

    /**
     * Verifies a KS1EncryptResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates a KS1EncryptResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns KS1EncryptResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): ks1.KS1EncryptResponse;

    /**
     * Creates a plain object from a KS1EncryptResponse message. Also converts values to other types if specified.
     * @param message KS1EncryptResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.KS1EncryptResponse,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this KS1EncryptResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of a KS1DecryptRequest. */
  interface IKS1DecryptRequest {
    /** KS1DecryptRequest version */
    version: string;

    /** KS1DecryptRequest hash */
    hash: string;

    /** KS1DecryptRequest type */
    type: string;
  }

  /** Represents a KS1DecryptRequest. */
  class KS1DecryptRequest implements IKS1DecryptRequest {
    /**
     * Constructs a new KS1DecryptRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IKS1DecryptRequest);

    /** KS1DecryptRequest version. */
    public version: string;

    /** KS1DecryptRequest hash. */
    public hash: string;

    /** KS1DecryptRequest type. */
    public type: string;

    /**
     * Creates a new KS1DecryptRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns KS1DecryptRequest instance
     */
    public static create(
      properties?: ks1.IKS1DecryptRequest,
    ): ks1.KS1DecryptRequest;

    /**
     * Encodes the specified KS1DecryptRequest message. Does not implicitly {@link ks1.KS1DecryptRequest.verify|verify} messages.
     * @param message KS1DecryptRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IKS1DecryptRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified KS1DecryptRequest message, length delimited. Does not implicitly {@link ks1.KS1DecryptRequest.verify|verify} messages.
     * @param message KS1DecryptRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IKS1DecryptRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a KS1DecryptRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns KS1DecryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.KS1DecryptRequest;

    /**
     * Decodes a KS1DecryptRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns KS1DecryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.KS1DecryptRequest;

    /**
     * Verifies a KS1DecryptRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates a KS1DecryptRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns KS1DecryptRequest
     */
    public static fromObject(object: {[k: string]: any}): ks1.KS1DecryptRequest;

    /**
     * Creates a plain object from a KS1DecryptRequest message. Also converts values to other types if specified.
     * @param message KS1DecryptRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.KS1DecryptRequest,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this KS1DecryptRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of a KS1DecryptResponse. */
  interface IKS1DecryptResponse {
    /** KS1DecryptResponse decrypted */
    decrypted: ks1.IDecryptResponse;

    /** KS1DecryptResponse decoded */
    decoded?: ks1.IDecodeResponse | null;
  }

  /** Represents a KS1DecryptResponse. */
  class KS1DecryptResponse implements IKS1DecryptResponse {
    /**
     * Constructs a new KS1DecryptResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IKS1DecryptResponse);

    /** KS1DecryptResponse decrypted. */
    public decrypted: ks1.IDecryptResponse;

    /** KS1DecryptResponse decoded. */
    public decoded?: ks1.IDecodeResponse | null;

    /** KS1DecryptResponse _decoded. */
    public _decoded?: 'decoded';

    /**
     * Creates a new KS1DecryptResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns KS1DecryptResponse instance
     */
    public static create(
      properties?: ks1.IKS1DecryptResponse,
    ): ks1.KS1DecryptResponse;

    /**
     * Encodes the specified KS1DecryptResponse message. Does not implicitly {@link ks1.KS1DecryptResponse.verify|verify} messages.
     * @param message KS1DecryptResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IKS1DecryptResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified KS1DecryptResponse message, length delimited. Does not implicitly {@link ks1.KS1DecryptResponse.verify|verify} messages.
     * @param message KS1DecryptResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IKS1DecryptResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a KS1DecryptResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns KS1DecryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.KS1DecryptResponse;

    /**
     * Decodes a KS1DecryptResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns KS1DecryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.KS1DecryptResponse;

    /**
     * Verifies a KS1DecryptResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates a KS1DecryptResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns KS1DecryptResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): ks1.KS1DecryptResponse;

    /**
     * Creates a plain object from a KS1DecryptResponse message. Also converts values to other types if specified.
     * @param message KS1DecryptResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.KS1DecryptResponse,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this KS1DecryptResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of an EncryptParam. */
  interface IEncryptParam {
    /** EncryptParam txId */
    txId: string;

    /** EncryptParam uid */
    uid?: string | null;
  }

  /** Represents an EncryptParam. */
  class EncryptParam implements IEncryptParam {
    /**
     * Constructs a new EncryptParam.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IEncryptParam);

    /** EncryptParam txId. */
    public txId: string;

    /** EncryptParam uid. */
    public uid?: string | null;

    /** EncryptParam _uid. */
    public _uid?: 'uid';

    /**
     * Creates a new EncryptParam instance using the specified properties.
     * @param [properties] Properties to set
     * @returns EncryptParam instance
     */
    public static create(properties?: ks1.IEncryptParam): ks1.EncryptParam;

    /**
     * Encodes the specified EncryptParam message. Does not implicitly {@link ks1.EncryptParam.verify|verify} messages.
     * @param message EncryptParam message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IEncryptParam,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified EncryptParam message, length delimited. Does not implicitly {@link ks1.EncryptParam.verify|verify} messages.
     * @param message EncryptParam message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IEncryptParam,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an EncryptParam message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns EncryptParam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.EncryptParam;

    /**
     * Decodes an EncryptParam message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns EncryptParam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.EncryptParam;

    /**
     * Verifies an EncryptParam message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates an EncryptParam message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns EncryptParam
     */
    public static fromObject(object: {[k: string]: any}): ks1.EncryptParam;

    /**
     * Creates a plain object from an EncryptParam message. Also converts values to other types if specified.
     * @param message EncryptParam
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.EncryptParam,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this EncryptParam to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of an EncryptRequest. */
  interface IEncryptRequest {
    /** EncryptRequest version */
    version: string;

    /** EncryptRequest params */
    params: ks1.IEncryptParam;

    /** EncryptRequest type */
    type: string;
  }

  /** Represents an EncryptRequest. */
  class EncryptRequest implements IEncryptRequest {
    /**
     * Constructs a new EncryptRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IEncryptRequest);

    /** EncryptRequest version. */
    public version: string;

    /** EncryptRequest params. */
    public params: ks1.IEncryptParam;

    /** EncryptRequest type. */
    public type: string;

    /**
     * Creates a new EncryptRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns EncryptRequest instance
     */
    public static create(properties?: ks1.IEncryptRequest): ks1.EncryptRequest;

    /**
     * Encodes the specified EncryptRequest message. Does not implicitly {@link ks1.EncryptRequest.verify|verify} messages.
     * @param message EncryptRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IEncryptRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified EncryptRequest message, length delimited. Does not implicitly {@link ks1.EncryptRequest.verify|verify} messages.
     * @param message EncryptRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IEncryptRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an EncryptRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns EncryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.EncryptRequest;

    /**
     * Decodes an EncryptRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns EncryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.EncryptRequest;

    /**
     * Verifies an EncryptRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates an EncryptRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns EncryptRequest
     */
    public static fromObject(object: {[k: string]: any}): ks1.EncryptRequest;

    /**
     * Creates a plain object from an EncryptRequest message. Also converts values to other types if specified.
     * @param message EncryptRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.EncryptRequest,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this EncryptRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of an EncryptResponse. */
  interface IEncryptResponse {
    /** EncryptResponse hash */
    hash: string;
  }

  /** Represents an EncryptResponse. */
  class EncryptResponse implements IEncryptResponse {
    /**
     * Constructs a new EncryptResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IEncryptResponse);

    /** EncryptResponse hash. */
    public hash: string;

    /**
     * Creates a new EncryptResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns EncryptResponse instance
     */
    public static create(
      properties?: ks1.IEncryptResponse,
    ): ks1.EncryptResponse;

    /**
     * Encodes the specified EncryptResponse message. Does not implicitly {@link ks1.EncryptResponse.verify|verify} messages.
     * @param message EncryptResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IEncryptResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified EncryptResponse message, length delimited. Does not implicitly {@link ks1.EncryptResponse.verify|verify} messages.
     * @param message EncryptResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IEncryptResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an EncryptResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns EncryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.EncryptResponse;

    /**
     * Decodes an EncryptResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns EncryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.EncryptResponse;

    /**
     * Verifies an EncryptResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates an EncryptResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns EncryptResponse
     */
    public static fromObject(object: {[k: string]: any}): ks1.EncryptResponse;

    /**
     * Creates a plain object from an EncryptResponse message. Also converts values to other types if specified.
     * @param message EncryptResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.EncryptResponse,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this EncryptResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of a DecryptRequest. */
  interface IDecryptRequest {
    /** DecryptRequest version */
    version: string;

    /** DecryptRequest hash */
    hash: string;

    /** DecryptRequest type */
    type: string;
  }

  /** Represents a DecryptRequest. */
  class DecryptRequest implements IDecryptRequest {
    /**
     * Constructs a new DecryptRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IDecryptRequest);

    /** DecryptRequest version. */
    public version: string;

    /** DecryptRequest hash. */
    public hash: string;

    /** DecryptRequest type. */
    public type: string;

    /**
     * Creates a new DecryptRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DecryptRequest instance
     */
    public static create(properties?: ks1.IDecryptRequest): ks1.DecryptRequest;

    /**
     * Encodes the specified DecryptRequest message. Does not implicitly {@link ks1.DecryptRequest.verify|verify} messages.
     * @param message DecryptRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IDecryptRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified DecryptRequest message, length delimited. Does not implicitly {@link ks1.DecryptRequest.verify|verify} messages.
     * @param message DecryptRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IDecryptRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a DecryptRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DecryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.DecryptRequest;

    /**
     * Decodes a DecryptRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DecryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.DecryptRequest;

    /**
     * Verifies a DecryptRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates a DecryptRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DecryptRequest
     */
    public static fromObject(object: {[k: string]: any}): ks1.DecryptRequest;

    /**
     * Creates a plain object from a DecryptRequest message. Also converts values to other types if specified.
     * @param message DecryptRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.DecryptRequest,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this DecryptRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of a DecryptResponse. */
  interface IDecryptResponse {
    /** DecryptResponse status */
    status: string;

    /** DecryptResponse errorCode */
    errorCode: string;

    /** DecryptResponse metaData */
    metaData?: string | null;

    /** DecryptResponse isTampered */
    isTampered?: string | null;

    /** DecryptResponse isTamperTag */
    isTamperTag?: boolean | null;

    /** DecryptResponse tapCount */
    tapCount?: string | null;

    /** DecryptResponse txId */
    txId: string;

    /** DecryptResponse uid */
    uid?: string | null;

    /** DecryptResponse originalHash */
    originalHash: string;
  }

  /** Represents a DecryptResponse. */
  class DecryptResponse implements IDecryptResponse {
    /**
     * Constructs a new DecryptResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IDecryptResponse);

    /** DecryptResponse status. */
    public status: string;

    /** DecryptResponse errorCode. */
    public errorCode: string;

    /** DecryptResponse metaData. */
    public metaData?: string | null;

    /** DecryptResponse isTampered. */
    public isTampered?: string | null;

    /** DecryptResponse isTamperTag. */
    public isTamperTag?: boolean | null;

    /** DecryptResponse tapCount. */
    public tapCount?: string | null;

    /** DecryptResponse txId. */
    public txId: string;

    /** DecryptResponse uid. */
    public uid?: string | null;

    /** DecryptResponse originalHash. */
    public originalHash: string;

    /** DecryptResponse _metaData. */
    public _metaData?: 'metaData';

    /** DecryptResponse _isTampered. */
    public _isTampered?: 'isTampered';

    /** DecryptResponse _isTamperTag. */
    public _isTamperTag?: 'isTamperTag';

    /** DecryptResponse _tapCount. */
    public _tapCount?: 'tapCount';

    /** DecryptResponse _uid. */
    public _uid?: 'uid';

    /**
     * Creates a new DecryptResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DecryptResponse instance
     */
    public static create(
      properties?: ks1.IDecryptResponse,
    ): ks1.DecryptResponse;

    /**
     * Encodes the specified DecryptResponse message. Does not implicitly {@link ks1.DecryptResponse.verify|verify} messages.
     * @param message DecryptResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IDecryptResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified DecryptResponse message, length delimited. Does not implicitly {@link ks1.DecryptResponse.verify|verify} messages.
     * @param message DecryptResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IDecryptResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a DecryptResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DecryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.DecryptResponse;

    /**
     * Decodes a DecryptResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DecryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.DecryptResponse;

    /**
     * Verifies a DecryptResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates a DecryptResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DecryptResponse
     */
    public static fromObject(object: {[k: string]: any}): ks1.DecryptResponse;

    /**
     * Creates a plain object from a DecryptResponse message. Also converts values to other types if specified.
     * @param message DecryptResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.DecryptResponse,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this DecryptResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of an EncodeRequest. */
  interface IEncodeRequest {
    /** EncodeRequest version */
    version: string;

    /** EncodeRequest params */
    params: ks1.IKS1EncodeParam;
  }

  /** Represents an EncodeRequest. */
  class EncodeRequest implements IEncodeRequest {
    /**
     * Constructs a new EncodeRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IEncodeRequest);

    /** EncodeRequest version. */
    public version: string;

    /** EncodeRequest params. */
    public params: ks1.IKS1EncodeParam;

    /**
     * Creates a new EncodeRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns EncodeRequest instance
     */
    public static create(properties?: ks1.IEncodeRequest): ks1.EncodeRequest;

    /**
     * Encodes the specified EncodeRequest message. Does not implicitly {@link ks1.EncodeRequest.verify|verify} messages.
     * @param message EncodeRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IEncodeRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified EncodeRequest message, length delimited. Does not implicitly {@link ks1.EncodeRequest.verify|verify} messages.
     * @param message EncodeRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IEncodeRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an EncodeRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns EncodeRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.EncodeRequest;

    /**
     * Decodes an EncodeRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns EncodeRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.EncodeRequest;

    /**
     * Verifies an EncodeRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates an EncodeRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns EncodeRequest
     */
    public static fromObject(object: {[k: string]: any}): ks1.EncodeRequest;

    /**
     * Creates a plain object from an EncodeRequest message. Also converts values to other types if specified.
     * @param message EncodeRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.EncodeRequest,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this EncodeRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of an EncodeResponse. */
  interface IEncodeResponse {
    /** EncodeResponse hash */
    hash: string;
  }

  /** Represents an EncodeResponse. */
  class EncodeResponse implements IEncodeResponse {
    /**
     * Constructs a new EncodeResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IEncodeResponse);

    /** EncodeResponse hash. */
    public hash: string;

    /**
     * Creates a new EncodeResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns EncodeResponse instance
     */
    public static create(properties?: ks1.IEncodeResponse): ks1.EncodeResponse;

    /**
     * Encodes the specified EncodeResponse message. Does not implicitly {@link ks1.EncodeResponse.verify|verify} messages.
     * @param message EncodeResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IEncodeResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified EncodeResponse message, length delimited. Does not implicitly {@link ks1.EncodeResponse.verify|verify} messages.
     * @param message EncodeResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IEncodeResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an EncodeResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns EncodeResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.EncodeResponse;

    /**
     * Decodes an EncodeResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns EncodeResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.EncodeResponse;

    /**
     * Verifies an EncodeResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates an EncodeResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns EncodeResponse
     */
    public static fromObject(object: {[k: string]: any}): ks1.EncodeResponse;

    /**
     * Creates a plain object from an EncodeResponse message. Also converts values to other types if specified.
     * @param message EncodeResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.EncodeResponse,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this EncodeResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of a DecodeRequest. */
  interface IDecodeRequest {
    /** DecodeRequest version */
    version: string;

    /** DecodeRequest hash */
    hash: string;
  }

  /** Represents a DecodeRequest. */
  class DecodeRequest implements IDecodeRequest {
    /**
     * Constructs a new DecodeRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IDecodeRequest);

    /** DecodeRequest version. */
    public version: string;

    /** DecodeRequest hash. */
    public hash: string;

    /**
     * Creates a new DecodeRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DecodeRequest instance
     */
    public static create(properties?: ks1.IDecodeRequest): ks1.DecodeRequest;

    /**
     * Encodes the specified DecodeRequest message. Does not implicitly {@link ks1.DecodeRequest.verify|verify} messages.
     * @param message DecodeRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IDecodeRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified DecodeRequest message, length delimited. Does not implicitly {@link ks1.DecodeRequest.verify|verify} messages.
     * @param message DecodeRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IDecodeRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a DecodeRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DecodeRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.DecodeRequest;

    /**
     * Decodes a DecodeRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DecodeRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.DecodeRequest;

    /**
     * Verifies a DecodeRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates a DecodeRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DecodeRequest
     */
    public static fromObject(object: {[k: string]: any}): ks1.DecodeRequest;

    /**
     * Creates a plain object from a DecodeRequest message. Also converts values to other types if specified.
     * @param message DecodeRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.DecodeRequest,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this DecodeRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of a DecodeResponse. */
  interface IDecodeResponse {
    /** DecodeResponse originalBarcode */
    originalBarcode: string;

    /** DecodeResponse elements */
    elements?: ks1.IDecodedElement[] | null;
  }

  /** Represents a DecodeResponse. */
  class DecodeResponse implements IDecodeResponse {
    /**
     * Constructs a new DecodeResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IDecodeResponse);

    /** DecodeResponse originalBarcode. */
    public originalBarcode: string;

    /** DecodeResponse elements. */
    public elements: ks1.IDecodedElement[];

    /**
     * Creates a new DecodeResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DecodeResponse instance
     */
    public static create(properties?: ks1.IDecodeResponse): ks1.DecodeResponse;

    /**
     * Encodes the specified DecodeResponse message. Does not implicitly {@link ks1.DecodeResponse.verify|verify} messages.
     * @param message DecodeResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IDecodeResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified DecodeResponse message, length delimited. Does not implicitly {@link ks1.DecodeResponse.verify|verify} messages.
     * @param message DecodeResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IDecodeResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a DecodeResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DecodeResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.DecodeResponse;

    /**
     * Decodes a DecodeResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DecodeResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.DecodeResponse;

    /**
     * Verifies a DecodeResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates a DecodeResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DecodeResponse
     */
    public static fromObject(object: {[k: string]: any}): ks1.DecodeResponse;

    /**
     * Creates a plain object from a DecodeResponse message. Also converts values to other types if specified.
     * @param message DecodeResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.DecodeResponse,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this DecodeResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }

  /** Properties of a DecodedElement. */
  interface IDecodedElement {
    /** DecodedElement ai */
    ai: string;

    /** DecodedElement title */
    title: string;

    /** DecodedElement value */
    value: string;

    /** DecodedElement raw */
    raw: string;

    /** DecodedElement meta */
    meta: string;
  }

  /** Represents a DecodedElement. */
  class DecodedElement implements IDecodedElement {
    /**
     * Constructs a new DecodedElement.
     * @param [properties] Properties to set
     */
    constructor(properties?: ks1.IDecodedElement);

    /** DecodedElement ai. */
    public ai: string;

    /** DecodedElement title. */
    public title: string;

    /** DecodedElement value. */
    public value: string;

    /** DecodedElement raw. */
    public raw: string;

    /** DecodedElement meta. */
    public meta: string;

    /**
     * Creates a new DecodedElement instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DecodedElement instance
     */
    public static create(properties?: ks1.IDecodedElement): ks1.DecodedElement;

    /**
     * Encodes the specified DecodedElement message. Does not implicitly {@link ks1.DecodedElement.verify|verify} messages.
     * @param message DecodedElement message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: ks1.IDecodedElement,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified DecodedElement message, length delimited. Does not implicitly {@link ks1.DecodedElement.verify|verify} messages.
     * @param message DecodedElement message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: ks1.IDecodedElement,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a DecodedElement message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DecodedElement
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): ks1.DecodedElement;

    /**
     * Decodes a DecodedElement message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DecodedElement
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): ks1.DecodedElement;

    /**
     * Verifies a DecodedElement message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: {[k: string]: any}): string | null;

    /**
     * Creates a DecodedElement message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DecodedElement
     */
    public static fromObject(object: {[k: string]: any}): ks1.DecodedElement;

    /**
     * Creates a plain object from a DecodedElement message. Also converts values to other types if specified.
     * @param message DecodedElement
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: ks1.DecodedElement,
      options?: $protobuf.IConversionOptions,
    ): {[k: string]: any};

    /**
     * Converts this DecodedElement to JSON.
     * @returns JSON object
     */
    public toJSON(): {[k: string]: any};
  }
}
