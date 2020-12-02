import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ShoppingListService } from './../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput') nameInput: ElementRef;
  @ViewChild('amountInput') amountInput: ElementRef;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
  }
  onAdd(): void {
    this.shoppingListService.add(this.nameInput.nativeElement.value, this.amountInput.nativeElement.value);
  }

}
