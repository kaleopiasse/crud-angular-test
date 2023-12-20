import { Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { CreateUpdateComponent } from './pages/create-update/create-update.component';

export const routes: Routes = [
  {
    path:'', component: ListComponent,
  },
  {
    path: 'create', component: CreateUpdateComponent,
    data: {
      title: 'ADICIONAR CLIENTE'
    }
  },
  {
    path: 'details/:id', component: CreateUpdateComponent,
    data: {
      title: 'DETALHES DO CLIENTE'
    }
  }
];
