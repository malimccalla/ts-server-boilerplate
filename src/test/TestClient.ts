import * as rp from 'request-promise';

import { loginMutation, logout, meQuery, registerMutation } from './ast';

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

  async login(
    email: string,
    password: string
  ): Promise<{ data: { login: GQL.ILoginResponse } }> {
    return rp.post(this.url, {
      ...this.options,
      body: { query: loginMutation(email, password) },
    });
  }

  async logout(): Promise<{ data: { logout: boolean } }> {
    return rp.post(this.url, {
      ...this.options,
      body: { query: logout },
    });
  }

  async me(): Promise<{ data: { me: GQL.IUser } }> {
    return rp.post(this.url, {
      ...this.options,
      body: { query: meQuery },
    });
  }

  async register(
    email: string,
    password: string
  ): Promise<{ data: { register: GQL.IRegisterResponse } }> {
    return rp.post(this.url, {
      ...this.options,
      body: { query: registerMutation(email, password) },
    });
  }
}
