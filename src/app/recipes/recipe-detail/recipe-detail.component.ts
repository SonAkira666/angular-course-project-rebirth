import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from './../recipe.model';
import { RecipesService } from '../recipes.service';
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
    private recipeServ: RecipesService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.recipe = this.recipeServ.getRecipes()[+this.route.snapshot.params.id];
    this.id = +this.route.snapshot.params.id;
    this.route.params.pipe(
      switchMap(params => {
        this.id = +params.id;
        return this.store.select('recipes');
      })
    ).subscribe(
      (recState) => {
        this.recipe = recState.recipes.find((recipe, index) => {
          return index === this.id;
        });
      }
    );
  }
  addToShoppingList(): void {
    this.store.dispatch(new AddIngredients(this.recipe.ingredients));
  }
  onDelete() {
    this.recipeServ.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

}
