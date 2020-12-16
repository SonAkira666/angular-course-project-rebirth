import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';

import { ShoppingListService } from './../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) form: NgForm;
  editSub: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.editSub = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.form.setValue({ name: this.editedItem.name, amount: this.editedItem.amount });
      }
    );
  }
  onSubmit(): void {
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, new Ingredient(this.form.value.name, this.form.value.amount));
    } else {
      this.shoppingListService.add(this.form.value.name, this.form.value.amount);
    }
    this.onClear();
  }
  onClear(): void {
    this.form.reset();
    this.editMode = false;
  }
  onRemove(): void {
    if (this.editMode) {
      this.shoppingListService.removeIngredient(this.editedItemIndex);
    }
    this.onClear();
  }
  ngOnDestroy(): void {
    this.editSub.unsubscribe();
  }

}
