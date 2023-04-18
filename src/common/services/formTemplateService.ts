import {CredentialFormClient} from '@/clients/rest/credential-form.client';
import {bind, BindingScope, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';

@bind({scope: BindingScope.SINGLETON})
export class FormTemplateService {
  constructor(
    @service(CredentialFormClient)
    private credentialFormClient: CredentialFormClient,
  ) {}
  async getFormKeys(cid: string) {
    try {
      const ret = await this.credentialFormClient.getFormInfoByCid(cid);
      const task_data = ret?.formsuite?.form?.task_data;
      if (!Array.isArray(task_data))
        throw new HttpErrors.InternalServerError(
          `error while getting form details at FormTemplateService`,
        );

      const data = task_data
        .map(x => ({fieldKey: x?.field_key, schemaRule: x?.schemaRule}))
        .filter(x => !!x?.fieldKey);

      return {
        fieldKeys: data.map(x => x.fieldKey),
        keysAndSchemaRules: data,
        allData: task_data,
      };
    } catch (err) {
      // console.log(`err`, err?.data?.error);
      throw new HttpErrors.InternalServerError(
        `CRITICAL: error whlie getting formKeys from FormTemplate cid : ${cid} ${err.message}`,
      );
    }
  }
}
