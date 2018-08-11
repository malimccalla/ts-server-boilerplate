import { GraphQLClient } from 'graphql-request';

import { mutation, query } from './gql';

// See: https://www.npmjs.com/package/graphql-request#cookie-support-for-node
// @ts-ignore: Global has no index signature
// tslint:disable-next-line
global['fetch'] = require('fetch-cookie/node-fetch')(require('node-fetch'));

export class TestClient extends GraphQLClient {
  constructor() {
    super(process.env.TEST_HOST!);
  }

  async forgotPasswordChange(input: GQL.IForgotPasswordChangeInput) {
    return this.request<{ forgotPasswordChange: GQL.IForgotPasswordResponse }>(
      mutation.forgotPasswordChange,
      { input }
    );
  }

  async login(input: GQL.ILoginInput) {
    return this.request<{ login: GQL.ILoginResponse }>(mutation.login, {
      input,
    });
  }

  async logout() {
    return this.request<{ logout: boolean }>(mutation.logout);
  }

  async me() {
    return this.request<{ me: GQL.IUser | null }>(query.me);
  }

  async register(input: GQL.IRegisterInput) {
    return this.request<{ register: GQL.IRegisterResponse }>(mutation.register, {
      input,
    });
  }

  async sendForgotPasswordEmail(input: GQL.ISendForgotPasswordEmailInput) {
    return this.request<{ sendForgotPasswordEmail: GQL.IForgotPasswordResponse }>(
      mutation.sendForgotPasswordEmail,
      { input }
    );
  }
}
