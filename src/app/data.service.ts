import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Headers,  } from '@angular/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

import { User } from './models/user';
import { LocalNode } from './models/node';
import { Deploy } from './models/deploy';

import { GlobalDataService } from './global.service';

@Injectable()
export class DataService {
  baseUrl = 'http://localhost:8081';

  constructor(
    private http: HttpClient,
    private gds: GlobalDataService,
    private router: Router,
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

  public logout() {
    this.gds.shareObj['loggedin'] = undefined;
    this.gds.shareObj['currentUser'] = undefined;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  public getNodes() {
    return this.http.get(this.baseUrl + '/api/user/nodes', this.jwt());
  }

  public deleteNode(id: string) {
    return this.http.delete(`${this.baseUrl}/api/node/delete/${id}`, this.jwt());
  }

  public createNode(node: LocalNode) {
    return this.http.post(this.baseUrl + `/api/node`, node, this.jwt());
  }
  public addNode(node: LocalNode) {
    return this.http.post(this.baseUrl + '/api/user/addnode', node, this.jwt());
  }
  public getDeploy(nodeId, deployId) {
    return this.http.post(this.baseUrl + '/api/node/deploy/get', {nodeId, deployId}, this.jwt());
  }
  public stopDeploy(nodeId, deployId) {
    return this.http.post(this.baseUrl + '/api/node/deploy/stop', {nodeId, deployId}, this.jwt());
  }
  public startDeploy(nodeId, deployId) {
    return this.http.post(this.baseUrl + '/api/node/deploy/start', {nodeId, deployId}, this.jwt());
  }
  public fetchDeploy(nodeId, deployId) {
    return this.http.post(this.baseUrl + '/api/node/deploy/fetch', {nodeId, deployId}, this.jwt());
  }
  public deleteDeploy(nodeId, deployId) {
    return this.http.post(this.baseUrl + '/api/node/deploy/delete', {nodeId, deployId}, this.jwt());
  }
  public createDeploy(nodeId, deploy: Deploy) {
    return this.http.post(this.baseUrl + '/api/node/deploy', {nodeId, deploy}, this.jwt());
  }
  public getUsers() {
    return this.http.get(this.baseUrl + '/api/user/all', this.jwt());
  }
  public toggleRegistration() {
    return this.http.post(this.baseUrl + '/user/togglereg', {}, this.jwt());
  }
  public registrationAllowed() {
    return this.http.get(this.baseUrl + '/user/regallowed', this.jwt());
  }
  public toggleUser(userId) {
    return this.http.post(this.baseUrl + '/user/promote', {userId}, this.jwt());
  }

  public getUser() {
    return this.http.get(this.baseUrl + '/api/user', this.jwt());
  }

  private jwt() {
    // create authorization header with jwt token
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      return {headers: new HttpHeaders({ 'Authorization': 'Bearer ' + currentUser.token })};
    }
  }
}
