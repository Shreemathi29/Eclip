/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {Types} from 'mongoose';
import {ProvenanceCommonService} from '../../common/modules/provenance/provenance.common.service';
import {initApp} from '../application.setup';
import {getProvenanceObj, TableInput} from '../seedData';
const app = initApp();

function getReqCtx() {
  const res = app.getSync('services.TestUtilService');
  const testReqCtx = res.getTestReqCtx();
  return testReqCtx;
}

async function getProvenanceCommonService() {
  return (await getReqCtx()).getSync(
    'services.ProvenanceCommonService',
  ) as ProvenanceCommonService;
}

beforeAll(async () => {
  await app.start();
  await new Promise(r => setTimeout(r, 8000));
  return true;
});
describe('Provenance Service', () => {
  it('Get Provenance - should return Provenance object', async () => {
    const provenance = await getProvenanceObj();
    const result = await (
      await getProvenanceCommonService()
    ).getProvenance(provenance._id);

    expect(result).toBeTruthy();
  });
  it('Provenance Table - should return array of Provenance object', async () => {
    const result = await (
      await getProvenanceCommonService()
    ).provenanceTable(TableInput);

    expect(result).toBeTruthy();
  });
  it('Get Provenance - should return error Provenance not found', async () => {
    const id = Types.ObjectId('618236c67494694eac043b6f');
    try {
      const result = await (
        await getProvenanceCommonService()
      ).getProvenance(id);
      expect(result).toBeFalsy();
    } catch (e) {
      expect(e.message).toBe('Provenance not found');
    }
  });
});
