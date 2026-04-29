import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilLojaPage } from './perfil.page';

const routes: Routes = [
  { path: '', component: PerfilLojaPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilLojaPageRoutingModule {}
