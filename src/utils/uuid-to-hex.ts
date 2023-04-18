/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
//@ts-ignore
const uuidParse = require('uuid-parse');
const isUUID = require('validator/lib/isUUID');

export const uuidToHex = (uuidString: string, addLeadingZero = false) => {
  if (!isUUID(uuidString)) {
    throw new Error('uuidString is not valid UUID');
  }

  //Allocate 16 bytes for the uuid bytes representation
  let uuidBuffer = Buffer.alloc(16);

  //Parse uuid string representation and send bytes into buffer
  uuidParse.parse(uuidString, uuidBuffer);

  //Create strict uuid hex representation
  const uuidHex = uuidBuffer.toString('hex');
  return addLeadingZero ? '0x' + uuidHex : uuidHex;
};
