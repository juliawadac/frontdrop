import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
  path: '',
  redirectTo: 'welcome',
  pathMatch: 'full'
  },
  {
  path: 'welcome',
  loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomePageModule)
  },
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
    loadChildren: () => import('./home/home-routing.module').then(m => m.HomePageRoutingModule) 
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule)
  },
  {
    path: 'estabelecimento/:id', // Adicionamos /:id para capturar o parâmetro
    loadComponent: () => import('./estabelecimento/estabelecimento.page').then( m => m.EstabelecimentoPage)
  },
  



];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
