import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProdutosPageRoutingModule } from './produtos-routing.module';
import { ProdutosPage } from './produtos.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ProdutosPage,
    ProdutosPageRoutingModule
  ]
})
export class ProdutosPageModule {}
