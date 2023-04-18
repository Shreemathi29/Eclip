import { createModule } from 'graphql-modules';
import { getMasterDispatchData } from './masterDispatch.resolver';
import { MasterDispatchTableTypedefs } from './masterDispatch.type';

export const MasterDispatchModule = createModule({
  id: 'master-dispatch-module',
  dirname: __dirname,
  typeDefs: [MasterDispatchTableTypedefs],
  resolvers:
    [getMasterDispatchData],
});