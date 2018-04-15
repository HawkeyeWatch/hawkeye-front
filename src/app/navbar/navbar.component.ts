import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { GlobalDataService } from '../global.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private ds: DataService,
    private gds: GlobalDataService,
    private router: Router,
  ) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.token) {
      this.gds.shareObj['loggedIn'] = user.token;
    }
  }
  logout() {
    localStorage.setItem('currentUser', null);
    this.gds.shareObj['loggedIn'] = undefined;
    this.router.navigate(['/']);
  }

}
