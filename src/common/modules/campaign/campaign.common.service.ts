import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {bind, BindingScope, Context, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import mongoose from 'mongoose';
import {CampaignMapping} from '../campaignMapping/campaignMapping.model';
import {
  Campaign,
  CampaignData,
  CampaignStatus,
  ICampaign,
} from './campaign.model';

@bind({scope: BindingScope.SINGLETON})
export class CampaignCommonService extends RequestCtxAbs {
  constructor(@inject.context() protected ctx: Context) {
    super(ctx);
  }
  @authAndAuthZ('create', 'Campaign')
  async createCampaign(reqData: ICampaign) {
    // check If campaign already exists with same name
    const campaign = await Campaign.findOne({name: reqData.name});
    if (campaign) {
      throw new HttpErrors.BadRequest('Campaign already exists for given name');
    }
    // Add  creatorUser
    reqData.creatorUser = (await this.getAccessUser()).user?.id;
    const createCampaignRes = await Campaign.create(reqData);
    return createCampaignRes;
  }

  @authAndAuthZ('read', 'Campaign')
  async getCampaign(reqData: {campaignId: string}) {
    const campaign = await Campaign.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(reqData.campaignId),
        },
      },
      {
        $lookup: {
          from: 'campaignmappings',
          localField: '_id',
          foreignField: 'campaignId',
          pipeline: [{$project: {_id: 1, item: 1, variant: 1, batch: 1}}],
          as: 'CampaignMapping',
        },
      },
      {
        $unwind: {
          path: '$CampaignMapping',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'items',
          localField: 'CampaignMapping.item',
          foreignField: '_id',
          pipeline: [{$project: {_id: 1, name: 1}}],
          as: 'CampaignMapping.item',
        },
      },
      {
        $unwind: {
          path: '$CampaignMapping.item',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'variants',
          localField: 'CampaignMapping.variant',
          foreignField: '_id',
          pipeline: [{$project: {_id: 1, gtinKey: 1}}],
          as: 'CampaignMapping.variant',
        },
      },
      {
        $unwind: {
          path: '$CampaignMapping.variant',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'batches',
          localField: 'CampaignMapping.batch',
          foreignField: '_id',
          pipeline: [{$project: {_id: 1, name: 1}}],
          as: 'CampaignMapping.batch',
        },
      },
      {
        $unwind: {
          path: '$CampaignMapping.batch',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          name: {$first: '$name'},
          status: {$first: '$status'},
          data: {$first: '$data'},
          description: {$first: '$description'},
          campaignMapping: {$push: '$CampaignMapping'},
        },
      },
    ]);
    if (campaign.length === 0) {
      throw new HttpErrors.NotFound('Campaign not found');
    }
    return campaign[0];
  }

  @authAndAuthZ('update', 'Campaign')
  async editCampaign(reqData: {
    campaignId: string;
    description: string;
    data: CampaignData[];
  }) {
    const campaign = await Campaign.findOne({_id: reqData?.campaignId});
    if (!campaign) {
      throw new HttpErrors.NotFound('Campaign not found');
    }
    const editCampaignRes = await Campaign.findOneAndUpdate(
      {_id: reqData?.campaignId},
      {
        description: reqData?.description,
        data: reqData?.data,
      },
      {returnOriginal: false},
    );
    return editCampaignRes;
  }

  @authAndAuthZ('create', 'Campaign')
  async duplicateCampaign(reqData: {
    campaignId: string;
    name: string;
    description: string;
  }) {
    const campaign = await Campaign.findOne({_id: reqData.campaignId});
    if (!campaign) {
      throw new HttpErrors.NotFound('Campaign not found');
    }
    const campaignData: any = {
      name: reqData.name,
      description: reqData.description,
      data: campaign?.data,
      campaignTemplateId: campaign?.campaignTemplateId,
      creatorUser: (await this.getAccessUser()).user?.id,
    };
    const createCampaignRes = await Campaign.create(campaignData);
    return createCampaignRes;
  }

  @authAndAuthZ('update', 'Campaign')
  async associateProductsToCampaign(reqData: {
    campaignId: string;
    products: any;
  }) {
    // check If campaign already exists with same name
    const campaign = await Campaign.findOne({_id: reqData.campaignId});
    if (!campaign) {
      throw new HttpErrors.NotFound('Campaign not found');
    }
    const creatorUser = (await this.getAccessUser()).user?.id;
    const campaignMappingData = reqData.products.map(
      (product: {item: any; batch: any; variant: any}) => {
        return {
          item: product.item,
          batch: product.batch,
          variant: product.variant,
          creatorUser: creatorUser,
          campaignId: reqData.campaignId,
        };
      },
    );
    // clear previous mappings, front end always will give complete list
    await CampaignMapping.remove({
      campaignId: reqData.campaignId,
    });
    const createCampaignMappingRes = await CampaignMapping.insertMany(
      campaignMappingData,
    );
    return {success: true};
  }

  @authAndAuthZ('update', 'Campaign')
  async editCampaignStatus(reqData: {
    campaignId: string;
    status: CampaignStatus;
  }) {
    // check If campaign already exists with same name
    const campaign = await Campaign.findOne({_id: reqData.campaignId});
    if (!campaign) {
      throw new HttpErrors.NotFound('Campaign not found');
    }
    const updateCampaignRes = await Campaign.updateOne(
      {
        _id: reqData.campaignId,
      },
      {
        status: reqData.status,
      },
    );
    return updateCampaignRes;
  }

  @authAndAuthZ('delete', 'Campaign')
  async removeCampaignProduct(reqData: {
    campaignId: string;
    item: string;
    variant: string;
    batch: string;
  }) {
    // check If campaign already exists with same name
    const campaign = await Campaign.findOne({_id: reqData.campaignId});
    if (!campaign) {
      throw new HttpErrors.NotFound('Campaign not found');
    }
    // find mapping
    const campaignMapping = await CampaignMapping.findOne({
      campaignId: reqData.campaignId,
      item: reqData.item,
      variant: reqData.variant,
      batch: reqData.batch,
    });
    if (!campaignMapping) {
      throw new HttpErrors.BadRequest('Campaign mapping not found');
    }
    const updateCampaignRes = await CampaignMapping.deleteOne({
      campaignId: reqData.campaignId,
      item: reqData.item,
      variant: reqData.variant,
      batch: reqData.batch,
    });
    return {success: true};
  }
}
