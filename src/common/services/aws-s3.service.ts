import { log } from '@/utils';
import { bind, /* inject, */ BindingScope, config, inject } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import AWS from 'aws-sdk';
import { stringify } from 'csv-stringify';
import fileType from 'file-type';
import { nanoid } from 'nanoid';

export interface AWSS3Config {
  accessKeyId?: string;
  bucketName?: string;
  region?: string;
  secretAccessKey?: string;
  preSignedurlExpirySeconds?: number;
}

@bind({ scope: BindingScope.SINGLETON })
export class AWSService {
  private s3Instance: AWS.S3;
  constructor(
    @config() private s3Config: AWSS3Config,
    @inject('env') private env: any,
  ) {
    this.s3Instance = new AWS.S3(s3Config);
  }

  async uploadFile({
    data,
    encoding,
    bucket,
    mimeType,
    fileName,
    dontPrependId = false,
    ACL = 'public-read',
    ignoreRestictFileType = false,
    BufferFromString = true,
  }: {
    data: string;
    encoding: string;
    bucket?: string;
    mimeType?: string;
    fileName?: string;
    dontPrependId?: boolean;
    ACL?: string;
    ignoreRestictFileType?: boolean;
    BufferFromString?: boolean;
  }) {
    try {
      data = data.replace(/^data:image\/[a-z]+;base64,/, '');
      if (!ignoreRestictFileType) {
        await this.restrictFileType({ item: Buffer.from(data, encoding) });
      }
      const key = dontPrependId ? '' : nanoid();
      const s3Params: AWS.S3.PutObjectRequest = {
        Body: BufferFromString ? Buffer.from(data, encoding) : data,
        Bucket: bucket ?? (this.s3Config.bucketName as string),
        Key: key + `${fileName}`,
        ACL: ACL,
        ContentType: mimeType,
      };

      const { Location } = await this.s3Instance.upload(s3Params).promise();
      return {
        url: Location,
        key,
      };
    } catch (err: any) {
      log.error(`${err.message} \n error while image upload to AWS S3`);
      throw new HttpErrors.InternalServerError(err.message);
    }
  }

  async getFile({ key, bucket, type }: { key: string; bucket: string; type?: 'presignedUrl' | 'buffer' }) {
    try {
      if (!key) return undefined;
      const object = await this.s3Instance
        .getObject({
          Bucket: bucket || (this.s3Config.bucketName as string),
          Key: key,
        })
        .promise();

      // const base64prefix = await this.getBase64Prefix({item: buffer as Buffer});
      // const ret = base64prefix + (buffer ?? '');
      if (type === 'presignedUrl') {
        const preSignedUrl = this.s3Instance.getSignedUrl('getObject', {
          Bucket: bucket || (this.s3Config.bucketName as string),
          Key: key,
        });
        return {
          url: preSignedUrl,
          key,
        };
      } else (type === 'buffer')
      const buffer = object.Body;
      return buffer as any;
    } catch (err: any) {
      log.error(`Error while fetching file,${err.message}`);
      console.error(err);
      throw new HttpErrors.InternalServerError(`Error while fetching file`);
    }
  }

  private async restrictFileType({ item }: { item: Buffer }) {
    const fileTypeData = await fileType.fromBuffer(item);
    if (
      fileTypeData?.ext === 'png' ||
      fileTypeData?.ext === 'jpg' ||
      fileTypeData?.ext === 'gif' ||
      fileTypeData?.ext === 'pdf'
    )
      return fileTypeData;
    else {
      throw new HttpErrors.BadRequest(
        `unsupported fileformat, please upload an image or pdf, your fileformat is ${fileTypeData?.ext ?? 'unknown'
        }`,
      );
    }
  }

  private async getBase64Prefix({ item }: { item: Buffer }) {
    const fileTypeData = await fileType.fromBuffer(item);
    console.log(fileTypeData);
    if (!fileTypeData?.mime) return '';
    return `data:${fileTypeData.mime};base64,`;
  }

  async createCSVandUploadtoAws(
    csvData: any,
    fileName: any,
    bufferFromString: boolean,
  ) {
    let csvUploadPromise = new Promise(function (myResolve, myReject) {
      stringify(
        csvData,
        {
          header: true,
        },
        function (_err: any, csvSting: any) {
          if (_err) {
            return myReject(_err);
          } else {
            return myResolve(csvSting);
          }
        },
      );
    });
    const csvString: string = (await csvUploadPromise) as string;

    let ret: any = await this.uploadFile({
      data: csvString,
      encoding: 'base64',
      bucket: this.env.AWS_S3_BUCKET_NAME,
      mimeType: `text/csv`,
      fileName: `${fileName}.csv`,
      ignoreRestictFileType: true,
      BufferFromString: bufferFromString,
    });
    return ret;
  }
}
