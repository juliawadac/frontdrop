import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { EmpresaLoginPageRoutingModule } from './empresa-login-routing.module';
import { EmpresaLoginPage } from './empresa-login.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EmpresaLoginPage, // standalone
    EmpresaLoginPageRoutingModule
  ]
})
export class EmpresaLoginPageModule {}
