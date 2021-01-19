import { Recipe } from './../recipe.model';
import { ShoppingListService } from './../../shopping-list/shopping-list.service';
import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { AddIngredients } from './../../shopping-list/store/shopping-list.actions';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private slService: ShoppingListService,
    private recipeServ: RecipesService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.recipe = this.recipeServ.getRecipes()[+this.route.snapshot.params.id];
    this.id = +this.route.snapshot.params.id;
    this.route.params.subscribe(
      (params: Params) => {
        this.recipe = this.recipeServ.getRecipes()[+params.id];
        this.id = +params.id;
      }
    );
  }
  addToShoppingList(): void {
    // this.slService.addArray(this.recipe.ingredients);
    this.store.dispatch(new AddIngredients(this.recipe.ingredients));
  }
  onDelete() {
    this.recipeServ.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

}
