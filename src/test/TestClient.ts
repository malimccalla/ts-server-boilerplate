import { GraphQLClient } from 'graphql-request';
import * as rp from 'request-promise';

import * as ast from './ast';

export class TestClient {
  client: GraphQLClient;
  url: string;
  options: {
    withCredentials: boolean;
    jar: any;
    json: boolean;
  };

  constructor() {
    this.client = new GraphQLClient(process.env.TEST_HOST as string, { headers: {} });
    this.url = process.env.TEST_HOST as string;
    this.options = {
      jar: rp.jar(),
      withCredentials: true,
      json: true,
    };
  }

  async forgotPasswordChange(input: GQL.IForgotPasswordChangeInput) {
    return this.client.request<{ forgotPasswordChange: GQL.IForgotPasswordResponse }>(
      ast.forgotPasswordChangeMutation,
      {
        input,
      }
    );
  }

  async login(
    email: string,
    password: string
  ): Promise<{ data: { login: GQL.ILoginResponse } }> {
    return rp.post(this.url, {
      ...this.options,
      body: { query: ast.loginMutation(email, password) },
    });
  }

  async logout(): Promise<{ data: { logout: boolean } }> {
    return rp.post(this.url, {
      ...this.options,
      body: { query: ast.logoutMutation },
    });
  }

  async me(): Promise<{ data: { me: GQL.IUser } }> {
    return rp.post(this.url, {
      ...this.options,
      body: { query: ast.meQuery },
    });
  }

  async register(
    email: string,
    password: string
  ): Promise<{ data: { register: GQL.IRegisterResponse } }> {
    return rp.post(this.url, {
      ...this.options,
      body: { query: ast.registerMutation(email, password) },
    });
  }

  async sendForgotPasswordEmail(input: GQL.ISendForgotPasswordEmailInput) {
    return this.client.request<{ sendForgotPasswordEmail: GQL.IForgotPasswordResponse }>(
      ast.sendForgotPasswordEmailMutation,
      {
        input,
      }
    );
  }
}
