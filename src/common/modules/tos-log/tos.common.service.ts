import {
  authAndAuthZ,
  authenticateMethod,
} from '@/common/request-context/authenticate.interceptor';
import {CommonBindings} from '@/common/request-context/common-bindings';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {bind, BindingScope, Context, inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {User} from '../users/user.model';
import {ITOSLog, TermsAndCondition, TOSLog} from './tos-log.model';

@bind({scope: BindingScope.SINGLETON})
export class TOSLogCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject(CommonBindings.IP) private ip: any,
  ) {
    super(ctx);
  }

  //used by login app
  async create(param: Partial<ITOSLog> & {email?: string}): Promise<{
    tos_log: ITOSLog;
  }> {
    let user;
    if (param?.email) user = await User.findOne({email: param?.email});
    else user = (await this.getAccessUser())?.user;
    if (!user) {
      throw new HttpErrors.NotFound(`user not found email:${param?.email}`);
    }

    const tos_log = await TOSLog.create({
      ...param,
      acceptance_date: new Date(),
      email: user?.email,
    });
    return {
      tos_log,
    };
  }

  // authenticated at gateway
  async createTOSLogWithAuth(param: ITOSLog & {userProfile: any}) {
    const tos_log = await TOSLog.create({
      ...param,
      acceptance_date: new Date(),
      email: param?.userProfile?.email || param.email,
      ip: this.ip,
    });
    return {
      tos_log,
    };
  }

  async createTOSLogWithoutAuth(param: ITOSLog) {
    // add ip
    param.ip = this.ip;
    const tos_log = await TOSLog.create({
      ...param,
      acceptance_date: new Date(),
    });
    return {
      tos_log,
    };
  }

  @authAndAuthZ('read', 'TOSLog')
  async isTAndCAccepted({
    type,
    agreementUrl,
  }: {
    type: TermsAndCondition;
    agreementUrl: string;
  }) {
    const tos_log = await TOSLog.findOne({
      user: (await this.getAccessUser())?.user?._id,
      action: type,
      service_agreement: agreementUrl,
    });
    if (tos_log) return {accepted: true, type};
    return {accepted: false, type};
  }

  @authenticateMethod
  async acceptTAndC(param: Partial<ITOSLog>) {
    const {tos_log} = await this.create({...param});
    const user = await (await this.getAccessUser()).user;
    return {
      accepted: true,
      type: tos_log?.action,
      email: user?.email,
    };
  }
}
