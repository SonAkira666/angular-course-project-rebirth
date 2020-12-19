import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  collapsed = true;
  private userSub: Subscription;

  constructor(private dataServ: DataStorageService, private authServ: AuthService) {}
  ngOnInit() {
    this.userSub = this.authServ.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }
  onLogout() {
    this.authServ.logout();
  }
  onSaveData() {
    this.dataServ.storeRecipes();
  }
  onFetchData() {
    this.dataServ.fetchRecipes().subscribe();
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
