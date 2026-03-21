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
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login-routing.module').then(m => m.LoginPageRoutingModule)
  },
  {
    path: 'cadastro',
    loadChildren: () =>
      import('./cadastro/cadastro-routing.module').then(m => m.CadastroPageRoutingModule)
  },
  {
    path: 'sacola',
    loadChildren: () => import('./sacola/sacola-module').then(m => m.SacolaPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home-routing.module').then(m => m.HomePageRoutingModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil-routing.module').then(m => m.PerfilPageRoutingModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule)
  },
  {
    path: 'estabelecimento/:id',
    loadComponent: () =>
      import('./estabelecimento/estabelecimento.page').then(m => m.EstabelecimentoPage)
  },
  {
    path: 'esqueci-senha',
    loadChildren: () =>
      import('./esqueci-senha/esqueci-senha.module').then(m => m.EsqueciSenhaPageModule)
  },

  // -----------------------------------------------
  // ROTAS DA EMPRESA  (pasta lojas/)
  // -----------------------------------------------
  {
    path: 'lojas/login',
    loadChildren: () =>
      import('./lojas/login/empresa-login.module').then(m => m.EmpresaLoginPageModule)
  },
  {
    path: 'lojas/cadastro',
    loadChildren: () =>
      import('./lojas/cadastro/empresa-cadastro.module').then(m => m.EmpresaCadastroPageModule)
  },
  {
    path: 'lojas/dashboard',
    loadChildren: () =>
      import('./lojas/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}