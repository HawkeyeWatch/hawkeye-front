import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../data.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  loginStr: string;
  passwordStr: string;
  extended = true;

  error = false;

  constructor(
    private ds: DataService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  public loginUser() {
    this.error = false;
    this.ds.login(this.loginStr, this.passwordStr, this.extended)
      .subscribe(() => {
        this.router.navigate(['dashboard']);
      }, () => {
        this.error = true;
      });
  }
}
