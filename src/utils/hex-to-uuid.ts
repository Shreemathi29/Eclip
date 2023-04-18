/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
//@ts-ignore
const uuidParse = require('uuid-parse');
const isHex = require('validator/lib/isHexadecimal');

export const hexTouuid = (hexString: string) => {
  const parsedHexString = hexString.replace(new RegExp('^0x'), '');

  if (!isHex(parsedHexString)) {
    throw new Error('hexString is not valid hexadecimal number');
  }

  //Allocate 16 bytes for the uuid bytes representation
  let hexBuffer = Buffer.from(parsedHexString, 'hex');

  //Parse uuid string representation and send bytes into buffer
  const uuidResultBuffer = uuidParse.unparse(hexBuffer);

  //Create uuid utf8 string representation
  return uuidResultBuffer.toString('utf8');
};
