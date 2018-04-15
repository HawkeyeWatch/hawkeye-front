import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from "./models/user";
import { GlobalDataService } from './global.service';

import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  baseUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private gds: GlobalDataService,
  ) {

  }

  public register(user: User) {
    return this.http.post(this.baseUrl + '/api/user', user);
  }

  login(login: string, password: string, extended: Boolean) {
    const user: any = {};
    user.login = login;
    user.password = password;
    if (extended) {
      user.extended = true;
    }
    return this.http.post(this.baseUrl + '/api/user/login', user)
      .map((res: any) => {
        if (res && res.token) {
          localStorage.setItem('currentUser', JSON.stringify(res));
          this.gds.shareObj['loggedIn'] = true;
          this.gds.shareObj['currentUser'] = res;
        }
        return res;
      });
  }

}
