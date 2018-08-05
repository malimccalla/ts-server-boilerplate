import * as rp from 'request-promise';

import { loginMutation, logout, meQuery } from './ast';

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

  async me() {
    return rp.post(this.url, {
      ...this.options,
      body: { query: meQuery },
    });
  }

  async login(email: string, password: string) {
    return rp.post(this.url, {
      ...this.options,
      body: { query: loginMutation(email, password) },
    });
  }

  async logout() {
    return rp.post(this.url, {
      ...this.options,
      body: { query: logout },
    });
  }
}
