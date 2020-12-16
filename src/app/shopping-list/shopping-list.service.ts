import { Injectable } from '@angular/core';

import { Ingredient } from './../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  startedEditing = new Subject<number>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Tomato', 10)
  ];
  ingredientsChanged = new Subject<Ingredient[]>();

  getIngredients(): Ingredient[] { return this.ingredients.slice(); }
  getIngredient(index: number): Ingredient { return this.ingredients[index]; }
  add(name: string, amount: number): void {
    const ingredient = new Ingredient(name, amount);
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.getIngredients());
  }
  addArray(ingredientsArray: Ingredient[]): void {
    this.ingredients = this.ingredients.concat(ingredientsArray);
    this.ingredientsChanged.next(this.getIngredients());
  }
  updateIngredient(index: number, ingredient: Ingredient): void {
    this.ingredients[index] = ingredient;
    this.ingredientsChanged.next(this.getIngredients());
  }
  removeIngredient(index: number): void {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.getIngredients());
  }
}
