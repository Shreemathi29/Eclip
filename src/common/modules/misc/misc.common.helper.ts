import {log} from '@/utils';
import {HttpErrors} from '@loopback/rest';
import * as csv from 'fast-csv';
import _ from 'lodash';
import {Duplex} from 'stream';

export class MiscCommonHelper {
  constructor() {}

  public async parseCsv(b64: string) {
    return new Promise((resolve, reject) => {
      const buff = Buffer.from(b64, 'base64');
      const stream = this.bufferToStream(buff);
      const rows: any[] = [];

      const csvStream = csv
        .parse({
          headers: (headers: any[]) => headers.map(h => h.toLowerCase()),
          ignoreEmpty: true,
          strictColumnHandling: true,
          discardUnmappedColumns: true,
          trim: true,
        })
        .on('error', (error: any, rowCount: number) => {
          log.error(`error in parsing csv file ${error.message}`);
          reject(
            new HttpErrors.UnprocessableEntity(
              `error in processing csv file,${error.message}`,
            ),
          );
        })
        .on('data', (row: any) => {
          rows.push(row);
        })
        .on('end', (rowCount: number) => {
          resolve(rows);
        });

      stream.pipe(csvStream);
      stream.end();
    });
  }

  public async validateCsv(b64: string, columns: string[]) {
    return new Promise((resolve, reject) => {
      const buff = Buffer.from(b64, 'base64');
      const stream = this.bufferToStream(buff);
      const csvStream = csv
        .parse({
          headers: (headers: any[]) => headers.map(h => h.toLowerCase()),
          ignoreEmpty: true,
          strictColumnHandling: true,
          discardUnmappedColumns: true,
          trim: true,
        })
        .on('headers', (headers: string[]) => {
          const missingColumn = this.validateCloumns(headers, columns);
          if (!_.isEmpty(missingColumn)) {
            reject(
              new HttpErrors.UnprocessableEntity(
                `Invalid CSV File, column missing:"${missingColumn}"`,
              ),
            );
          }
          resolve(true);
        })
        .on('error', (error: any, rowCount: number) => {
          log.error(`error in parsing csv file ${error.message}`);
          reject(
            new HttpErrors.UnprocessableEntity(
              `error in processing csv file,${error.message}`,
            ),
          );
        })
        .on('data', (row: any) => {})
        .on('end', (rowCount: number) => {
          resolve(true);
        });

      stream.pipe(csvStream);
      stream.end();
    });
  }
  private validateCloumns(headers: string[], columns: string[]) {
    const missingHeader = columns.filter((h: string, index: number) => {
      return h !== headers[index];
    });

    return missingHeader.map(h => h.toLowerCase());
  }
  private bufferToStream(buffer: Buffer) {
    const tmp = new Duplex();
    tmp.push(buffer);
    tmp.push(null);
    return tmp;
  }
}
