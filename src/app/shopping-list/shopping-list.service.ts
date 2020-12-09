import { Injectable } from '@angular/core';

import { Ingredient } from './../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Tomato', 10)
  ];
  ingredientsChanged = new Subject<Ingredient[]>();

  getIngredients(): Ingredient[] { return this.ingredients.slice(); }
  add(name: string, amount: number): void {
    const ingredient = new Ingredient(name, amount);
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.getIngredients());
  }
  addArray(ingredientsArray: Ingredient[]): void {
    this.ingredients = this.ingredients.concat(ingredientsArray);
    this.ingredientsChanged.next(this.getIngredients());
  }
}
