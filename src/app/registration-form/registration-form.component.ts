import { Component, OnInit } from '@angular/core';

import { User } from '../models/user';
import { DataService } from '../data.service';


@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  regUser = new User();

  error: String;
  success = false;

  constructor(
    private ds: DataService,
  ) {

  }

  ngOnInit() {
  }

  registerUser() {
    this.error = '';
    this.ds.register(this.regUser).subscribe(
      res => {
        console.log(res);
        this.success = true;
      },
      err => {
        console.log(err)
        this.error = err.error.error;
      }
    )
  }

}
