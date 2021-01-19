import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';
import * as fromApp from '../../store/app.reducer';

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

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    // this.editSub = this.shoppingListService.startedEditing.subscribe(
    //   (index: number) => {
    //     this.editMode = true;
    //     this.editedItemIndex = index;
    //     this.editedItem = this.shoppingListService.getIngredient(index);
    //     this.form.setValue({ name: this.editedItem.name, amount: this.editedItem.amount });
    //   }
    // );
    this.editSub = this.store.select('shoppingList').subscribe(state => {
      this.editMode = state.editedIngredientIndex !== -1;
      if (this.editMode) {
        this.editedItemIndex = state.editedIngredientIndex;
        this.editedItem = state.editedIngredient;
        console.log(this.form.value);
        if (this.form && this.form.value) this.form.setValue({ name: this.editedItem.name, amount: this.editedItem.amount });
      } else {
        if (this.form) this.form.reset();
      }
    });
  }
  onSubmit(): void {
    const newIngredient = new Ingredient(this.form.value.name, this.form.value.amount);
    if (this.editMode) {
      // this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch(new ShoppingListActions.UpdpateIngredient(newIngredient));
    } else {
      // this.shoppingListService.add(this.form.value.name, this.form.value.amount);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.onClear();
  }
  onClear(): void {
    // this.form.reset();
    // this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
  onRemove(): void {
    if (this.editMode) {
      // this.shoppingListService.removeIngredient(this.editedItemIndex);
      this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.editedItemIndex));
    }
    this.onClear();
  }
  ngOnDestroy(): void {
    this.editSub.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

}
