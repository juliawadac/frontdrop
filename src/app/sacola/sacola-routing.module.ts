import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SacolaPage } from './sacola.component';

const routes: Routes = [
  {
    path: '',
    component: SacolaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SacolaPageRoutingModule {}