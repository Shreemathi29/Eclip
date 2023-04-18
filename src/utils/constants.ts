import {Address} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';

/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
export const constants = {
  MESSAGES: {
    HOLDER_NOT_FOUND: 'Holder information not found',
    HOLDERS_NOT_FOUND: 'Holders information not found',
    ACCESS_TOEKN_DATA_NOT_FOUND: 'client_id or secret is missing',
    PRODUCT_NOT_FOUND: 'Product not found',
    VARIANT_NOT_FOUND: 'Varinat not found',
    BATCH_NOT_FOUND: 'Batch not found',
    PRODUCT_UPLOADED_SUCCESSFULLY: 'Products Uploaded Successfully',
    VARIANT_UPLOADED_SUCCESSFULLY: 'Variants Uploaded Successfully',
    BATCH_UPLOADED_SUCCESSFULLY: 'Batches Uploaded Successfully',
  },
};

export const convertToFullAddress = (address?: Address) => {
  if (!address) return '';
  let fullAddress = '';
  if (address.addressLine1)
    fullAddress = fullAddress + (address.addressLine1 || '');
  if (address.addressLine2)
    fullAddress = fullAddress + '\n' + (address.addressLine2 || '');
  if (address.city) fullAddress = fullAddress + '\n' + (address.city || '');
  if (address.state) fullAddress = fullAddress + '\n' + (address.state || '');
  if (address.zipcode) fullAddress = fullAddress + '\n' + address.zipcode;
  if (address.country)
    fullAddress = fullAddress + '\n' + (address.country || '');
  if (!fullAddress) return '';
  return fullAddress;
};
