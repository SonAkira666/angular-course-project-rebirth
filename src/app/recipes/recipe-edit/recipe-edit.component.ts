import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import * as fromApp from 'src/app/store/app.reducer';
import * as RecipesActions from './../store/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  recipeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private recServ: RecipesService,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.editMode = params.id != null;
        this.initForm();
      }
    );
  }
  ngOnDestroy() {
    if (this.recipeSub) {
      this.recipeSub.unsubscribe();
    }
  }
  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }
  private initForm() {
    let recipeName = '';
    let recipeImgPath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.recipeSub = this.store.select('recipes').pipe(
        map(state => {
          return state.recipes.find((recipe, index) => {
            return this.id === index;
          });
        })
      ).subscribe(recipe => {
        recipeName = recipe.name;
        recipeImgPath = recipe.imagePath;
        recipeDescription = recipe.description;
        if (recipe.ingredients) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(this.createIngredientForm(ingredient.name, ingredient.amount));
          }
        }
      });
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imgPath': new FormControl(recipeImgPath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }
  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(this.createIngredientForm());
  }
  onSubmit() {
    const recipe = new Recipe(
      this.recipeForm.value.name,
      this.recipeForm.value.description,
      this.recipeForm.value.imgPath,
      this.recipeForm.value.ingredients);
    if (this.editMode) {
      // this.recServ.updateRecipe(this.id, recipe);
      this.store.dispatch(new RecipesActions.UpdateRecipe({index: this.id, newRecipe: recipe}));
    } else {
      // this.recServ.addRecipe(recipe);
      this.store.dispatch(new RecipesActions.AddRecipe(recipe));
    }

    this.onCancel();
  }
  createIngredientForm(name: string = null, amount: number = null): FormGroup {
    return new FormGroup({
        'name': new FormControl(name, Validators.required),
        'amount': new FormControl(amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
  }
  onCancel() {
    this.router.navigate(['/recipes']);
  }
  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

}
