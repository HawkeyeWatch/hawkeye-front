import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GlobalDataService } from './global.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(
    private gds: GlobalDataService,
    private router: Router,
  ) {}

  canActivate() {
    if (this.gds.shareObj['loggedIn']) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
