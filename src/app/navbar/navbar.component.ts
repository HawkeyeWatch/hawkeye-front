import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { GlobalDataService } from '../global.service';
import { Router } from '@angular/router';

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

  private catch(err) {
    if (err.status === 401) {
      this.ds.logout();
    }
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.token) {
      this.gds.shareObj['loggedIn'] = user.token;
    }
    this.ds.getUser()
    .subscribe(res => {
      if (res) {
        this.gds.shareObj['loggedIn'] = user.token;
        this.gds.shareObj['currentUser'] = res;
        this.gds.shareObj['currentUser'].token = user.token;
      }
    }, (err) => {
      this.catch(err);
    });

  }
  logout() {
    localStorage.setItem('currentUser', null);
    this.gds.shareObj['loggedIn'] = undefined;
    this.router.navigate(['/']);
  }

}
