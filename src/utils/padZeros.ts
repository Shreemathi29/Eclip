/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
export function padLeadingZeros(num: any, size: any) {
  var s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}
