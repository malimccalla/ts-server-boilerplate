import * as rp from 'request-promise';

import * as ast from './ast';

export class TestClient {
  url: string;
  options: {
    withCredentials: boolean;
    jar: any;
    json: boolean;
  };

  constructor(url: string) {
    this.url = url;
    this.options = {
      jar: rp.jar(),
      withCredentials: true,
      json: true,
    };
  }

  async forgotPasswordChange(
    newPassword: string,
    key: string
  ): Promise<{ data: { forgotPasswordChange: GQL.IForgotPasswordChangeResponse } }> {
    return rp.post(this.url, {
      ...this.options,
      body: { query: ast.forgotPasswordChangeMutation(newPassword, key) },
    });
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

  async sendForgotPasswordEmail(
    email: string
  ): Promise<{ data: { register: GQL.IRegisterResponse } }> {
    return rp.post(this.url, {
      ...this.options,
      body: { query: ast.sendForgotPasswordEmailMutation(email) },
    });
  }
}
