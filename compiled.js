/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
'use strict';

var $protobuf = require('protobufjs/minimal');

// Common aliases
var $Reader = $protobuf.Reader,
  $Writer = $protobuf.Writer,
  $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots['default'] || ($protobuf.roots['default'] = {});

$root.ks1 = (function () {
  /**
   * Namespace ks1.
   * @exports ks1
   * @namespace
   */
  var ks1 = {};

  ks1.KS1Service = (function () {
    /**
     * Constructs a new KS1Service service.
     * @memberof ks1
     * @classdesc Represents a KS1Service
     * @extends $protobuf.rpc.Service
     * @constructor
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     */
    function KS1Service(rpcImpl, requestDelimited, responseDelimited) {
      $protobuf.rpc.Service.call(
        this,
        rpcImpl,
        requestDelimited,
        responseDelimited,
      );
    }

    (KS1Service.prototype = Object.create(
      $protobuf.rpc.Service.prototype,
    )).constructor = KS1Service;

    /**
     * Creates new KS1Service service using the specified rpc implementation.
     * @function create
     * @memberof ks1.KS1Service
     * @static
     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     * @returns {KS1Service} RPC service. Useful where requests and/or responses are streamed.
     */
    KS1Service.create = function create(
      rpcImpl,
      requestDelimited,
      responseDelimited,
    ) {
      return new this(rpcImpl, requestDelimited, responseDelimited);
    };

    /**
     * Callback as used by {@link ks1.KS1Service#encode}.
     * @memberof ks1.KS1Service
     * @typedef encodeCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {ks1.EncodeResponse} [response] EncodeResponse
     */

    /**
     * Calls encode.
     * @function encode
     * @memberof ks1.KS1Service
     * @instance
     * @param {ks1.IEncodeRequest} request EncodeRequest message or plain object
     * @param {ks1.KS1Service.encodeCallback} callback Node-style callback called with the error, if any, and EncodeResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(
      (KS1Service.prototype.encode = function encode(request, callback) {
        return this.rpcCall(
          encode,
          $root.ks1.EncodeRequest,
          $root.ks1.EncodeResponse,
          request,
          callback,
        );
      }),
      'name',
      {value: 'encode'},
    );

    /**
     * Calls encode.
     * @function encode
     * @memberof ks1.KS1Service
     * @instance
     * @param {ks1.IEncodeRequest} request EncodeRequest message or plain object
     * @returns {Promise<ks1.EncodeResponse>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link ks1.KS1Service#decode}.
     * @memberof ks1.KS1Service
     * @typedef decodeCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {ks1.DecodeResponse} [response] DecodeResponse
     */

    /**
     * Calls decode.
     * @function decode
     * @memberof ks1.KS1Service
     * @instance
     * @param {ks1.IDecodeRequest} request DecodeRequest message or plain object
     * @param {ks1.KS1Service.decodeCallback} callback Node-style callback called with the error, if any, and DecodeResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(
      (KS1Service.prototype.decode = function decode(request, callback) {
        return this.rpcCall(
          decode,
          $root.ks1.DecodeRequest,
          $root.ks1.DecodeResponse,
          request,
          callback,
        );
      }),
      'name',
      {value: 'decode'},
    );

    /**
     * Calls decode.
     * @function decode
     * @memberof ks1.KS1Service
     * @instance
     * @param {ks1.IDecodeRequest} request DecodeRequest message or plain object
     * @returns {Promise<ks1.DecodeResponse>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link ks1.KS1Service#encrypt}.
     * @memberof ks1.KS1Service
     * @typedef encryptCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {ks1.EncryptResponse} [response] EncryptResponse
     */

    /**
     * Calls encrypt.
     * @function encrypt
     * @memberof ks1.KS1Service
     * @instance
     * @param {ks1.IEncryptRequest} request EncryptRequest message or plain object
     * @param {ks1.KS1Service.encryptCallback} callback Node-style callback called with the error, if any, and EncryptResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(
      (KS1Service.prototype.encrypt = function encrypt(request, callback) {
        return this.rpcCall(
          encrypt,
          $root.ks1.EncryptRequest,
          $root.ks1.EncryptResponse,
          request,
          callback,
        );
      }),
      'name',
      {value: 'encrypt'},
    );

    /**
     * Calls encrypt.
     * @function encrypt
     * @memberof ks1.KS1Service
     * @instance
     * @param {ks1.IEncryptRequest} request EncryptRequest message or plain object
     * @returns {Promise<ks1.EncryptResponse>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link ks1.KS1Service#decrypt}.
     * @memberof ks1.KS1Service
     * @typedef decryptCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {ks1.DecryptResponse} [response] DecryptResponse
     */

    /**
     * Calls decrypt.
     * @function decrypt
     * @memberof ks1.KS1Service
     * @instance
     * @param {ks1.IDecryptRequest} request DecryptRequest message or plain object
     * @param {ks1.KS1Service.decryptCallback} callback Node-style callback called with the error, if any, and DecryptResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(
      (KS1Service.prototype.decrypt = function decrypt(request, callback) {
        return this.rpcCall(
          decrypt,
          $root.ks1.DecryptRequest,
          $root.ks1.DecryptResponse,
          request,
          callback,
        );
      }),
      'name',
      {value: 'decrypt'},
    );

    /**
     * Calls decrypt.
     * @function decrypt
     * @memberof ks1.KS1Service
     * @instance
     * @param {ks1.IDecryptRequest} request DecryptRequest message or plain object
     * @returns {Promise<ks1.DecryptResponse>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link ks1.KS1Service#ks1Encrypt}.
     * @memberof ks1.KS1Service
     * @typedef ks1EncryptCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {ks1.KS1EncryptResponse} [response] KS1EncryptResponse
     */

    /**
     * Calls ks1Encrypt.
     * @function ks1Encrypt
     * @memberof ks1.KS1Service
     * @instance
     * @param {ks1.IKS1EncryptRequest} request KS1EncryptRequest message or plain object
     * @param {ks1.KS1Service.ks1EncryptCallback} callback Node-style callback called with the error, if any, and KS1EncryptResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(
      (KS1Service.prototype.ks1Encrypt = function ks1Encrypt(
        request,
        callback,
      ) {
        return this.rpcCall(
          ks1Encrypt,
          $root.ks1.KS1EncryptRequest,
          $root.ks1.KS1EncryptResponse,
          request,
          callback,
        );
      }),
      'name',
      {value: 'ks1Encrypt'},
    );

    /**
     * Calls ks1Encrypt.
     * @function ks1Encrypt
     * @memberof ks1.KS1Service
     * @instance
     * @param {ks1.IKS1EncryptRequest} request KS1EncryptRequest message or plain object
     * @returns {Promise<ks1.KS1EncryptResponse>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link ks1.KS1Service#ks1EncryptBulkSNo}.
     * @memberof ks1.KS1Service
     * @typedef ks1EncryptBulkSNoCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {ks1.KS1EncryptBulkSNoResponse} [response] KS1EncryptBulkSNoResponse
     */

    /**
     * Calls ks1EncryptBulkSNo.
     * @function ks1EncryptBulkSNo
     * @memberof ks1.KS1Service
     * @instance
     * @param {ks1.IKS1EncryptBulkSNoRequest} request KS1EncryptBulkSNoRequest message or plain object
     * @param {ks1.KS1Service.ks1EncryptBulkSNoCallback} callback Node-style callback called with the error, if any, and KS1EncryptBulkSNoResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(
      (KS1Service.prototype.ks1EncryptBulkSNo = function ks1EncryptBulkSNo(
        request,
        callback,
      ) {
        return this.rpcCall(
          ks1EncryptBulkSNo,
          $root.ks1.KS1EncryptBulkSNoRequest,
          $root.ks1.KS1EncryptBulkSNoResponse,
          request,
          callback,
        );
      }),
      'name',
      {value: 'ks1EncryptBulkSNo'},
    );

    /**
     * Calls ks1EncryptBulkSNo.
     * @function ks1EncryptBulkSNo
     * @memberof ks1.KS1Service
     * @instance
     * @param {ks1.IKS1EncryptBulkSNoRequest} request KS1EncryptBulkSNoRequest message or plain object
     * @returns {Promise<ks1.KS1EncryptBulkSNoResponse>} Promise
     * @variation 2
     */

    /**
     * Callback as used by {@link ks1.KS1Service#ks1Decrypt}.
     * @memberof ks1.KS1Service
     * @typedef ks1DecryptCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {ks1.KS1DecryptResponse} [response] KS1DecryptResponse
     */

    /**
     * Calls ks1Decrypt.
     * @function ks1Decrypt
     * @memberof ks1.KS1Service
     * @instance
     * @param {ks1.IKS1DecryptRequest} request KS1DecryptRequest message or plain object
     * @param {ks1.KS1Service.ks1DecryptCallback} callback Node-style callback called with the error, if any, and KS1DecryptResponse
     * @returns {undefined}
     * @variation 1
     */
    Object.defineProperty(
      (KS1Service.prototype.ks1Decrypt = function ks1Decrypt(
        request,
        callback,
      ) {
        return this.rpcCall(
          ks1Decrypt,
          $root.ks1.KS1DecryptRequest,
          $root.ks1.KS1DecryptResponse,
          request,
          callback,
        );
      }),
      'name',
      {value: 'ks1Decrypt'},
    );

    /**
     * Calls ks1Decrypt.
     * @function ks1Decrypt
     * @memberof ks1.KS1Service
     * @instance
     * @param {ks1.IKS1DecryptRequest} request KS1DecryptRequest message or plain object
     * @returns {Promise<ks1.KS1DecryptResponse>} Promise
     * @variation 2
     */

    return KS1Service;
  })();

  ks1.KS1EncryptBulkSNoRequest = (function () {
    /**
     * Properties of a KS1EncryptBulkSNoRequest.
     * @memberof ks1
     * @interface IKS1EncryptBulkSNoRequest
     * @property {string} version KS1EncryptBulkSNoRequest version
     * @property {ks1.IKS1EncodeBulkSNoParam} params KS1EncryptBulkSNoRequest params
     * @property {string} type KS1EncryptBulkSNoRequest type
     * @property {string|null} [uid] KS1EncryptBulkSNoRequest uid
     */

    /**
     * Constructs a new KS1EncryptBulkSNoRequest.
     * @memberof ks1
     * @classdesc Represents a KS1EncryptBulkSNoRequest.
     * @implements IKS1EncryptBulkSNoRequest
     * @constructor
     * @param {ks1.IKS1EncryptBulkSNoRequest=} [properties] Properties to set
     */
    function KS1EncryptBulkSNoRequest(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * KS1EncryptBulkSNoRequest version.
     * @member {string} version
     * @memberof ks1.KS1EncryptBulkSNoRequest
     * @instance
     */
    KS1EncryptBulkSNoRequest.prototype.version = '';

    /**
     * KS1EncryptBulkSNoRequest params.
     * @member {ks1.IKS1EncodeBulkSNoParam} params
     * @memberof ks1.KS1EncryptBulkSNoRequest
     * @instance
     */
    KS1EncryptBulkSNoRequest.prototype.params = null;

    /**
     * KS1EncryptBulkSNoRequest type.
     * @member {string} type
     * @memberof ks1.KS1EncryptBulkSNoRequest
     * @instance
     */
    KS1EncryptBulkSNoRequest.prototype.type = '';

    /**
     * KS1EncryptBulkSNoRequest uid.
     * @member {string|null|undefined} uid
     * @memberof ks1.KS1EncryptBulkSNoRequest
     * @instance
     */
    KS1EncryptBulkSNoRequest.prototype.uid = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * KS1EncryptBulkSNoRequest _uid.
     * @member {"uid"|undefined} _uid
     * @memberof ks1.KS1EncryptBulkSNoRequest
     * @instance
     */
    Object.defineProperty(KS1EncryptBulkSNoRequest.prototype, '_uid', {
      get: $util.oneOfGetter(($oneOfFields = ['uid'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * Creates a new KS1EncryptBulkSNoRequest instance using the specified properties.
     * @function create
     * @memberof ks1.KS1EncryptBulkSNoRequest
     * @static
     * @param {ks1.IKS1EncryptBulkSNoRequest=} [properties] Properties to set
     * @returns {ks1.KS1EncryptBulkSNoRequest} KS1EncryptBulkSNoRequest instance
     */
    KS1EncryptBulkSNoRequest.create = function create(properties) {
      return new KS1EncryptBulkSNoRequest(properties);
    };

    /**
     * Encodes the specified KS1EncryptBulkSNoRequest message. Does not implicitly {@link ks1.KS1EncryptBulkSNoRequest.verify|verify} messages.
     * @function encode
     * @memberof ks1.KS1EncryptBulkSNoRequest
     * @static
     * @param {ks1.IKS1EncryptBulkSNoRequest} message KS1EncryptBulkSNoRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1EncryptBulkSNoRequest.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.version);
      $root.ks1.KS1EncodeBulkSNoParam.encode(
        message.params,
        writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
      ).ldelim();
      writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.type);
      if (message.uid != null && Object.hasOwnProperty.call(message, 'uid'))
        writer.uint32(/* id 4, wireType 2 =*/ 34).string(message.uid);
      return writer;
    };

    /**
     * Encodes the specified KS1EncryptBulkSNoRequest message, length delimited. Does not implicitly {@link ks1.KS1EncryptBulkSNoRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.KS1EncryptBulkSNoRequest
     * @static
     * @param {ks1.IKS1EncryptBulkSNoRequest} message KS1EncryptBulkSNoRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1EncryptBulkSNoRequest.encodeDelimited = function encodeDelimited(
      message,
      writer,
    ) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a KS1EncryptBulkSNoRequest message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.KS1EncryptBulkSNoRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.KS1EncryptBulkSNoRequest} KS1EncryptBulkSNoRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1EncryptBulkSNoRequest.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.KS1EncryptBulkSNoRequest();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.version = reader.string();
            break;
          case 2:
            message.params = $root.ks1.KS1EncodeBulkSNoParam.decode(
              reader,
              reader.uint32(),
            );
            break;
          case 3:
            message.type = reader.string();
            break;
          case 4:
            message.uid = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('version'))
        throw $util.ProtocolError("missing required 'version'", {
          instance: message,
        });
      if (!message.hasOwnProperty('params'))
        throw $util.ProtocolError("missing required 'params'", {
          instance: message,
        });
      if (!message.hasOwnProperty('type'))
        throw $util.ProtocolError("missing required 'type'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes a KS1EncryptBulkSNoRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.KS1EncryptBulkSNoRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.KS1EncryptBulkSNoRequest} KS1EncryptBulkSNoRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1EncryptBulkSNoRequest.decodeDelimited = function decodeDelimited(
      reader,
    ) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a KS1EncryptBulkSNoRequest message.
     * @function verify
     * @memberof ks1.KS1EncryptBulkSNoRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    KS1EncryptBulkSNoRequest.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      var properties = {};
      if (!$util.isString(message.version)) return 'version: string expected';
      {
        var error = $root.ks1.KS1EncodeBulkSNoParam.verify(message.params);
        if (error) return 'params.' + error;
      }
      if (!$util.isString(message.type)) return 'type: string expected';
      if (message.uid != null && message.hasOwnProperty('uid')) {
        properties._uid = 1;
        if (!$util.isString(message.uid)) return 'uid: string expected';
      }
      return null;
    };

    /**
     * Creates a KS1EncryptBulkSNoRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.KS1EncryptBulkSNoRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.KS1EncryptBulkSNoRequest} KS1EncryptBulkSNoRequest
     */
    KS1EncryptBulkSNoRequest.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.KS1EncryptBulkSNoRequest) return object;
      var message = new $root.ks1.KS1EncryptBulkSNoRequest();
      if (object.version != null) message.version = String(object.version);
      if (object.params != null) {
        if (typeof object.params !== 'object')
          throw TypeError(
            '.ks1.KS1EncryptBulkSNoRequest.params: object expected',
          );
        message.params = $root.ks1.KS1EncodeBulkSNoParam.fromObject(
          object.params,
        );
      }
      if (object.type != null) message.type = String(object.type);
      if (object.uid != null) message.uid = String(object.uid);
      return message;
    };

    /**
     * Creates a plain object from a KS1EncryptBulkSNoRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.KS1EncryptBulkSNoRequest
     * @static
     * @param {ks1.KS1EncryptBulkSNoRequest} message KS1EncryptBulkSNoRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    KS1EncryptBulkSNoRequest.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) {
        object.version = '';
        object.params = null;
        object.type = '';
      }
      if (message.version != null && message.hasOwnProperty('version'))
        object.version = message.version;
      if (message.params != null && message.hasOwnProperty('params'))
        object.params = $root.ks1.KS1EncodeBulkSNoParam.toObject(
          message.params,
          options,
        );
      if (message.type != null && message.hasOwnProperty('type'))
        object.type = message.type;
      if (message.uid != null && message.hasOwnProperty('uid')) {
        object.uid = message.uid;
        if (options.oneofs) object._uid = 'uid';
      }
      return object;
    };

    /**
     * Converts this KS1EncryptBulkSNoRequest to JSON.
     * @function toJSON
     * @memberof ks1.KS1EncryptBulkSNoRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    KS1EncryptBulkSNoRequest.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return KS1EncryptBulkSNoRequest;
  })();

  ks1.KS1EncodeBulkSNoParam = (function () {
    /**
     * Properties of a KS1EncodeBulkSNoParam.
     * @memberof ks1
     * @interface IKS1EncodeBulkSNoParam
     * @property {string|null} [vc] KS1EncodeBulkSNoParam vc
     * @property {string|null} [nop] KS1EncodeBulkSNoParam nop
     * @property {string} org KS1EncodeBulkSNoParam org
     * @property {string|null} [batch] KS1EncodeBulkSNoParam batch
     * @property {number} serialNoStart KS1EncodeBulkSNoParam serialNoStart
     * @property {number} serialNoEnd KS1EncodeBulkSNoParam serialNoEnd
     */

    /**
     * Constructs a new KS1EncodeBulkSNoParam.
     * @memberof ks1
     * @classdesc Represents a KS1EncodeBulkSNoParam.
     * @implements IKS1EncodeBulkSNoParam
     * @constructor
     * @param {ks1.IKS1EncodeBulkSNoParam=} [properties] Properties to set
     */
    function KS1EncodeBulkSNoParam(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * KS1EncodeBulkSNoParam vc.
     * @member {string|null|undefined} vc
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @instance
     */
    KS1EncodeBulkSNoParam.prototype.vc = null;

    /**
     * KS1EncodeBulkSNoParam nop.
     * @member {string|null|undefined} nop
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @instance
     */
    KS1EncodeBulkSNoParam.prototype.nop = null;

    /**
     * KS1EncodeBulkSNoParam org.
     * @member {string} org
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @instance
     */
    KS1EncodeBulkSNoParam.prototype.org = '';

    /**
     * KS1EncodeBulkSNoParam batch.
     * @member {string|null|undefined} batch
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @instance
     */
    KS1EncodeBulkSNoParam.prototype.batch = null;

    /**
     * KS1EncodeBulkSNoParam serialNoStart.
     * @member {number} serialNoStart
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @instance
     */
    KS1EncodeBulkSNoParam.prototype.serialNoStart = 0;

    /**
     * KS1EncodeBulkSNoParam serialNoEnd.
     * @member {number} serialNoEnd
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @instance
     */
    KS1EncodeBulkSNoParam.prototype.serialNoEnd = 0;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * KS1EncodeBulkSNoParam _vc.
     * @member {"vc"|undefined} _vc
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @instance
     */
    Object.defineProperty(KS1EncodeBulkSNoParam.prototype, '_vc', {
      get: $util.oneOfGetter(($oneOfFields = ['vc'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * KS1EncodeBulkSNoParam _nop.
     * @member {"nop"|undefined} _nop
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @instance
     */
    Object.defineProperty(KS1EncodeBulkSNoParam.prototype, '_nop', {
      get: $util.oneOfGetter(($oneOfFields = ['nop'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * KS1EncodeBulkSNoParam _batch.
     * @member {"batch"|undefined} _batch
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @instance
     */
    Object.defineProperty(KS1EncodeBulkSNoParam.prototype, '_batch', {
      get: $util.oneOfGetter(($oneOfFields = ['batch'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * Creates a new KS1EncodeBulkSNoParam instance using the specified properties.
     * @function create
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @static
     * @param {ks1.IKS1EncodeBulkSNoParam=} [properties] Properties to set
     * @returns {ks1.KS1EncodeBulkSNoParam} KS1EncodeBulkSNoParam instance
     */
    KS1EncodeBulkSNoParam.create = function create(properties) {
      return new KS1EncodeBulkSNoParam(properties);
    };

    /**
     * Encodes the specified KS1EncodeBulkSNoParam message. Does not implicitly {@link ks1.KS1EncodeBulkSNoParam.verify|verify} messages.
     * @function encode
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @static
     * @param {ks1.IKS1EncodeBulkSNoParam} message KS1EncodeBulkSNoParam message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1EncodeBulkSNoParam.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (message.vc != null && Object.hasOwnProperty.call(message, 'vc'))
        writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.vc);
      if (message.nop != null && Object.hasOwnProperty.call(message, 'nop'))
        writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.nop);
      writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.org);
      if (message.batch != null && Object.hasOwnProperty.call(message, 'batch'))
        writer.uint32(/* id 4, wireType 2 =*/ 34).string(message.batch);
      writer.uint32(/* id 5, wireType 0 =*/ 40).int32(message.serialNoStart);
      writer.uint32(/* id 6, wireType 0 =*/ 48).int32(message.serialNoEnd);
      return writer;
    };

    /**
     * Encodes the specified KS1EncodeBulkSNoParam message, length delimited. Does not implicitly {@link ks1.KS1EncodeBulkSNoParam.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @static
     * @param {ks1.IKS1EncodeBulkSNoParam} message KS1EncodeBulkSNoParam message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1EncodeBulkSNoParam.encodeDelimited = function encodeDelimited(
      message,
      writer,
    ) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a KS1EncodeBulkSNoParam message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.KS1EncodeBulkSNoParam} KS1EncodeBulkSNoParam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1EncodeBulkSNoParam.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.KS1EncodeBulkSNoParam();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.vc = reader.string();
            break;
          case 2:
            message.nop = reader.string();
            break;
          case 3:
            message.org = reader.string();
            break;
          case 4:
            message.batch = reader.string();
            break;
          case 5:
            message.serialNoStart = reader.int32();
            break;
          case 6:
            message.serialNoEnd = reader.int32();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('org'))
        throw $util.ProtocolError("missing required 'org'", {
          instance: message,
        });
      if (!message.hasOwnProperty('serialNoStart'))
        throw $util.ProtocolError("missing required 'serialNoStart'", {
          instance: message,
        });
      if (!message.hasOwnProperty('serialNoEnd'))
        throw $util.ProtocolError("missing required 'serialNoEnd'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes a KS1EncodeBulkSNoParam message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.KS1EncodeBulkSNoParam} KS1EncodeBulkSNoParam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1EncodeBulkSNoParam.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a KS1EncodeBulkSNoParam message.
     * @function verify
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    KS1EncodeBulkSNoParam.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      var properties = {};
      if (message.vc != null && message.hasOwnProperty('vc')) {
        properties._vc = 1;
        if (!$util.isString(message.vc)) return 'vc: string expected';
      }
      if (message.nop != null && message.hasOwnProperty('nop')) {
        properties._nop = 1;
        if (!$util.isString(message.nop)) return 'nop: string expected';
      }
      if (!$util.isString(message.org)) return 'org: string expected';
      if (message.batch != null && message.hasOwnProperty('batch')) {
        properties._batch = 1;
        if (!$util.isString(message.batch)) return 'batch: string expected';
      }
      if (!$util.isInteger(message.serialNoStart))
        return 'serialNoStart: integer expected';
      if (!$util.isInteger(message.serialNoEnd))
        return 'serialNoEnd: integer expected';
      return null;
    };

    /**
     * Creates a KS1EncodeBulkSNoParam message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.KS1EncodeBulkSNoParam} KS1EncodeBulkSNoParam
     */
    KS1EncodeBulkSNoParam.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.KS1EncodeBulkSNoParam) return object;
      var message = new $root.ks1.KS1EncodeBulkSNoParam();
      if (object.vc != null) message.vc = String(object.vc);
      if (object.nop != null) message.nop = String(object.nop);
      if (object.org != null) message.org = String(object.org);
      if (object.batch != null) message.batch = String(object.batch);
      if (object.serialNoStart != null)
        message.serialNoStart = object.serialNoStart | 0;
      if (object.serialNoEnd != null)
        message.serialNoEnd = object.serialNoEnd | 0;
      return message;
    };

    /**
     * Creates a plain object from a KS1EncodeBulkSNoParam message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @static
     * @param {ks1.KS1EncodeBulkSNoParam} message KS1EncodeBulkSNoParam
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    KS1EncodeBulkSNoParam.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) {
        object.org = '';
        object.serialNoStart = 0;
        object.serialNoEnd = 0;
      }
      if (message.vc != null && message.hasOwnProperty('vc')) {
        object.vc = message.vc;
        if (options.oneofs) object._vc = 'vc';
      }
      if (message.nop != null && message.hasOwnProperty('nop')) {
        object.nop = message.nop;
        if (options.oneofs) object._nop = 'nop';
      }
      if (message.org != null && message.hasOwnProperty('org'))
        object.org = message.org;
      if (message.batch != null && message.hasOwnProperty('batch')) {
        object.batch = message.batch;
        if (options.oneofs) object._batch = 'batch';
      }
      if (
        message.serialNoStart != null &&
        message.hasOwnProperty('serialNoStart')
      )
        object.serialNoStart = message.serialNoStart;
      if (message.serialNoEnd != null && message.hasOwnProperty('serialNoEnd'))
        object.serialNoEnd = message.serialNoEnd;
      return object;
    };

    /**
     * Converts this KS1EncodeBulkSNoParam to JSON.
     * @function toJSON
     * @memberof ks1.KS1EncodeBulkSNoParam
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    KS1EncodeBulkSNoParam.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return KS1EncodeBulkSNoParam;
  })();

  ks1.KS1EncryptBulkSNoResponse = (function () {
    /**
     * Properties of a KS1EncryptBulkSNoResponse.
     * @memberof ks1
     * @interface IKS1EncryptBulkSNoResponse
     * @property {string|null} [hash] KS1EncryptBulkSNoResponse hash
     * @property {number|null} [serialNo] KS1EncryptBulkSNoResponse serialNo
     */

    /**
     * Constructs a new KS1EncryptBulkSNoResponse.
     * @memberof ks1
     * @classdesc Represents a KS1EncryptBulkSNoResponse.
     * @implements IKS1EncryptBulkSNoResponse
     * @constructor
     * @param {ks1.IKS1EncryptBulkSNoResponse=} [properties] Properties to set
     */
    function KS1EncryptBulkSNoResponse(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * KS1EncryptBulkSNoResponse hash.
     * @member {string|null|undefined} hash
     * @memberof ks1.KS1EncryptBulkSNoResponse
     * @instance
     */
    KS1EncryptBulkSNoResponse.prototype.hash = null;

    /**
     * KS1EncryptBulkSNoResponse serialNo.
     * @member {number|null|undefined} serialNo
     * @memberof ks1.KS1EncryptBulkSNoResponse
     * @instance
     */
    KS1EncryptBulkSNoResponse.prototype.serialNo = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * KS1EncryptBulkSNoResponse _hash.
     * @member {"hash"|undefined} _hash
     * @memberof ks1.KS1EncryptBulkSNoResponse
     * @instance
     */
    Object.defineProperty(KS1EncryptBulkSNoResponse.prototype, '_hash', {
      get: $util.oneOfGetter(($oneOfFields = ['hash'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * KS1EncryptBulkSNoResponse _serialNo.
     * @member {"serialNo"|undefined} _serialNo
     * @memberof ks1.KS1EncryptBulkSNoResponse
     * @instance
     */
    Object.defineProperty(KS1EncryptBulkSNoResponse.prototype, '_serialNo', {
      get: $util.oneOfGetter(($oneOfFields = ['serialNo'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * Creates a new KS1EncryptBulkSNoResponse instance using the specified properties.
     * @function create
     * @memberof ks1.KS1EncryptBulkSNoResponse
     * @static
     * @param {ks1.IKS1EncryptBulkSNoResponse=} [properties] Properties to set
     * @returns {ks1.KS1EncryptBulkSNoResponse} KS1EncryptBulkSNoResponse instance
     */
    KS1EncryptBulkSNoResponse.create = function create(properties) {
      return new KS1EncryptBulkSNoResponse(properties);
    };

    /**
     * Encodes the specified KS1EncryptBulkSNoResponse message. Does not implicitly {@link ks1.KS1EncryptBulkSNoResponse.verify|verify} messages.
     * @function encode
     * @memberof ks1.KS1EncryptBulkSNoResponse
     * @static
     * @param {ks1.IKS1EncryptBulkSNoResponse} message KS1EncryptBulkSNoResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1EncryptBulkSNoResponse.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (message.hash != null && Object.hasOwnProperty.call(message, 'hash'))
        writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.hash);
      if (
        message.serialNo != null &&
        Object.hasOwnProperty.call(message, 'serialNo')
      )
        writer.uint32(/* id 2, wireType 0 =*/ 16).int32(message.serialNo);
      return writer;
    };

    /**
     * Encodes the specified KS1EncryptBulkSNoResponse message, length delimited. Does not implicitly {@link ks1.KS1EncryptBulkSNoResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.KS1EncryptBulkSNoResponse
     * @static
     * @param {ks1.IKS1EncryptBulkSNoResponse} message KS1EncryptBulkSNoResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1EncryptBulkSNoResponse.encodeDelimited = function encodeDelimited(
      message,
      writer,
    ) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a KS1EncryptBulkSNoResponse message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.KS1EncryptBulkSNoResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.KS1EncryptBulkSNoResponse} KS1EncryptBulkSNoResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1EncryptBulkSNoResponse.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.KS1EncryptBulkSNoResponse();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.hash = reader.string();
            break;
          case 2:
            message.serialNo = reader.int32();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a KS1EncryptBulkSNoResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.KS1EncryptBulkSNoResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.KS1EncryptBulkSNoResponse} KS1EncryptBulkSNoResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1EncryptBulkSNoResponse.decodeDelimited = function decodeDelimited(
      reader,
    ) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a KS1EncryptBulkSNoResponse message.
     * @function verify
     * @memberof ks1.KS1EncryptBulkSNoResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    KS1EncryptBulkSNoResponse.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      var properties = {};
      if (message.hash != null && message.hasOwnProperty('hash')) {
        properties._hash = 1;
        if (!$util.isString(message.hash)) return 'hash: string expected';
      }
      if (message.serialNo != null && message.hasOwnProperty('serialNo')) {
        properties._serialNo = 1;
        if (!$util.isInteger(message.serialNo))
          return 'serialNo: integer expected';
      }
      return null;
    };

    /**
     * Creates a KS1EncryptBulkSNoResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.KS1EncryptBulkSNoResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.KS1EncryptBulkSNoResponse} KS1EncryptBulkSNoResponse
     */
    KS1EncryptBulkSNoResponse.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.KS1EncryptBulkSNoResponse) return object;
      var message = new $root.ks1.KS1EncryptBulkSNoResponse();
      if (object.hash != null) message.hash = String(object.hash);
      if (object.serialNo != null) message.serialNo = object.serialNo | 0;
      return message;
    };

    /**
     * Creates a plain object from a KS1EncryptBulkSNoResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.KS1EncryptBulkSNoResponse
     * @static
     * @param {ks1.KS1EncryptBulkSNoResponse} message KS1EncryptBulkSNoResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    KS1EncryptBulkSNoResponse.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (message.hash != null && message.hasOwnProperty('hash')) {
        object.hash = message.hash;
        if (options.oneofs) object._hash = 'hash';
      }
      if (message.serialNo != null && message.hasOwnProperty('serialNo')) {
        object.serialNo = message.serialNo;
        if (options.oneofs) object._serialNo = 'serialNo';
      }
      return object;
    };

    /**
     * Converts this KS1EncryptBulkSNoResponse to JSON.
     * @function toJSON
     * @memberof ks1.KS1EncryptBulkSNoResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    KS1EncryptBulkSNoResponse.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return KS1EncryptBulkSNoResponse;
  })();

  ks1.KS1EncodeParam = (function () {
    /**
     * Properties of a KS1EncodeParam.
     * @memberof ks1
     * @interface IKS1EncodeParam
     * @property {string|null} [vc] KS1EncodeParam vc
     * @property {string|null} [nop] KS1EncodeParam nop
     * @property {string} org KS1EncodeParam org
     * @property {string|null} [batch] KS1EncodeParam batch
     * @property {string|null} [serialNo] KS1EncodeParam serialNo
     */

    /**
     * Constructs a new KS1EncodeParam.
     * @memberof ks1
     * @classdesc Represents a KS1EncodeParam.
     * @implements IKS1EncodeParam
     * @constructor
     * @param {ks1.IKS1EncodeParam=} [properties] Properties to set
     */
    function KS1EncodeParam(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * KS1EncodeParam vc.
     * @member {string|null|undefined} vc
     * @memberof ks1.KS1EncodeParam
     * @instance
     */
    KS1EncodeParam.prototype.vc = null;

    /**
     * KS1EncodeParam nop.
     * @member {string|null|undefined} nop
     * @memberof ks1.KS1EncodeParam
     * @instance
     */
    KS1EncodeParam.prototype.nop = null;

    /**
     * KS1EncodeParam org.
     * @member {string} org
     * @memberof ks1.KS1EncodeParam
     * @instance
     */
    KS1EncodeParam.prototype.org = '';

    /**
     * KS1EncodeParam batch.
     * @member {string|null|undefined} batch
     * @memberof ks1.KS1EncodeParam
     * @instance
     */
    KS1EncodeParam.prototype.batch = null;

    /**
     * KS1EncodeParam serialNo.
     * @member {string|null|undefined} serialNo
     * @memberof ks1.KS1EncodeParam
     * @instance
     */
    KS1EncodeParam.prototype.serialNo = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * KS1EncodeParam _vc.
     * @member {"vc"|undefined} _vc
     * @memberof ks1.KS1EncodeParam
     * @instance
     */
    Object.defineProperty(KS1EncodeParam.prototype, '_vc', {
      get: $util.oneOfGetter(($oneOfFields = ['vc'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * KS1EncodeParam _nop.
     * @member {"nop"|undefined} _nop
     * @memberof ks1.KS1EncodeParam
     * @instance
     */
    Object.defineProperty(KS1EncodeParam.prototype, '_nop', {
      get: $util.oneOfGetter(($oneOfFields = ['nop'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * KS1EncodeParam _batch.
     * @member {"batch"|undefined} _batch
     * @memberof ks1.KS1EncodeParam
     * @instance
     */
    Object.defineProperty(KS1EncodeParam.prototype, '_batch', {
      get: $util.oneOfGetter(($oneOfFields = ['batch'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * KS1EncodeParam _serialNo.
     * @member {"serialNo"|undefined} _serialNo
     * @memberof ks1.KS1EncodeParam
     * @instance
     */
    Object.defineProperty(KS1EncodeParam.prototype, '_serialNo', {
      get: $util.oneOfGetter(($oneOfFields = ['serialNo'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * Creates a new KS1EncodeParam instance using the specified properties.
     * @function create
     * @memberof ks1.KS1EncodeParam
     * @static
     * @param {ks1.IKS1EncodeParam=} [properties] Properties to set
     * @returns {ks1.KS1EncodeParam} KS1EncodeParam instance
     */
    KS1EncodeParam.create = function create(properties) {
      return new KS1EncodeParam(properties);
    };

    /**
     * Encodes the specified KS1EncodeParam message. Does not implicitly {@link ks1.KS1EncodeParam.verify|verify} messages.
     * @function encode
     * @memberof ks1.KS1EncodeParam
     * @static
     * @param {ks1.IKS1EncodeParam} message KS1EncodeParam message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1EncodeParam.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (message.vc != null && Object.hasOwnProperty.call(message, 'vc'))
        writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.vc);
      if (message.nop != null && Object.hasOwnProperty.call(message, 'nop'))
        writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.nop);
      writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.org);
      if (message.batch != null && Object.hasOwnProperty.call(message, 'batch'))
        writer.uint32(/* id 4, wireType 2 =*/ 34).string(message.batch);
      if (
        message.serialNo != null &&
        Object.hasOwnProperty.call(message, 'serialNo')
      )
        writer.uint32(/* id 5, wireType 2 =*/ 42).string(message.serialNo);
      return writer;
    };

    /**
     * Encodes the specified KS1EncodeParam message, length delimited. Does not implicitly {@link ks1.KS1EncodeParam.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.KS1EncodeParam
     * @static
     * @param {ks1.IKS1EncodeParam} message KS1EncodeParam message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1EncodeParam.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a KS1EncodeParam message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.KS1EncodeParam
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.KS1EncodeParam} KS1EncodeParam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1EncodeParam.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.KS1EncodeParam();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.vc = reader.string();
            break;
          case 2:
            message.nop = reader.string();
            break;
          case 3:
            message.org = reader.string();
            break;
          case 4:
            message.batch = reader.string();
            break;
          case 5:
            message.serialNo = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('org'))
        throw $util.ProtocolError("missing required 'org'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes a KS1EncodeParam message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.KS1EncodeParam
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.KS1EncodeParam} KS1EncodeParam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1EncodeParam.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a KS1EncodeParam message.
     * @function verify
     * @memberof ks1.KS1EncodeParam
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    KS1EncodeParam.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      var properties = {};
      if (message.vc != null && message.hasOwnProperty('vc')) {
        properties._vc = 1;
        if (!$util.isString(message.vc)) return 'vc: string expected';
      }
      if (message.nop != null && message.hasOwnProperty('nop')) {
        properties._nop = 1;
        if (!$util.isString(message.nop)) return 'nop: string expected';
      }
      if (!$util.isString(message.org)) return 'org: string expected';
      if (message.batch != null && message.hasOwnProperty('batch')) {
        properties._batch = 1;
        if (!$util.isString(message.batch)) return 'batch: string expected';
      }
      if (message.serialNo != null && message.hasOwnProperty('serialNo')) {
        properties._serialNo = 1;
        if (!$util.isString(message.serialNo))
          return 'serialNo: string expected';
      }
      return null;
    };

    /**
     * Creates a KS1EncodeParam message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.KS1EncodeParam
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.KS1EncodeParam} KS1EncodeParam
     */
    KS1EncodeParam.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.KS1EncodeParam) return object;
      var message = new $root.ks1.KS1EncodeParam();
      if (object.vc != null) message.vc = String(object.vc);
      if (object.nop != null) message.nop = String(object.nop);
      if (object.org != null) message.org = String(object.org);
      if (object.batch != null) message.batch = String(object.batch);
      if (object.serialNo != null) message.serialNo = String(object.serialNo);
      return message;
    };

    /**
     * Creates a plain object from a KS1EncodeParam message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.KS1EncodeParam
     * @static
     * @param {ks1.KS1EncodeParam} message KS1EncodeParam
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    KS1EncodeParam.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) object.org = '';
      if (message.vc != null && message.hasOwnProperty('vc')) {
        object.vc = message.vc;
        if (options.oneofs) object._vc = 'vc';
      }
      if (message.nop != null && message.hasOwnProperty('nop')) {
        object.nop = message.nop;
        if (options.oneofs) object._nop = 'nop';
      }
      if (message.org != null && message.hasOwnProperty('org'))
        object.org = message.org;
      if (message.batch != null && message.hasOwnProperty('batch')) {
        object.batch = message.batch;
        if (options.oneofs) object._batch = 'batch';
      }
      if (message.serialNo != null && message.hasOwnProperty('serialNo')) {
        object.serialNo = message.serialNo;
        if (options.oneofs) object._serialNo = 'serialNo';
      }
      return object;
    };

    /**
     * Converts this KS1EncodeParam to JSON.
     * @function toJSON
     * @memberof ks1.KS1EncodeParam
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    KS1EncodeParam.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return KS1EncodeParam;
  })();

  ks1.KS1EncryptRequest = (function () {
    /**
     * Properties of a KS1EncryptRequest.
     * @memberof ks1
     * @interface IKS1EncryptRequest
     * @property {string} version KS1EncryptRequest version
     * @property {ks1.IKS1EncodeParam} params KS1EncryptRequest params
     * @property {string} type KS1EncryptRequest type
     * @property {string|null} [uid] KS1EncryptRequest uid
     */

    /**
     * Constructs a new KS1EncryptRequest.
     * @memberof ks1
     * @classdesc Represents a KS1EncryptRequest.
     * @implements IKS1EncryptRequest
     * @constructor
     * @param {ks1.IKS1EncryptRequest=} [properties] Properties to set
     */
    function KS1EncryptRequest(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * KS1EncryptRequest version.
     * @member {string} version
     * @memberof ks1.KS1EncryptRequest
     * @instance
     */
    KS1EncryptRequest.prototype.version = '';

    /**
     * KS1EncryptRequest params.
     * @member {ks1.IKS1EncodeParam} params
     * @memberof ks1.KS1EncryptRequest
     * @instance
     */
    KS1EncryptRequest.prototype.params = null;

    /**
     * KS1EncryptRequest type.
     * @member {string} type
     * @memberof ks1.KS1EncryptRequest
     * @instance
     */
    KS1EncryptRequest.prototype.type = '';

    /**
     * KS1EncryptRequest uid.
     * @member {string|null|undefined} uid
     * @memberof ks1.KS1EncryptRequest
     * @instance
     */
    KS1EncryptRequest.prototype.uid = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * KS1EncryptRequest _uid.
     * @member {"uid"|undefined} _uid
     * @memberof ks1.KS1EncryptRequest
     * @instance
     */
    Object.defineProperty(KS1EncryptRequest.prototype, '_uid', {
      get: $util.oneOfGetter(($oneOfFields = ['uid'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * Creates a new KS1EncryptRequest instance using the specified properties.
     * @function create
     * @memberof ks1.KS1EncryptRequest
     * @static
     * @param {ks1.IKS1EncryptRequest=} [properties] Properties to set
     * @returns {ks1.KS1EncryptRequest} KS1EncryptRequest instance
     */
    KS1EncryptRequest.create = function create(properties) {
      return new KS1EncryptRequest(properties);
    };

    /**
     * Encodes the specified KS1EncryptRequest message. Does not implicitly {@link ks1.KS1EncryptRequest.verify|verify} messages.
     * @function encode
     * @memberof ks1.KS1EncryptRequest
     * @static
     * @param {ks1.IKS1EncryptRequest} message KS1EncryptRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1EncryptRequest.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.version);
      $root.ks1.KS1EncodeParam.encode(
        message.params,
        writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
      ).ldelim();
      writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.type);
      if (message.uid != null && Object.hasOwnProperty.call(message, 'uid'))
        writer.uint32(/* id 4, wireType 2 =*/ 34).string(message.uid);
      return writer;
    };

    /**
     * Encodes the specified KS1EncryptRequest message, length delimited. Does not implicitly {@link ks1.KS1EncryptRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.KS1EncryptRequest
     * @static
     * @param {ks1.IKS1EncryptRequest} message KS1EncryptRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1EncryptRequest.encodeDelimited = function encodeDelimited(
      message,
      writer,
    ) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a KS1EncryptRequest message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.KS1EncryptRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.KS1EncryptRequest} KS1EncryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1EncryptRequest.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.KS1EncryptRequest();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.version = reader.string();
            break;
          case 2:
            message.params = $root.ks1.KS1EncodeParam.decode(
              reader,
              reader.uint32(),
            );
            break;
          case 3:
            message.type = reader.string();
            break;
          case 4:
            message.uid = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('version'))
        throw $util.ProtocolError("missing required 'version'", {
          instance: message,
        });
      if (!message.hasOwnProperty('params'))
        throw $util.ProtocolError("missing required 'params'", {
          instance: message,
        });
      if (!message.hasOwnProperty('type'))
        throw $util.ProtocolError("missing required 'type'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes a KS1EncryptRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.KS1EncryptRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.KS1EncryptRequest} KS1EncryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1EncryptRequest.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a KS1EncryptRequest message.
     * @function verify
     * @memberof ks1.KS1EncryptRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    KS1EncryptRequest.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      var properties = {};
      if (!$util.isString(message.version)) return 'version: string expected';
      {
        var error = $root.ks1.KS1EncodeParam.verify(message.params);
        if (error) return 'params.' + error;
      }
      if (!$util.isString(message.type)) return 'type: string expected';
      if (message.uid != null && message.hasOwnProperty('uid')) {
        properties._uid = 1;
        if (!$util.isString(message.uid)) return 'uid: string expected';
      }
      return null;
    };

    /**
     * Creates a KS1EncryptRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.KS1EncryptRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.KS1EncryptRequest} KS1EncryptRequest
     */
    KS1EncryptRequest.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.KS1EncryptRequest) return object;
      var message = new $root.ks1.KS1EncryptRequest();
      if (object.version != null) message.version = String(object.version);
      if (object.params != null) {
        if (typeof object.params !== 'object')
          throw TypeError('.ks1.KS1EncryptRequest.params: object expected');
        message.params = $root.ks1.KS1EncodeParam.fromObject(object.params);
      }
      if (object.type != null) message.type = String(object.type);
      if (object.uid != null) message.uid = String(object.uid);
      return message;
    };

    /**
     * Creates a plain object from a KS1EncryptRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.KS1EncryptRequest
     * @static
     * @param {ks1.KS1EncryptRequest} message KS1EncryptRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    KS1EncryptRequest.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) {
        object.version = '';
        object.params = null;
        object.type = '';
      }
      if (message.version != null && message.hasOwnProperty('version'))
        object.version = message.version;
      if (message.params != null && message.hasOwnProperty('params'))
        object.params = $root.ks1.KS1EncodeParam.toObject(
          message.params,
          options,
        );
      if (message.type != null && message.hasOwnProperty('type'))
        object.type = message.type;
      if (message.uid != null && message.hasOwnProperty('uid')) {
        object.uid = message.uid;
        if (options.oneofs) object._uid = 'uid';
      }
      return object;
    };

    /**
     * Converts this KS1EncryptRequest to JSON.
     * @function toJSON
     * @memberof ks1.KS1EncryptRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    KS1EncryptRequest.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return KS1EncryptRequest;
  })();

  ks1.KS1EncryptResponse = (function () {
    /**
     * Properties of a KS1EncryptResponse.
     * @memberof ks1
     * @interface IKS1EncryptResponse
     * @property {string} hash KS1EncryptResponse hash
     */

    /**
     * Constructs a new KS1EncryptResponse.
     * @memberof ks1
     * @classdesc Represents a KS1EncryptResponse.
     * @implements IKS1EncryptResponse
     * @constructor
     * @param {ks1.IKS1EncryptResponse=} [properties] Properties to set
     */
    function KS1EncryptResponse(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * KS1EncryptResponse hash.
     * @member {string} hash
     * @memberof ks1.KS1EncryptResponse
     * @instance
     */
    KS1EncryptResponse.prototype.hash = '';

    /**
     * Creates a new KS1EncryptResponse instance using the specified properties.
     * @function create
     * @memberof ks1.KS1EncryptResponse
     * @static
     * @param {ks1.IKS1EncryptResponse=} [properties] Properties to set
     * @returns {ks1.KS1EncryptResponse} KS1EncryptResponse instance
     */
    KS1EncryptResponse.create = function create(properties) {
      return new KS1EncryptResponse(properties);
    };

    /**
     * Encodes the specified KS1EncryptResponse message. Does not implicitly {@link ks1.KS1EncryptResponse.verify|verify} messages.
     * @function encode
     * @memberof ks1.KS1EncryptResponse
     * @static
     * @param {ks1.IKS1EncryptResponse} message KS1EncryptResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1EncryptResponse.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.hash);
      return writer;
    };

    /**
     * Encodes the specified KS1EncryptResponse message, length delimited. Does not implicitly {@link ks1.KS1EncryptResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.KS1EncryptResponse
     * @static
     * @param {ks1.IKS1EncryptResponse} message KS1EncryptResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1EncryptResponse.encodeDelimited = function encodeDelimited(
      message,
      writer,
    ) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a KS1EncryptResponse message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.KS1EncryptResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.KS1EncryptResponse} KS1EncryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1EncryptResponse.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.KS1EncryptResponse();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.hash = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('hash'))
        throw $util.ProtocolError("missing required 'hash'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes a KS1EncryptResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.KS1EncryptResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.KS1EncryptResponse} KS1EncryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1EncryptResponse.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a KS1EncryptResponse message.
     * @function verify
     * @memberof ks1.KS1EncryptResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    KS1EncryptResponse.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (!$util.isString(message.hash)) return 'hash: string expected';
      return null;
    };

    /**
     * Creates a KS1EncryptResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.KS1EncryptResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.KS1EncryptResponse} KS1EncryptResponse
     */
    KS1EncryptResponse.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.KS1EncryptResponse) return object;
      var message = new $root.ks1.KS1EncryptResponse();
      if (object.hash != null) message.hash = String(object.hash);
      return message;
    };

    /**
     * Creates a plain object from a KS1EncryptResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.KS1EncryptResponse
     * @static
     * @param {ks1.KS1EncryptResponse} message KS1EncryptResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    KS1EncryptResponse.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) object.hash = '';
      if (message.hash != null && message.hasOwnProperty('hash'))
        object.hash = message.hash;
      return object;
    };

    /**
     * Converts this KS1EncryptResponse to JSON.
     * @function toJSON
     * @memberof ks1.KS1EncryptResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    KS1EncryptResponse.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return KS1EncryptResponse;
  })();

  ks1.KS1DecryptRequest = (function () {
    /**
     * Properties of a KS1DecryptRequest.
     * @memberof ks1
     * @interface IKS1DecryptRequest
     * @property {string} version KS1DecryptRequest version
     * @property {string} hash KS1DecryptRequest hash
     * @property {string} type KS1DecryptRequest type
     */

    /**
     * Constructs a new KS1DecryptRequest.
     * @memberof ks1
     * @classdesc Represents a KS1DecryptRequest.
     * @implements IKS1DecryptRequest
     * @constructor
     * @param {ks1.IKS1DecryptRequest=} [properties] Properties to set
     */
    function KS1DecryptRequest(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * KS1DecryptRequest version.
     * @member {string} version
     * @memberof ks1.KS1DecryptRequest
     * @instance
     */
    KS1DecryptRequest.prototype.version = '';

    /**
     * KS1DecryptRequest hash.
     * @member {string} hash
     * @memberof ks1.KS1DecryptRequest
     * @instance
     */
    KS1DecryptRequest.prototype.hash = '';

    /**
     * KS1DecryptRequest type.
     * @member {string} type
     * @memberof ks1.KS1DecryptRequest
     * @instance
     */
    KS1DecryptRequest.prototype.type = '';

    /**
     * Creates a new KS1DecryptRequest instance using the specified properties.
     * @function create
     * @memberof ks1.KS1DecryptRequest
     * @static
     * @param {ks1.IKS1DecryptRequest=} [properties] Properties to set
     * @returns {ks1.KS1DecryptRequest} KS1DecryptRequest instance
     */
    KS1DecryptRequest.create = function create(properties) {
      return new KS1DecryptRequest(properties);
    };

    /**
     * Encodes the specified KS1DecryptRequest message. Does not implicitly {@link ks1.KS1DecryptRequest.verify|verify} messages.
     * @function encode
     * @memberof ks1.KS1DecryptRequest
     * @static
     * @param {ks1.IKS1DecryptRequest} message KS1DecryptRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1DecryptRequest.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.version);
      writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.hash);
      writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.type);
      return writer;
    };

    /**
     * Encodes the specified KS1DecryptRequest message, length delimited. Does not implicitly {@link ks1.KS1DecryptRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.KS1DecryptRequest
     * @static
     * @param {ks1.IKS1DecryptRequest} message KS1DecryptRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1DecryptRequest.encodeDelimited = function encodeDelimited(
      message,
      writer,
    ) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a KS1DecryptRequest message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.KS1DecryptRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.KS1DecryptRequest} KS1DecryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1DecryptRequest.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.KS1DecryptRequest();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.version = reader.string();
            break;
          case 2:
            message.hash = reader.string();
            break;
          case 3:
            message.type = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('version'))
        throw $util.ProtocolError("missing required 'version'", {
          instance: message,
        });
      if (!message.hasOwnProperty('hash'))
        throw $util.ProtocolError("missing required 'hash'", {
          instance: message,
        });
      if (!message.hasOwnProperty('type'))
        throw $util.ProtocolError("missing required 'type'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes a KS1DecryptRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.KS1DecryptRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.KS1DecryptRequest} KS1DecryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1DecryptRequest.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a KS1DecryptRequest message.
     * @function verify
     * @memberof ks1.KS1DecryptRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    KS1DecryptRequest.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (!$util.isString(message.version)) return 'version: string expected';
      if (!$util.isString(message.hash)) return 'hash: string expected';
      if (!$util.isString(message.type)) return 'type: string expected';
      return null;
    };

    /**
     * Creates a KS1DecryptRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.KS1DecryptRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.KS1DecryptRequest} KS1DecryptRequest
     */
    KS1DecryptRequest.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.KS1DecryptRequest) return object;
      var message = new $root.ks1.KS1DecryptRequest();
      if (object.version != null) message.version = String(object.version);
      if (object.hash != null) message.hash = String(object.hash);
      if (object.type != null) message.type = String(object.type);
      return message;
    };

    /**
     * Creates a plain object from a KS1DecryptRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.KS1DecryptRequest
     * @static
     * @param {ks1.KS1DecryptRequest} message KS1DecryptRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    KS1DecryptRequest.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) {
        object.version = '';
        object.hash = '';
        object.type = '';
      }
      if (message.version != null && message.hasOwnProperty('version'))
        object.version = message.version;
      if (message.hash != null && message.hasOwnProperty('hash'))
        object.hash = message.hash;
      if (message.type != null && message.hasOwnProperty('type'))
        object.type = message.type;
      return object;
    };

    /**
     * Converts this KS1DecryptRequest to JSON.
     * @function toJSON
     * @memberof ks1.KS1DecryptRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    KS1DecryptRequest.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return KS1DecryptRequest;
  })();

  ks1.KS1DecryptResponse = (function () {
    /**
     * Properties of a KS1DecryptResponse.
     * @memberof ks1
     * @interface IKS1DecryptResponse
     * @property {ks1.IDecryptResponse} decrypted KS1DecryptResponse decrypted
     * @property {ks1.IDecodeResponse|null} [decoded] KS1DecryptResponse decoded
     */

    /**
     * Constructs a new KS1DecryptResponse.
     * @memberof ks1
     * @classdesc Represents a KS1DecryptResponse.
     * @implements IKS1DecryptResponse
     * @constructor
     * @param {ks1.IKS1DecryptResponse=} [properties] Properties to set
     */
    function KS1DecryptResponse(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * KS1DecryptResponse decrypted.
     * @member {ks1.IDecryptResponse} decrypted
     * @memberof ks1.KS1DecryptResponse
     * @instance
     */
    KS1DecryptResponse.prototype.decrypted = null;

    /**
     * KS1DecryptResponse decoded.
     * @member {ks1.IDecodeResponse|null|undefined} decoded
     * @memberof ks1.KS1DecryptResponse
     * @instance
     */
    KS1DecryptResponse.prototype.decoded = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * KS1DecryptResponse _decoded.
     * @member {"decoded"|undefined} _decoded
     * @memberof ks1.KS1DecryptResponse
     * @instance
     */
    Object.defineProperty(KS1DecryptResponse.prototype, '_decoded', {
      get: $util.oneOfGetter(($oneOfFields = ['decoded'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * Creates a new KS1DecryptResponse instance using the specified properties.
     * @function create
     * @memberof ks1.KS1DecryptResponse
     * @static
     * @param {ks1.IKS1DecryptResponse=} [properties] Properties to set
     * @returns {ks1.KS1DecryptResponse} KS1DecryptResponse instance
     */
    KS1DecryptResponse.create = function create(properties) {
      return new KS1DecryptResponse(properties);
    };

    /**
     * Encodes the specified KS1DecryptResponse message. Does not implicitly {@link ks1.KS1DecryptResponse.verify|verify} messages.
     * @function encode
     * @memberof ks1.KS1DecryptResponse
     * @static
     * @param {ks1.IKS1DecryptResponse} message KS1DecryptResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1DecryptResponse.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      $root.ks1.DecryptResponse.encode(
        message.decrypted,
        writer.uint32(/* id 1, wireType 2 =*/ 10).fork(),
      ).ldelim();
      if (
        message.decoded != null &&
        Object.hasOwnProperty.call(message, 'decoded')
      )
        $root.ks1.DecodeResponse.encode(
          message.decoded,
          writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
        ).ldelim();
      return writer;
    };

    /**
     * Encodes the specified KS1DecryptResponse message, length delimited. Does not implicitly {@link ks1.KS1DecryptResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.KS1DecryptResponse
     * @static
     * @param {ks1.IKS1DecryptResponse} message KS1DecryptResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KS1DecryptResponse.encodeDelimited = function encodeDelimited(
      message,
      writer,
    ) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a KS1DecryptResponse message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.KS1DecryptResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.KS1DecryptResponse} KS1DecryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1DecryptResponse.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.KS1DecryptResponse();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.decrypted = $root.ks1.DecryptResponse.decode(
              reader,
              reader.uint32(),
            );
            break;
          case 2:
            message.decoded = $root.ks1.DecodeResponse.decode(
              reader,
              reader.uint32(),
            );
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('decrypted'))
        throw $util.ProtocolError("missing required 'decrypted'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes a KS1DecryptResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.KS1DecryptResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.KS1DecryptResponse} KS1DecryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KS1DecryptResponse.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a KS1DecryptResponse message.
     * @function verify
     * @memberof ks1.KS1DecryptResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    KS1DecryptResponse.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      var properties = {};
      {
        var error = $root.ks1.DecryptResponse.verify(message.decrypted);
        if (error) return 'decrypted.' + error;
      }
      if (message.decoded != null && message.hasOwnProperty('decoded')) {
        properties._decoded = 1;
        {
          var error = $root.ks1.DecodeResponse.verify(message.decoded);
          if (error) return 'decoded.' + error;
        }
      }
      return null;
    };

    /**
     * Creates a KS1DecryptResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.KS1DecryptResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.KS1DecryptResponse} KS1DecryptResponse
     */
    KS1DecryptResponse.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.KS1DecryptResponse) return object;
      var message = new $root.ks1.KS1DecryptResponse();
      if (object.decrypted != null) {
        if (typeof object.decrypted !== 'object')
          throw TypeError('.ks1.KS1DecryptResponse.decrypted: object expected');
        message.decrypted = $root.ks1.DecryptResponse.fromObject(
          object.decrypted,
        );
      }
      if (object.decoded != null) {
        if (typeof object.decoded !== 'object')
          throw TypeError('.ks1.KS1DecryptResponse.decoded: object expected');
        message.decoded = $root.ks1.DecodeResponse.fromObject(object.decoded);
      }
      return message;
    };

    /**
     * Creates a plain object from a KS1DecryptResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.KS1DecryptResponse
     * @static
     * @param {ks1.KS1DecryptResponse} message KS1DecryptResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    KS1DecryptResponse.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) object.decrypted = null;
      if (message.decrypted != null && message.hasOwnProperty('decrypted'))
        object.decrypted = $root.ks1.DecryptResponse.toObject(
          message.decrypted,
          options,
        );
      if (message.decoded != null && message.hasOwnProperty('decoded')) {
        object.decoded = $root.ks1.DecodeResponse.toObject(
          message.decoded,
          options,
        );
        if (options.oneofs) object._decoded = 'decoded';
      }
      return object;
    };

    /**
     * Converts this KS1DecryptResponse to JSON.
     * @function toJSON
     * @memberof ks1.KS1DecryptResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    KS1DecryptResponse.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return KS1DecryptResponse;
  })();

  ks1.EncryptParam = (function () {
    /**
     * Properties of an EncryptParam.
     * @memberof ks1
     * @interface IEncryptParam
     * @property {string} txId EncryptParam txId
     * @property {string|null} [uid] EncryptParam uid
     */

    /**
     * Constructs a new EncryptParam.
     * @memberof ks1
     * @classdesc Represents an EncryptParam.
     * @implements IEncryptParam
     * @constructor
     * @param {ks1.IEncryptParam=} [properties] Properties to set
     */
    function EncryptParam(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * EncryptParam txId.
     * @member {string} txId
     * @memberof ks1.EncryptParam
     * @instance
     */
    EncryptParam.prototype.txId = '';

    /**
     * EncryptParam uid.
     * @member {string|null|undefined} uid
     * @memberof ks1.EncryptParam
     * @instance
     */
    EncryptParam.prototype.uid = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * EncryptParam _uid.
     * @member {"uid"|undefined} _uid
     * @memberof ks1.EncryptParam
     * @instance
     */
    Object.defineProperty(EncryptParam.prototype, '_uid', {
      get: $util.oneOfGetter(($oneOfFields = ['uid'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * Creates a new EncryptParam instance using the specified properties.
     * @function create
     * @memberof ks1.EncryptParam
     * @static
     * @param {ks1.IEncryptParam=} [properties] Properties to set
     * @returns {ks1.EncryptParam} EncryptParam instance
     */
    EncryptParam.create = function create(properties) {
      return new EncryptParam(properties);
    };

    /**
     * Encodes the specified EncryptParam message. Does not implicitly {@link ks1.EncryptParam.verify|verify} messages.
     * @function encode
     * @memberof ks1.EncryptParam
     * @static
     * @param {ks1.IEncryptParam} message EncryptParam message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EncryptParam.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.txId);
      if (message.uid != null && Object.hasOwnProperty.call(message, 'uid'))
        writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.uid);
      return writer;
    };

    /**
     * Encodes the specified EncryptParam message, length delimited. Does not implicitly {@link ks1.EncryptParam.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.EncryptParam
     * @static
     * @param {ks1.IEncryptParam} message EncryptParam message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EncryptParam.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an EncryptParam message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.EncryptParam
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.EncryptParam} EncryptParam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EncryptParam.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.EncryptParam();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.txId = reader.string();
            break;
          case 2:
            message.uid = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('txId'))
        throw $util.ProtocolError("missing required 'txId'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes an EncryptParam message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.EncryptParam
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.EncryptParam} EncryptParam
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EncryptParam.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an EncryptParam message.
     * @function verify
     * @memberof ks1.EncryptParam
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    EncryptParam.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      var properties = {};
      if (!$util.isString(message.txId)) return 'txId: string expected';
      if (message.uid != null && message.hasOwnProperty('uid')) {
        properties._uid = 1;
        if (!$util.isString(message.uid)) return 'uid: string expected';
      }
      return null;
    };

    /**
     * Creates an EncryptParam message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.EncryptParam
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.EncryptParam} EncryptParam
     */
    EncryptParam.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.EncryptParam) return object;
      var message = new $root.ks1.EncryptParam();
      if (object.txId != null) message.txId = String(object.txId);
      if (object.uid != null) message.uid = String(object.uid);
      return message;
    };

    /**
     * Creates a plain object from an EncryptParam message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.EncryptParam
     * @static
     * @param {ks1.EncryptParam} message EncryptParam
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    EncryptParam.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) object.txId = '';
      if (message.txId != null && message.hasOwnProperty('txId'))
        object.txId = message.txId;
      if (message.uid != null && message.hasOwnProperty('uid')) {
        object.uid = message.uid;
        if (options.oneofs) object._uid = 'uid';
      }
      return object;
    };

    /**
     * Converts this EncryptParam to JSON.
     * @function toJSON
     * @memberof ks1.EncryptParam
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    EncryptParam.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return EncryptParam;
  })();

  ks1.EncryptRequest = (function () {
    /**
     * Properties of an EncryptRequest.
     * @memberof ks1
     * @interface IEncryptRequest
     * @property {string} version EncryptRequest version
     * @property {ks1.IEncryptParam} params EncryptRequest params
     * @property {string} type EncryptRequest type
     */

    /**
     * Constructs a new EncryptRequest.
     * @memberof ks1
     * @classdesc Represents an EncryptRequest.
     * @implements IEncryptRequest
     * @constructor
     * @param {ks1.IEncryptRequest=} [properties] Properties to set
     */
    function EncryptRequest(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * EncryptRequest version.
     * @member {string} version
     * @memberof ks1.EncryptRequest
     * @instance
     */
    EncryptRequest.prototype.version = '';

    /**
     * EncryptRequest params.
     * @member {ks1.IEncryptParam} params
     * @memberof ks1.EncryptRequest
     * @instance
     */
    EncryptRequest.prototype.params = null;

    /**
     * EncryptRequest type.
     * @member {string} type
     * @memberof ks1.EncryptRequest
     * @instance
     */
    EncryptRequest.prototype.type = '';

    /**
     * Creates a new EncryptRequest instance using the specified properties.
     * @function create
     * @memberof ks1.EncryptRequest
     * @static
     * @param {ks1.IEncryptRequest=} [properties] Properties to set
     * @returns {ks1.EncryptRequest} EncryptRequest instance
     */
    EncryptRequest.create = function create(properties) {
      return new EncryptRequest(properties);
    };

    /**
     * Encodes the specified EncryptRequest message. Does not implicitly {@link ks1.EncryptRequest.verify|verify} messages.
     * @function encode
     * @memberof ks1.EncryptRequest
     * @static
     * @param {ks1.IEncryptRequest} message EncryptRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EncryptRequest.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.version);
      $root.ks1.EncryptParam.encode(
        message.params,
        writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
      ).ldelim();
      writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.type);
      return writer;
    };

    /**
     * Encodes the specified EncryptRequest message, length delimited. Does not implicitly {@link ks1.EncryptRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.EncryptRequest
     * @static
     * @param {ks1.IEncryptRequest} message EncryptRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EncryptRequest.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an EncryptRequest message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.EncryptRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.EncryptRequest} EncryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EncryptRequest.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.EncryptRequest();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.version = reader.string();
            break;
          case 2:
            message.params = $root.ks1.EncryptParam.decode(
              reader,
              reader.uint32(),
            );
            break;
          case 3:
            message.type = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('version'))
        throw $util.ProtocolError("missing required 'version'", {
          instance: message,
        });
      if (!message.hasOwnProperty('params'))
        throw $util.ProtocolError("missing required 'params'", {
          instance: message,
        });
      if (!message.hasOwnProperty('type'))
        throw $util.ProtocolError("missing required 'type'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes an EncryptRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.EncryptRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.EncryptRequest} EncryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EncryptRequest.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an EncryptRequest message.
     * @function verify
     * @memberof ks1.EncryptRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    EncryptRequest.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (!$util.isString(message.version)) return 'version: string expected';
      {
        var error = $root.ks1.EncryptParam.verify(message.params);
        if (error) return 'params.' + error;
      }
      if (!$util.isString(message.type)) return 'type: string expected';
      return null;
    };

    /**
     * Creates an EncryptRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.EncryptRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.EncryptRequest} EncryptRequest
     */
    EncryptRequest.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.EncryptRequest) return object;
      var message = new $root.ks1.EncryptRequest();
      if (object.version != null) message.version = String(object.version);
      if (object.params != null) {
        if (typeof object.params !== 'object')
          throw TypeError('.ks1.EncryptRequest.params: object expected');
        message.params = $root.ks1.EncryptParam.fromObject(object.params);
      }
      if (object.type != null) message.type = String(object.type);
      return message;
    };

    /**
     * Creates a plain object from an EncryptRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.EncryptRequest
     * @static
     * @param {ks1.EncryptRequest} message EncryptRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    EncryptRequest.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) {
        object.version = '';
        object.params = null;
        object.type = '';
      }
      if (message.version != null && message.hasOwnProperty('version'))
        object.version = message.version;
      if (message.params != null && message.hasOwnProperty('params'))
        object.params = $root.ks1.EncryptParam.toObject(
          message.params,
          options,
        );
      if (message.type != null && message.hasOwnProperty('type'))
        object.type = message.type;
      return object;
    };

    /**
     * Converts this EncryptRequest to JSON.
     * @function toJSON
     * @memberof ks1.EncryptRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    EncryptRequest.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return EncryptRequest;
  })();

  ks1.EncryptResponse = (function () {
    /**
     * Properties of an EncryptResponse.
     * @memberof ks1
     * @interface IEncryptResponse
     * @property {string} hash EncryptResponse hash
     */

    /**
     * Constructs a new EncryptResponse.
     * @memberof ks1
     * @classdesc Represents an EncryptResponse.
     * @implements IEncryptResponse
     * @constructor
     * @param {ks1.IEncryptResponse=} [properties] Properties to set
     */
    function EncryptResponse(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * EncryptResponse hash.
     * @member {string} hash
     * @memberof ks1.EncryptResponse
     * @instance
     */
    EncryptResponse.prototype.hash = '';

    /**
     * Creates a new EncryptResponse instance using the specified properties.
     * @function create
     * @memberof ks1.EncryptResponse
     * @static
     * @param {ks1.IEncryptResponse=} [properties] Properties to set
     * @returns {ks1.EncryptResponse} EncryptResponse instance
     */
    EncryptResponse.create = function create(properties) {
      return new EncryptResponse(properties);
    };

    /**
     * Encodes the specified EncryptResponse message. Does not implicitly {@link ks1.EncryptResponse.verify|verify} messages.
     * @function encode
     * @memberof ks1.EncryptResponse
     * @static
     * @param {ks1.IEncryptResponse} message EncryptResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EncryptResponse.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.hash);
      return writer;
    };

    /**
     * Encodes the specified EncryptResponse message, length delimited. Does not implicitly {@link ks1.EncryptResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.EncryptResponse
     * @static
     * @param {ks1.IEncryptResponse} message EncryptResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EncryptResponse.encodeDelimited = function encodeDelimited(
      message,
      writer,
    ) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an EncryptResponse message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.EncryptResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.EncryptResponse} EncryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EncryptResponse.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.EncryptResponse();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.hash = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('hash'))
        throw $util.ProtocolError("missing required 'hash'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes an EncryptResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.EncryptResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.EncryptResponse} EncryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EncryptResponse.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an EncryptResponse message.
     * @function verify
     * @memberof ks1.EncryptResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    EncryptResponse.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (!$util.isString(message.hash)) return 'hash: string expected';
      return null;
    };

    /**
     * Creates an EncryptResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.EncryptResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.EncryptResponse} EncryptResponse
     */
    EncryptResponse.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.EncryptResponse) return object;
      var message = new $root.ks1.EncryptResponse();
      if (object.hash != null) message.hash = String(object.hash);
      return message;
    };

    /**
     * Creates a plain object from an EncryptResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.EncryptResponse
     * @static
     * @param {ks1.EncryptResponse} message EncryptResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    EncryptResponse.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) object.hash = '';
      if (message.hash != null && message.hasOwnProperty('hash'))
        object.hash = message.hash;
      return object;
    };

    /**
     * Converts this EncryptResponse to JSON.
     * @function toJSON
     * @memberof ks1.EncryptResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    EncryptResponse.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return EncryptResponse;
  })();

  ks1.DecryptRequest = (function () {
    /**
     * Properties of a DecryptRequest.
     * @memberof ks1
     * @interface IDecryptRequest
     * @property {string} version DecryptRequest version
     * @property {string} hash DecryptRequest hash
     * @property {string} type DecryptRequest type
     */

    /**
     * Constructs a new DecryptRequest.
     * @memberof ks1
     * @classdesc Represents a DecryptRequest.
     * @implements IDecryptRequest
     * @constructor
     * @param {ks1.IDecryptRequest=} [properties] Properties to set
     */
    function DecryptRequest(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * DecryptRequest version.
     * @member {string} version
     * @memberof ks1.DecryptRequest
     * @instance
     */
    DecryptRequest.prototype.version = '';

    /**
     * DecryptRequest hash.
     * @member {string} hash
     * @memberof ks1.DecryptRequest
     * @instance
     */
    DecryptRequest.prototype.hash = '';

    /**
     * DecryptRequest type.
     * @member {string} type
     * @memberof ks1.DecryptRequest
     * @instance
     */
    DecryptRequest.prototype.type = '';

    /**
     * Creates a new DecryptRequest instance using the specified properties.
     * @function create
     * @memberof ks1.DecryptRequest
     * @static
     * @param {ks1.IDecryptRequest=} [properties] Properties to set
     * @returns {ks1.DecryptRequest} DecryptRequest instance
     */
    DecryptRequest.create = function create(properties) {
      return new DecryptRequest(properties);
    };

    /**
     * Encodes the specified DecryptRequest message. Does not implicitly {@link ks1.DecryptRequest.verify|verify} messages.
     * @function encode
     * @memberof ks1.DecryptRequest
     * @static
     * @param {ks1.IDecryptRequest} message DecryptRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DecryptRequest.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.version);
      writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.hash);
      writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.type);
      return writer;
    };

    /**
     * Encodes the specified DecryptRequest message, length delimited. Does not implicitly {@link ks1.DecryptRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.DecryptRequest
     * @static
     * @param {ks1.IDecryptRequest} message DecryptRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DecryptRequest.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DecryptRequest message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.DecryptRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.DecryptRequest} DecryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DecryptRequest.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.DecryptRequest();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.version = reader.string();
            break;
          case 2:
            message.hash = reader.string();
            break;
          case 3:
            message.type = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('version'))
        throw $util.ProtocolError("missing required 'version'", {
          instance: message,
        });
      if (!message.hasOwnProperty('hash'))
        throw $util.ProtocolError("missing required 'hash'", {
          instance: message,
        });
      if (!message.hasOwnProperty('type'))
        throw $util.ProtocolError("missing required 'type'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes a DecryptRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.DecryptRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.DecryptRequest} DecryptRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DecryptRequest.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DecryptRequest message.
     * @function verify
     * @memberof ks1.DecryptRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DecryptRequest.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (!$util.isString(message.version)) return 'version: string expected';
      if (!$util.isString(message.hash)) return 'hash: string expected';
      if (!$util.isString(message.type)) return 'type: string expected';
      return null;
    };

    /**
     * Creates a DecryptRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.DecryptRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.DecryptRequest} DecryptRequest
     */
    DecryptRequest.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.DecryptRequest) return object;
      var message = new $root.ks1.DecryptRequest();
      if (object.version != null) message.version = String(object.version);
      if (object.hash != null) message.hash = String(object.hash);
      if (object.type != null) message.type = String(object.type);
      return message;
    };

    /**
     * Creates a plain object from a DecryptRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.DecryptRequest
     * @static
     * @param {ks1.DecryptRequest} message DecryptRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DecryptRequest.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) {
        object.version = '';
        object.hash = '';
        object.type = '';
      }
      if (message.version != null && message.hasOwnProperty('version'))
        object.version = message.version;
      if (message.hash != null && message.hasOwnProperty('hash'))
        object.hash = message.hash;
      if (message.type != null && message.hasOwnProperty('type'))
        object.type = message.type;
      return object;
    };

    /**
     * Converts this DecryptRequest to JSON.
     * @function toJSON
     * @memberof ks1.DecryptRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DecryptRequest.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return DecryptRequest;
  })();

  ks1.DecryptResponse = (function () {
    /**
     * Properties of a DecryptResponse.
     * @memberof ks1
     * @interface IDecryptResponse
     * @property {string} status DecryptResponse status
     * @property {string} errorCode DecryptResponse errorCode
     * @property {string|null} [metaData] DecryptResponse metaData
     * @property {string|null} [isTampered] DecryptResponse isTampered
     * @property {boolean|null} [isTamperTag] DecryptResponse isTamperTag
     * @property {string|null} [tapCount] DecryptResponse tapCount
     * @property {string} txId DecryptResponse txId
     * @property {string|null} [uid] DecryptResponse uid
     * @property {string} originalHash DecryptResponse originalHash
     */

    /**
     * Constructs a new DecryptResponse.
     * @memberof ks1
     * @classdesc Represents a DecryptResponse.
     * @implements IDecryptResponse
     * @constructor
     * @param {ks1.IDecryptResponse=} [properties] Properties to set
     */
    function DecryptResponse(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * DecryptResponse status.
     * @member {string} status
     * @memberof ks1.DecryptResponse
     * @instance
     */
    DecryptResponse.prototype.status = '';

    /**
     * DecryptResponse errorCode.
     * @member {string} errorCode
     * @memberof ks1.DecryptResponse
     * @instance
     */
    DecryptResponse.prototype.errorCode = '';

    /**
     * DecryptResponse metaData.
     * @member {string|null|undefined} metaData
     * @memberof ks1.DecryptResponse
     * @instance
     */
    DecryptResponse.prototype.metaData = null;

    /**
     * DecryptResponse isTampered.
     * @member {string|null|undefined} isTampered
     * @memberof ks1.DecryptResponse
     * @instance
     */
    DecryptResponse.prototype.isTampered = null;

    /**
     * DecryptResponse isTamperTag.
     * @member {boolean|null|undefined} isTamperTag
     * @memberof ks1.DecryptResponse
     * @instance
     */
    DecryptResponse.prototype.isTamperTag = null;

    /**
     * DecryptResponse tapCount.
     * @member {string|null|undefined} tapCount
     * @memberof ks1.DecryptResponse
     * @instance
     */
    DecryptResponse.prototype.tapCount = null;

    /**
     * DecryptResponse txId.
     * @member {string} txId
     * @memberof ks1.DecryptResponse
     * @instance
     */
    DecryptResponse.prototype.txId = '';

    /**
     * DecryptResponse uid.
     * @member {string|null|undefined} uid
     * @memberof ks1.DecryptResponse
     * @instance
     */
    DecryptResponse.prototype.uid = null;

    /**
     * DecryptResponse originalHash.
     * @member {string} originalHash
     * @memberof ks1.DecryptResponse
     * @instance
     */
    DecryptResponse.prototype.originalHash = '';

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * DecryptResponse _metaData.
     * @member {"metaData"|undefined} _metaData
     * @memberof ks1.DecryptResponse
     * @instance
     */
    Object.defineProperty(DecryptResponse.prototype, '_metaData', {
      get: $util.oneOfGetter(($oneOfFields = ['metaData'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * DecryptResponse _isTampered.
     * @member {"isTampered"|undefined} _isTampered
     * @memberof ks1.DecryptResponse
     * @instance
     */
    Object.defineProperty(DecryptResponse.prototype, '_isTampered', {
      get: $util.oneOfGetter(($oneOfFields = ['isTampered'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * DecryptResponse _isTamperTag.
     * @member {"isTamperTag"|undefined} _isTamperTag
     * @memberof ks1.DecryptResponse
     * @instance
     */
    Object.defineProperty(DecryptResponse.prototype, '_isTamperTag', {
      get: $util.oneOfGetter(($oneOfFields = ['isTamperTag'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * DecryptResponse _tapCount.
     * @member {"tapCount"|undefined} _tapCount
     * @memberof ks1.DecryptResponse
     * @instance
     */
    Object.defineProperty(DecryptResponse.prototype, '_tapCount', {
      get: $util.oneOfGetter(($oneOfFields = ['tapCount'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * DecryptResponse _uid.
     * @member {"uid"|undefined} _uid
     * @memberof ks1.DecryptResponse
     * @instance
     */
    Object.defineProperty(DecryptResponse.prototype, '_uid', {
      get: $util.oneOfGetter(($oneOfFields = ['uid'])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * Creates a new DecryptResponse instance using the specified properties.
     * @function create
     * @memberof ks1.DecryptResponse
     * @static
     * @param {ks1.IDecryptResponse=} [properties] Properties to set
     * @returns {ks1.DecryptResponse} DecryptResponse instance
     */
    DecryptResponse.create = function create(properties) {
      return new DecryptResponse(properties);
    };

    /**
     * Encodes the specified DecryptResponse message. Does not implicitly {@link ks1.DecryptResponse.verify|verify} messages.
     * @function encode
     * @memberof ks1.DecryptResponse
     * @static
     * @param {ks1.IDecryptResponse} message DecryptResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DecryptResponse.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.status);
      writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.errorCode);
      if (
        message.metaData != null &&
        Object.hasOwnProperty.call(message, 'metaData')
      )
        writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.metaData);
      if (
        message.isTampered != null &&
        Object.hasOwnProperty.call(message, 'isTampered')
      )
        writer.uint32(/* id 4, wireType 2 =*/ 34).string(message.isTampered);
      if (
        message.isTamperTag != null &&
        Object.hasOwnProperty.call(message, 'isTamperTag')
      )
        writer.uint32(/* id 5, wireType 0 =*/ 40).bool(message.isTamperTag);
      if (
        message.tapCount != null &&
        Object.hasOwnProperty.call(message, 'tapCount')
      )
        writer.uint32(/* id 6, wireType 2 =*/ 50).string(message.tapCount);
      writer.uint32(/* id 7, wireType 2 =*/ 58).string(message.txId);
      if (message.uid != null && Object.hasOwnProperty.call(message, 'uid'))
        writer.uint32(/* id 8, wireType 2 =*/ 66).string(message.uid);
      writer.uint32(/* id 9, wireType 2 =*/ 74).string(message.originalHash);
      return writer;
    };

    /**
     * Encodes the specified DecryptResponse message, length delimited. Does not implicitly {@link ks1.DecryptResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.DecryptResponse
     * @static
     * @param {ks1.IDecryptResponse} message DecryptResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DecryptResponse.encodeDelimited = function encodeDelimited(
      message,
      writer,
    ) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DecryptResponse message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.DecryptResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.DecryptResponse} DecryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DecryptResponse.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.DecryptResponse();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.status = reader.string();
            break;
          case 2:
            message.errorCode = reader.string();
            break;
          case 3:
            message.metaData = reader.string();
            break;
          case 4:
            message.isTampered = reader.string();
            break;
          case 5:
            message.isTamperTag = reader.bool();
            break;
          case 6:
            message.tapCount = reader.string();
            break;
          case 7:
            message.txId = reader.string();
            break;
          case 8:
            message.uid = reader.string();
            break;
          case 9:
            message.originalHash = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('status'))
        throw $util.ProtocolError("missing required 'status'", {
          instance: message,
        });
      if (!message.hasOwnProperty('errorCode'))
        throw $util.ProtocolError("missing required 'errorCode'", {
          instance: message,
        });
      if (!message.hasOwnProperty('txId'))
        throw $util.ProtocolError("missing required 'txId'", {
          instance: message,
        });
      if (!message.hasOwnProperty('originalHash'))
        throw $util.ProtocolError("missing required 'originalHash'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes a DecryptResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.DecryptResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.DecryptResponse} DecryptResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DecryptResponse.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DecryptResponse message.
     * @function verify
     * @memberof ks1.DecryptResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DecryptResponse.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      var properties = {};
      if (!$util.isString(message.status)) return 'status: string expected';
      if (!$util.isString(message.errorCode))
        return 'errorCode: string expected';
      if (message.metaData != null && message.hasOwnProperty('metaData')) {
        properties._metaData = 1;
        if (!$util.isString(message.metaData))
          return 'metaData: string expected';
      }
      if (message.isTampered != null && message.hasOwnProperty('isTampered')) {
        properties._isTampered = 1;
        if (!$util.isString(message.isTampered))
          return 'isTampered: string expected';
      }
      if (
        message.isTamperTag != null &&
        message.hasOwnProperty('isTamperTag')
      ) {
        properties._isTamperTag = 1;
        if (typeof message.isTamperTag !== 'boolean')
          return 'isTamperTag: boolean expected';
      }
      if (message.tapCount != null && message.hasOwnProperty('tapCount')) {
        properties._tapCount = 1;
        if (!$util.isString(message.tapCount))
          return 'tapCount: string expected';
      }
      if (!$util.isString(message.txId)) return 'txId: string expected';
      if (message.uid != null && message.hasOwnProperty('uid')) {
        properties._uid = 1;
        if (!$util.isString(message.uid)) return 'uid: string expected';
      }
      if (!$util.isString(message.originalHash))
        return 'originalHash: string expected';
      return null;
    };

    /**
     * Creates a DecryptResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.DecryptResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.DecryptResponse} DecryptResponse
     */
    DecryptResponse.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.DecryptResponse) return object;
      var message = new $root.ks1.DecryptResponse();
      if (object.status != null) message.status = String(object.status);
      if (object.errorCode != null)
        message.errorCode = String(object.errorCode);
      if (object.metaData != null) message.metaData = String(object.metaData);
      if (object.isTampered != null)
        message.isTampered = String(object.isTampered);
      if (object.isTamperTag != null)
        message.isTamperTag = Boolean(object.isTamperTag);
      if (object.tapCount != null) message.tapCount = String(object.tapCount);
      if (object.txId != null) message.txId = String(object.txId);
      if (object.uid != null) message.uid = String(object.uid);
      if (object.originalHash != null)
        message.originalHash = String(object.originalHash);
      return message;
    };

    /**
     * Creates a plain object from a DecryptResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.DecryptResponse
     * @static
     * @param {ks1.DecryptResponse} message DecryptResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DecryptResponse.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) {
        object.status = '';
        object.errorCode = '';
        object.txId = '';
        object.originalHash = '';
      }
      if (message.status != null && message.hasOwnProperty('status'))
        object.status = message.status;
      if (message.errorCode != null && message.hasOwnProperty('errorCode'))
        object.errorCode = message.errorCode;
      if (message.metaData != null && message.hasOwnProperty('metaData')) {
        object.metaData = message.metaData;
        if (options.oneofs) object._metaData = 'metaData';
      }
      if (message.isTampered != null && message.hasOwnProperty('isTampered')) {
        object.isTampered = message.isTampered;
        if (options.oneofs) object._isTampered = 'isTampered';
      }
      if (
        message.isTamperTag != null &&
        message.hasOwnProperty('isTamperTag')
      ) {
        object.isTamperTag = message.isTamperTag;
        if (options.oneofs) object._isTamperTag = 'isTamperTag';
      }
      if (message.tapCount != null && message.hasOwnProperty('tapCount')) {
        object.tapCount = message.tapCount;
        if (options.oneofs) object._tapCount = 'tapCount';
      }
      if (message.txId != null && message.hasOwnProperty('txId'))
        object.txId = message.txId;
      if (message.uid != null && message.hasOwnProperty('uid')) {
        object.uid = message.uid;
        if (options.oneofs) object._uid = 'uid';
      }
      if (
        message.originalHash != null &&
        message.hasOwnProperty('originalHash')
      )
        object.originalHash = message.originalHash;
      return object;
    };

    /**
     * Converts this DecryptResponse to JSON.
     * @function toJSON
     * @memberof ks1.DecryptResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DecryptResponse.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return DecryptResponse;
  })();

  ks1.EncodeRequest = (function () {
    /**
     * Properties of an EncodeRequest.
     * @memberof ks1
     * @interface IEncodeRequest
     * @property {string} version EncodeRequest version
     * @property {ks1.IKS1EncodeParam} params EncodeRequest params
     */

    /**
     * Constructs a new EncodeRequest.
     * @memberof ks1
     * @classdesc Represents an EncodeRequest.
     * @implements IEncodeRequest
     * @constructor
     * @param {ks1.IEncodeRequest=} [properties] Properties to set
     */
    function EncodeRequest(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * EncodeRequest version.
     * @member {string} version
     * @memberof ks1.EncodeRequest
     * @instance
     */
    EncodeRequest.prototype.version = '';

    /**
     * EncodeRequest params.
     * @member {ks1.IKS1EncodeParam} params
     * @memberof ks1.EncodeRequest
     * @instance
     */
    EncodeRequest.prototype.params = null;

    /**
     * Creates a new EncodeRequest instance using the specified properties.
     * @function create
     * @memberof ks1.EncodeRequest
     * @static
     * @param {ks1.IEncodeRequest=} [properties] Properties to set
     * @returns {ks1.EncodeRequest} EncodeRequest instance
     */
    EncodeRequest.create = function create(properties) {
      return new EncodeRequest(properties);
    };

    /**
     * Encodes the specified EncodeRequest message. Does not implicitly {@link ks1.EncodeRequest.verify|verify} messages.
     * @function encode
     * @memberof ks1.EncodeRequest
     * @static
     * @param {ks1.IEncodeRequest} message EncodeRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EncodeRequest.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.version);
      $root.ks1.KS1EncodeParam.encode(
        message.params,
        writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
      ).ldelim();
      return writer;
    };

    /**
     * Encodes the specified EncodeRequest message, length delimited. Does not implicitly {@link ks1.EncodeRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.EncodeRequest
     * @static
     * @param {ks1.IEncodeRequest} message EncodeRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EncodeRequest.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an EncodeRequest message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.EncodeRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.EncodeRequest} EncodeRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EncodeRequest.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.EncodeRequest();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.version = reader.string();
            break;
          case 2:
            message.params = $root.ks1.KS1EncodeParam.decode(
              reader,
              reader.uint32(),
            );
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('version'))
        throw $util.ProtocolError("missing required 'version'", {
          instance: message,
        });
      if (!message.hasOwnProperty('params'))
        throw $util.ProtocolError("missing required 'params'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes an EncodeRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.EncodeRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.EncodeRequest} EncodeRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EncodeRequest.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an EncodeRequest message.
     * @function verify
     * @memberof ks1.EncodeRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    EncodeRequest.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (!$util.isString(message.version)) return 'version: string expected';
      {
        var error = $root.ks1.KS1EncodeParam.verify(message.params);
        if (error) return 'params.' + error;
      }
      return null;
    };

    /**
     * Creates an EncodeRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.EncodeRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.EncodeRequest} EncodeRequest
     */
    EncodeRequest.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.EncodeRequest) return object;
      var message = new $root.ks1.EncodeRequest();
      if (object.version != null) message.version = String(object.version);
      if (object.params != null) {
        if (typeof object.params !== 'object')
          throw TypeError('.ks1.EncodeRequest.params: object expected');
        message.params = $root.ks1.KS1EncodeParam.fromObject(object.params);
      }
      return message;
    };

    /**
     * Creates a plain object from an EncodeRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.EncodeRequest
     * @static
     * @param {ks1.EncodeRequest} message EncodeRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    EncodeRequest.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) {
        object.version = '';
        object.params = null;
      }
      if (message.version != null && message.hasOwnProperty('version'))
        object.version = message.version;
      if (message.params != null && message.hasOwnProperty('params'))
        object.params = $root.ks1.KS1EncodeParam.toObject(
          message.params,
          options,
        );
      return object;
    };

    /**
     * Converts this EncodeRequest to JSON.
     * @function toJSON
     * @memberof ks1.EncodeRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    EncodeRequest.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return EncodeRequest;
  })();

  ks1.EncodeResponse = (function () {
    /**
     * Properties of an EncodeResponse.
     * @memberof ks1
     * @interface IEncodeResponse
     * @property {string} hash EncodeResponse hash
     */

    /**
     * Constructs a new EncodeResponse.
     * @memberof ks1
     * @classdesc Represents an EncodeResponse.
     * @implements IEncodeResponse
     * @constructor
     * @param {ks1.IEncodeResponse=} [properties] Properties to set
     */
    function EncodeResponse(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * EncodeResponse hash.
     * @member {string} hash
     * @memberof ks1.EncodeResponse
     * @instance
     */
    EncodeResponse.prototype.hash = '';

    /**
     * Creates a new EncodeResponse instance using the specified properties.
     * @function create
     * @memberof ks1.EncodeResponse
     * @static
     * @param {ks1.IEncodeResponse=} [properties] Properties to set
     * @returns {ks1.EncodeResponse} EncodeResponse instance
     */
    EncodeResponse.create = function create(properties) {
      return new EncodeResponse(properties);
    };

    /**
     * Encodes the specified EncodeResponse message. Does not implicitly {@link ks1.EncodeResponse.verify|verify} messages.
     * @function encode
     * @memberof ks1.EncodeResponse
     * @static
     * @param {ks1.IEncodeResponse} message EncodeResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EncodeResponse.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.hash);
      return writer;
    };

    /**
     * Encodes the specified EncodeResponse message, length delimited. Does not implicitly {@link ks1.EncodeResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.EncodeResponse
     * @static
     * @param {ks1.IEncodeResponse} message EncodeResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EncodeResponse.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an EncodeResponse message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.EncodeResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.EncodeResponse} EncodeResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EncodeResponse.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.EncodeResponse();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.hash = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('hash'))
        throw $util.ProtocolError("missing required 'hash'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes an EncodeResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.EncodeResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.EncodeResponse} EncodeResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EncodeResponse.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an EncodeResponse message.
     * @function verify
     * @memberof ks1.EncodeResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    EncodeResponse.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (!$util.isString(message.hash)) return 'hash: string expected';
      return null;
    };

    /**
     * Creates an EncodeResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.EncodeResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.EncodeResponse} EncodeResponse
     */
    EncodeResponse.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.EncodeResponse) return object;
      var message = new $root.ks1.EncodeResponse();
      if (object.hash != null) message.hash = String(object.hash);
      return message;
    };

    /**
     * Creates a plain object from an EncodeResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.EncodeResponse
     * @static
     * @param {ks1.EncodeResponse} message EncodeResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    EncodeResponse.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) object.hash = '';
      if (message.hash != null && message.hasOwnProperty('hash'))
        object.hash = message.hash;
      return object;
    };

    /**
     * Converts this EncodeResponse to JSON.
     * @function toJSON
     * @memberof ks1.EncodeResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    EncodeResponse.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return EncodeResponse;
  })();

  ks1.DecodeRequest = (function () {
    /**
     * Properties of a DecodeRequest.
     * @memberof ks1
     * @interface IDecodeRequest
     * @property {string} version DecodeRequest version
     * @property {string} hash DecodeRequest hash
     */

    /**
     * Constructs a new DecodeRequest.
     * @memberof ks1
     * @classdesc Represents a DecodeRequest.
     * @implements IDecodeRequest
     * @constructor
     * @param {ks1.IDecodeRequest=} [properties] Properties to set
     */
    function DecodeRequest(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * DecodeRequest version.
     * @member {string} version
     * @memberof ks1.DecodeRequest
     * @instance
     */
    DecodeRequest.prototype.version = '';

    /**
     * DecodeRequest hash.
     * @member {string} hash
     * @memberof ks1.DecodeRequest
     * @instance
     */
    DecodeRequest.prototype.hash = '';

    /**
     * Creates a new DecodeRequest instance using the specified properties.
     * @function create
     * @memberof ks1.DecodeRequest
     * @static
     * @param {ks1.IDecodeRequest=} [properties] Properties to set
     * @returns {ks1.DecodeRequest} DecodeRequest instance
     */
    DecodeRequest.create = function create(properties) {
      return new DecodeRequest(properties);
    };

    /**
     * Encodes the specified DecodeRequest message. Does not implicitly {@link ks1.DecodeRequest.verify|verify} messages.
     * @function encode
     * @memberof ks1.DecodeRequest
     * @static
     * @param {ks1.IDecodeRequest} message DecodeRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DecodeRequest.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.version);
      writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.hash);
      return writer;
    };

    /**
     * Encodes the specified DecodeRequest message, length delimited. Does not implicitly {@link ks1.DecodeRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.DecodeRequest
     * @static
     * @param {ks1.IDecodeRequest} message DecodeRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DecodeRequest.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DecodeRequest message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.DecodeRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.DecodeRequest} DecodeRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DecodeRequest.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.DecodeRequest();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.version = reader.string();
            break;
          case 2:
            message.hash = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('version'))
        throw $util.ProtocolError("missing required 'version'", {
          instance: message,
        });
      if (!message.hasOwnProperty('hash'))
        throw $util.ProtocolError("missing required 'hash'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes a DecodeRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.DecodeRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.DecodeRequest} DecodeRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DecodeRequest.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DecodeRequest message.
     * @function verify
     * @memberof ks1.DecodeRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DecodeRequest.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (!$util.isString(message.version)) return 'version: string expected';
      if (!$util.isString(message.hash)) return 'hash: string expected';
      return null;
    };

    /**
     * Creates a DecodeRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.DecodeRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.DecodeRequest} DecodeRequest
     */
    DecodeRequest.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.DecodeRequest) return object;
      var message = new $root.ks1.DecodeRequest();
      if (object.version != null) message.version = String(object.version);
      if (object.hash != null) message.hash = String(object.hash);
      return message;
    };

    /**
     * Creates a plain object from a DecodeRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.DecodeRequest
     * @static
     * @param {ks1.DecodeRequest} message DecodeRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DecodeRequest.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) {
        object.version = '';
        object.hash = '';
      }
      if (message.version != null && message.hasOwnProperty('version'))
        object.version = message.version;
      if (message.hash != null && message.hasOwnProperty('hash'))
        object.hash = message.hash;
      return object;
    };

    /**
     * Converts this DecodeRequest to JSON.
     * @function toJSON
     * @memberof ks1.DecodeRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DecodeRequest.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return DecodeRequest;
  })();

  ks1.DecodeResponse = (function () {
    /**
     * Properties of a DecodeResponse.
     * @memberof ks1
     * @interface IDecodeResponse
     * @property {string} originalBarcode DecodeResponse originalBarcode
     * @property {Array.<ks1.IDecodedElement>|null} [elements] DecodeResponse elements
     */

    /**
     * Constructs a new DecodeResponse.
     * @memberof ks1
     * @classdesc Represents a DecodeResponse.
     * @implements IDecodeResponse
     * @constructor
     * @param {ks1.IDecodeResponse=} [properties] Properties to set
     */
    function DecodeResponse(properties) {
      this.elements = [];
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * DecodeResponse originalBarcode.
     * @member {string} originalBarcode
     * @memberof ks1.DecodeResponse
     * @instance
     */
    DecodeResponse.prototype.originalBarcode = '';

    /**
     * DecodeResponse elements.
     * @member {Array.<ks1.IDecodedElement>} elements
     * @memberof ks1.DecodeResponse
     * @instance
     */
    DecodeResponse.prototype.elements = $util.emptyArray;

    /**
     * Creates a new DecodeResponse instance using the specified properties.
     * @function create
     * @memberof ks1.DecodeResponse
     * @static
     * @param {ks1.IDecodeResponse=} [properties] Properties to set
     * @returns {ks1.DecodeResponse} DecodeResponse instance
     */
    DecodeResponse.create = function create(properties) {
      return new DecodeResponse(properties);
    };

    /**
     * Encodes the specified DecodeResponse message. Does not implicitly {@link ks1.DecodeResponse.verify|verify} messages.
     * @function encode
     * @memberof ks1.DecodeResponse
     * @static
     * @param {ks1.IDecodeResponse} message DecodeResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DecodeResponse.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.originalBarcode);
      if (message.elements != null && message.elements.length)
        for (var i = 0; i < message.elements.length; ++i)
          $root.ks1.DecodedElement.encode(
            message.elements[i],
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
      return writer;
    };

    /**
     * Encodes the specified DecodeResponse message, length delimited. Does not implicitly {@link ks1.DecodeResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.DecodeResponse
     * @static
     * @param {ks1.IDecodeResponse} message DecodeResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DecodeResponse.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DecodeResponse message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.DecodeResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.DecodeResponse} DecodeResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DecodeResponse.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.DecodeResponse();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.originalBarcode = reader.string();
            break;
          case 2:
            if (!(message.elements && message.elements.length))
              message.elements = [];
            message.elements.push(
              $root.ks1.DecodedElement.decode(reader, reader.uint32()),
            );
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('originalBarcode'))
        throw $util.ProtocolError("missing required 'originalBarcode'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes a DecodeResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.DecodeResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.DecodeResponse} DecodeResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DecodeResponse.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DecodeResponse message.
     * @function verify
     * @memberof ks1.DecodeResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DecodeResponse.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (!$util.isString(message.originalBarcode))
        return 'originalBarcode: string expected';
      if (message.elements != null && message.hasOwnProperty('elements')) {
        if (!Array.isArray(message.elements)) return 'elements: array expected';
        for (var i = 0; i < message.elements.length; ++i) {
          var error = $root.ks1.DecodedElement.verify(message.elements[i]);
          if (error) return 'elements.' + error;
        }
      }
      return null;
    };

    /**
     * Creates a DecodeResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.DecodeResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.DecodeResponse} DecodeResponse
     */
    DecodeResponse.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.DecodeResponse) return object;
      var message = new $root.ks1.DecodeResponse();
      if (object.originalBarcode != null)
        message.originalBarcode = String(object.originalBarcode);
      if (object.elements) {
        if (!Array.isArray(object.elements))
          throw TypeError('.ks1.DecodeResponse.elements: array expected');
        message.elements = [];
        for (var i = 0; i < object.elements.length; ++i) {
          if (typeof object.elements[i] !== 'object')
            throw TypeError('.ks1.DecodeResponse.elements: object expected');
          message.elements[i] = $root.ks1.DecodedElement.fromObject(
            object.elements[i],
          );
        }
      }
      return message;
    };

    /**
     * Creates a plain object from a DecodeResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.DecodeResponse
     * @static
     * @param {ks1.DecodeResponse} message DecodeResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DecodeResponse.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.arrays || options.defaults) object.elements = [];
      if (options.defaults) object.originalBarcode = '';
      if (
        message.originalBarcode != null &&
        message.hasOwnProperty('originalBarcode')
      )
        object.originalBarcode = message.originalBarcode;
      if (message.elements && message.elements.length) {
        object.elements = [];
        for (var j = 0; j < message.elements.length; ++j)
          object.elements[j] = $root.ks1.DecodedElement.toObject(
            message.elements[j],
            options,
          );
      }
      return object;
    };

    /**
     * Converts this DecodeResponse to JSON.
     * @function toJSON
     * @memberof ks1.DecodeResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DecodeResponse.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return DecodeResponse;
  })();

  ks1.DecodedElement = (function () {
    /**
     * Properties of a DecodedElement.
     * @memberof ks1
     * @interface IDecodedElement
     * @property {string} ai DecodedElement ai
     * @property {string} title DecodedElement title
     * @property {string} value DecodedElement value
     * @property {string} raw DecodedElement raw
     * @property {string} meta DecodedElement meta
     */

    /**
     * Constructs a new DecodedElement.
     * @memberof ks1
     * @classdesc Represents a DecodedElement.
     * @implements IDecodedElement
     * @constructor
     * @param {ks1.IDecodedElement=} [properties] Properties to set
     */
    function DecodedElement(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * DecodedElement ai.
     * @member {string} ai
     * @memberof ks1.DecodedElement
     * @instance
     */
    DecodedElement.prototype.ai = '';

    /**
     * DecodedElement title.
     * @member {string} title
     * @memberof ks1.DecodedElement
     * @instance
     */
    DecodedElement.prototype.title = '';

    /**
     * DecodedElement value.
     * @member {string} value
     * @memberof ks1.DecodedElement
     * @instance
     */
    DecodedElement.prototype.value = '';

    /**
     * DecodedElement raw.
     * @member {string} raw
     * @memberof ks1.DecodedElement
     * @instance
     */
    DecodedElement.prototype.raw = '';

    /**
     * DecodedElement meta.
     * @member {string} meta
     * @memberof ks1.DecodedElement
     * @instance
     */
    DecodedElement.prototype.meta = '';

    /**
     * Creates a new DecodedElement instance using the specified properties.
     * @function create
     * @memberof ks1.DecodedElement
     * @static
     * @param {ks1.IDecodedElement=} [properties] Properties to set
     * @returns {ks1.DecodedElement} DecodedElement instance
     */
    DecodedElement.create = function create(properties) {
      return new DecodedElement(properties);
    };

    /**
     * Encodes the specified DecodedElement message. Does not implicitly {@link ks1.DecodedElement.verify|verify} messages.
     * @function encode
     * @memberof ks1.DecodedElement
     * @static
     * @param {ks1.IDecodedElement} message DecodedElement message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DecodedElement.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.ai);
      writer.uint32(/* id 2, wireType 2 =*/ 18).string(message.title);
      writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.value);
      writer.uint32(/* id 4, wireType 2 =*/ 34).string(message.raw);
      writer.uint32(/* id 5, wireType 2 =*/ 42).string(message.meta);
      return writer;
    };

    /**
     * Encodes the specified DecodedElement message, length delimited. Does not implicitly {@link ks1.DecodedElement.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ks1.DecodedElement
     * @static
     * @param {ks1.IDecodedElement} message DecodedElement message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DecodedElement.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DecodedElement message from the specified reader or buffer.
     * @function decode
     * @memberof ks1.DecodedElement
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ks1.DecodedElement} DecodedElement
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DecodedElement.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.ks1.DecodedElement();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.ai = reader.string();
            break;
          case 2:
            message.title = reader.string();
            break;
          case 3:
            message.value = reader.string();
            break;
          case 4:
            message.raw = reader.string();
            break;
          case 5:
            message.meta = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      if (!message.hasOwnProperty('ai'))
        throw $util.ProtocolError("missing required 'ai'", {instance: message});
      if (!message.hasOwnProperty('title'))
        throw $util.ProtocolError("missing required 'title'", {
          instance: message,
        });
      if (!message.hasOwnProperty('value'))
        throw $util.ProtocolError("missing required 'value'", {
          instance: message,
        });
      if (!message.hasOwnProperty('raw'))
        throw $util.ProtocolError("missing required 'raw'", {
          instance: message,
        });
      if (!message.hasOwnProperty('meta'))
        throw $util.ProtocolError("missing required 'meta'", {
          instance: message,
        });
      return message;
    };

    /**
     * Decodes a DecodedElement message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ks1.DecodedElement
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ks1.DecodedElement} DecodedElement
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DecodedElement.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DecodedElement message.
     * @function verify
     * @memberof ks1.DecodedElement
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DecodedElement.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (!$util.isString(message.ai)) return 'ai: string expected';
      if (!$util.isString(message.title)) return 'title: string expected';
      if (!$util.isString(message.value)) return 'value: string expected';
      if (!$util.isString(message.raw)) return 'raw: string expected';
      if (!$util.isString(message.meta)) return 'meta: string expected';
      return null;
    };

    /**
     * Creates a DecodedElement message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ks1.DecodedElement
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ks1.DecodedElement} DecodedElement
     */
    DecodedElement.fromObject = function fromObject(object) {
      if (object instanceof $root.ks1.DecodedElement) return object;
      var message = new $root.ks1.DecodedElement();
      if (object.ai != null) message.ai = String(object.ai);
      if (object.title != null) message.title = String(object.title);
      if (object.value != null) message.value = String(object.value);
      if (object.raw != null) message.raw = String(object.raw);
      if (object.meta != null) message.meta = String(object.meta);
      return message;
    };

    /**
     * Creates a plain object from a DecodedElement message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ks1.DecodedElement
     * @static
     * @param {ks1.DecodedElement} message DecodedElement
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DecodedElement.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) {
        object.ai = '';
        object.title = '';
        object.value = '';
        object.raw = '';
        object.meta = '';
      }
      if (message.ai != null && message.hasOwnProperty('ai'))
        object.ai = message.ai;
      if (message.title != null && message.hasOwnProperty('title'))
        object.title = message.title;
      if (message.value != null && message.hasOwnProperty('value'))
        object.value = message.value;
      if (message.raw != null && message.hasOwnProperty('raw'))
        object.raw = message.raw;
      if (message.meta != null && message.hasOwnProperty('meta'))
        object.meta = message.meta;
      return object;
    };

    /**
     * Converts this DecodedElement to JSON.
     * @function toJSON
     * @memberof ks1.DecodedElement
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DecodedElement.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return DecodedElement;
  })();

  return ks1;
})();

module.exports = $root;
