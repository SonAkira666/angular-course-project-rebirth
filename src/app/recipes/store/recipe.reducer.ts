import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipe.actions';

export interface State {
  recipes: Recipe[]
}

const initialState: State = {
  recipes: []
}

export function recipeReducer(state = initialState, action: RecipesActions.RecipesActions) {
  switch (action.type) {
    case RecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: action.payload
      }
    case RecipesActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      }
    case RecipesActions.UPDATE_RECIPE:
      const newRecipes = state.recipes.slice();
      newRecipes[action.payload.index] = action.payload.newRecipe;
      return {
        ...state,
        recipes: newRecipes
      }
    case RecipesActions.DELETE_RECIPE:
      const shorterArray = state.recipes.slice();
      shorterArray.splice(action.payload, 1);
      return {
        ...state,
        recipes: shorterArray
      }
    default:
      return state;
  }
}
