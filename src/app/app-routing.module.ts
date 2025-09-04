import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Carrega as rotas das páginas (cada uma tem seu routing.module)
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login-routing.module').then(m => m.LoginPageRoutingModule),
  },
  {
    path: 'cadastro',
    loadChildren: () =>
      import('./cadastro/cadastro-routing.module').then(m => m.CadastroPageRoutingModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
