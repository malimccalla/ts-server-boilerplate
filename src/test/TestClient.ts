import { GraphQLClient } from 'graphql-request';

import { mutation, query } from './gql';

// See: https://www.npmjs.com/package/graphql-request#cookie-support-for-node
// @ts-ignore: Global has no index signature
// tslint:disable-next-line
global['fetch'] = require('fetch-cookie/node-fetch')(require('node-fetch'));

export class TestClient {
  client: GraphQLClient = new GraphQLClient(process.env.TEST_HOST as string);

  async forgotPasswordChange(input: GQL.IForgotPasswordChangeInput) {
    return this.client.request<{ forgotPasswordChange: GQL.IForgotPasswordResponse }>(
      mutation.forgotPasswordChange,
      { input }
    );
  }

  async login(input: GQL.ILoginInput) {
    return this.client.request<{ login: GQL.ILoginResponse }>(mutation.login, {
      input,
    });
  }

  async logout() {
    return this.client.request<{ logout: boolean }>(mutation.logout);
  }

  async me() {
    return this.client.request<{ me: GQL.IUser | null }>(query.me);
  }

  async register(input: GQL.IRegisterInput) {
    return this.client.request<{ register: GQL.IRegisterResponse }>(mutation.register, {
      input,
    });
  }

  async sendForgotPasswordEmail(input: GQL.ISendForgotPasswordEmailInput) {
    return this.client.request<{ sendForgotPasswordEmail: GQL.IForgotPasswordResponse }>(
      mutation.sendForgotPasswordEmail,
      { input }
    );
  }
}
