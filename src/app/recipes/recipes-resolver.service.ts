import { RecipesService } from './recipes.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "./recipe.model";

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private dataStorageServ: DataStorageService, private rs: RecipesService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this.rs.getRecipes();
    if (recipes.length === 0) return this.dataStorageServ.fetchRecipes();
    return recipes;
  }
}
