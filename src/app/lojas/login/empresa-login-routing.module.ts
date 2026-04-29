import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpresaLoginPage } from './empresa-login.page';

const routes: Routes = [
  {
    path: '',
    component: EmpresaLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaLoginPageRoutingModule {}
