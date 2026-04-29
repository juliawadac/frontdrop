import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PerfilLojaPageRoutingModule } from './perfil-routing.module';
import { PerfilLojaPage } from './perfil.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PerfilLojaPage,
    PerfilLojaPageRoutingModule
  ]
})
export class PerfilLojaPageModule {}
