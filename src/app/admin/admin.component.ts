import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';

import { User } from '../models/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[];
  registrationAllowed: boolean;

  constructor(
    private ds: DataService
  ) { }

  private catch(err) {
    if (err.status === 401) {
      this.ds.logout();
    }
  }

  ngOnInit() {
    this.ds.getUsers()
      .subscribe(
        (res) => this.users = res as User[],
        err => this.catch(err)
      );

    this.ds.registrationAllowed()
    .subscribe(
      (res: any) => this.registrationAllowed = res.allowed,
      err => this.catch(err)
    );
  }
  toggleUser(userIndex) {
    this.ds.toggleUser(this.users[userIndex]._id)
      .subscribe(
        (res: User) => this.users[userIndex].isAdmin = res.isAdmin,
        err => this.catch(err)
      );
    this.ds.registrationAllowed()
      .subscribe(
        (res: any) => this.registrationAllowed = res.allowed,
        err => this.catch(err)
      );
  }
  toggleRegistration() {
    this.ds.toggleRegistration()
      .subscribe(
        (res: any) => this.registrationAllowed = res.allowed,
        err => this.catch(err)
      );
  }

}
