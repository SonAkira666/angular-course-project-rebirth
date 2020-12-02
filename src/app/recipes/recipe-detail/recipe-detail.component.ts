import { Recipe } from './../recipe.model';
import { ShoppingListService } from './../../shopping-list/shopping-list.service';
import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;

  constructor(private slService: ShoppingListService, private recipeServ: RecipesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.recipe = this.recipeServ.getRecipes()[+this.route.snapshot.params.id];
    this.route.params.subscribe(
      (params: Params) => {
        this.recipe = this.recipeServ.getRecipes()[params.id];
      }
    );
  }
  addToShoppingList(): void {
    this.slService.addArray(this.recipe.ingredients);
  }

}
