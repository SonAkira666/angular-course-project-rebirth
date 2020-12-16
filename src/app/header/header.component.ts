import { Component } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  collapsed = true;

  constructor(private dataServ: DataStorageService) {}
  onSaveData() {
    this.dataServ.storeRecipes();
  }
  onFetchData() {
    this.dataServ.fetchRecipes().subscribe();
  }
}
