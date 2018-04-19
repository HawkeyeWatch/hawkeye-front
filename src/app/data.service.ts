import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Headers,  } from '@angular/http';

import { User } from "./models/user";
import { GlobalDataService } from './global.service';

import 'rxjs/add/operator/map';
import { LocalNode } from './models/node';

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

  public login(login: string, password: string, extended: Boolean) {
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

  public getNodes() {
    return this.http.get(this.baseUrl + '/api/user/nodes', this.jwt());
  }

  public deleteNode(id: string) {
    return this.http.delete(`${this.baseUrl}/api/node/${id}`, this.jwt());
  }

  public createNode(node: LocalNode) {
    return this.http.post(this.baseUrl + `/api/node`, node, this.jwt());
  }

  private jwt() {
    // create authorization header with jwt token
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      return {headers: new HttpHeaders({ 'Authorization': 'Bearer ' + currentUser.token })};
    }
  }
}
