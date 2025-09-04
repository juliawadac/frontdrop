import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login-routing.module').then(m => m.LoginPageRoutingModule)
  },
  {
    path: 'sacola',
    loadChildren: () => import('./sacola/sacola-module').then(m => m.SacolaPageModule)
  },
  {
    path: 'cadastro',
    loadChildren: () =>
      import('./cadastro/cadastro-routing.module').then(m => m.CadastroPageRoutingModule)
  },
   { 
    path: 'home', 
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) 
  },
  {
    path: 'estabelecimento',
    loadComponent: () => import('./estabelecimento/estabelecimento.page').then( m => m.EstabelecimentoPage)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil-module').then( m => m.PerfilModule)
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
