import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'pedidos',
        loadChildren: () =>
          import('./pedidos/pedidos.module').then(m => m.PedidosPageModule)
      },
      {
        path: 'historico',
        loadChildren: () =>
          import('./historico/historico.module').then(m => m.HistoricoPageModule)
      },
      {
        path: 'produtos',
        loadChildren: () =>
          import('./produtos/produtos.module').then(m => m.ProdutosPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('./perfil/perfil.module').then(m => m.PerfilLojaPageModule)
      },
      {
        path: '',
        redirectTo: 'pedidos',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardPageRoutingModule {}