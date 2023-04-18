import { MasterDispatchCommonService } from '@/common/modules/masterDispatch/masterDispatch.common.service';

export const getMasterDispatchData = async (
  _: any,
  { key, bucket }: { key: string; bucket: string },
  masterDispatchService: MasterDispatchCommonService
) => {
  try {
    const data = await masterDispatchService.getMasterDispatchData(key, bucket);
    return { data };
  } catch (err) {
    console.error(err);
    return { error: 'Error retrieving object from S3' };
  }
};


