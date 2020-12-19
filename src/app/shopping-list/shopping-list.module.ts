import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";

import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [SharedModule, FormsModule, RouterModule.forChild([{ path: '', component: ShoppingListComponent }])]
})
export class ShoppingListModule {}
