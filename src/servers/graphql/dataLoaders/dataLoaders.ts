import {SDRPersonaTx} from '@/common/modules/sdrPersonaTx/sdrPersona.model';
import {TemplateStyle} from '@/common/modules/templateStyle';
import DataLoader from 'dataloader';
import {Model, models, Types} from 'mongoose';

export type DLRefs = {
  _id: Types.ObjectId;
  arrData: {_id: Types.ObjectId}[];
};

export const DataLoaderFactory = (collection: typeof Model) => {
  return new DataLoader(async keys => {
    const nonNullKeys = keys.filter(x => !!x);
    const retData = await collection.find({_id: {$in: nonNullKeys}});
    const orderedCollection = keys.map(key => {
      if (!key) return null;
      const value = retData.find(data =>
        (data?._id as Types.ObjectId)?.equals(key as string),
      );
      return value ?? null;
    });
    return orderedCollection;
  });
};

const DLReverseRelationOneVManyFactory = (
  collection: typeof Model,
  searchKey: string,
) => {
  return new DataLoader(async keys => {
    const retData = (await collection.aggregate([
      {
        $match: {[searchKey]: {$in: keys}},
      },
      {
        $group: {
          _id: `$${searchKey}`,

          arrData: {
            $push: '$$CURRENT',
          },
        },
      },
      {
        $project: {
          'arrData._id': 1,
        },
      },
    ])) as DLRefs[];
    const orderedcollection = keys.map(key => {
      if (!key) return null;
      const value = retData.find(data =>
        (data?._id as Types.ObjectId)?.equals(key as string),
      );
      return value ?? null;
    });
    return orderedcollection;
  });
};
const DLReverseRelationOneVManyArrayFactory = (
  collection: typeof Model,
  searchKey: string,
) => {
  return new DataLoader(async keys => {
    const retData = (await collection.aggregate([
      {
        $match: {[searchKey]: {$in: keys}},
      },
      {
        $unwind: {
          path: `$${searchKey}`,
        },
      },
      {
        $group: {
          _id: `$${searchKey}`,

          arrData: {
            $push: '$$CURRENT',
          },
        },
      },
      {
        $project: {
          'arrData._id': 1,
        },
      },
    ])) as DLRefs[];
    const orderedcollection = keys.map(key => {
      if (!key) return null;
      const value = retData.find(data =>
        (data?._id as Types.ObjectId)?.equals(key as string),
      );
      return value ?? null;
    });
    return orderedcollection;
  });
};

export class DataLoaderGetter {
  private productDataLoder: DataLoader<unknown, any, unknown>;
  private orgDataLoder: DataLoader<unknown, any, unknown>;
  private gtinIdsViaProductDL: DataLoader<unknown, any, unknown>;
  private gtinDataLoader: DataLoader<unknown, any, unknown>;
  private batchIdsViaGtinDL: DataLoader<unknown, any, unknown>;
  private batchDataLoader: DataLoader<unknown, any, unknown>;
  private sdrPersonaTxDataLoader: DataLoader<unknown, any, unknown>;
  private tempStyleDataLoader: DataLoader<unknown, any, unknown>;

  getProductDataLoader() {
    if (!this.productDataLoder) {
      this.productDataLoder = DataLoaderFactory(models.item);
    }
    return this.productDataLoder;
  }
  getOrgDataLoader() {
    if (!this.orgDataLoder) {
      this.orgDataLoder = DataLoaderFactory(models.brand);
    }
    return this.orgDataLoder;
  }
  getGtinIdsViaProductDL() {
    if (!this.gtinIdsViaProductDL) {
      this.gtinIdsViaProductDL = DLReverseRelationOneVManyFactory(
        models.variant,
        'item',
      );
    }
    return this.gtinIdsViaProductDL;
  }
  getGtinDataLoader() {
    if (!this.gtinDataLoader) {
      this.gtinDataLoader = DataLoaderFactory(models.variant);
    }
    return this.gtinDataLoader;
  }
  getBatchIdsViaGtinDL() {
    if (!this.batchIdsViaGtinDL) {
      this.batchIdsViaGtinDL = DLReverseRelationOneVManyArrayFactory(
        models.batch,
        'variants',
      );
    }
    return this.batchIdsViaGtinDL;
  }
  getBatchDataLoader() {
    if (!this.batchDataLoader) {
      this.batchDataLoader = DataLoaderFactory(models.batch);
    }
    return this.batchDataLoader;
  }
  getsdrPersonDataLoader() {
    if (!this.sdrPersonaTxDataLoader) {
      this.sdrPersonaTxDataLoader = DataLoaderFactory(SDRPersonaTx);
    }
    return this.sdrPersonaTxDataLoader;
  }

  getTempStyleDataLoader() {
    if (!this.tempStyleDataLoader) {
      this.tempStyleDataLoader = DataLoaderFactory(TemplateStyle);
    }
    return this.tempStyleDataLoader;
  }
}
