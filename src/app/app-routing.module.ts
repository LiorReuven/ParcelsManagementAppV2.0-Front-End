import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesManagementPageComponent } from './pages/companies-management-page/companies-management-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ParcelsDashboardComponent } from './pages/parcels-management-page/components/parcels-dashboard/parcels-dashboard.component';
import { RecieveParcelPageComponent } from './pages/parcels-management-page/components/recieve-parcel-page/recieve-parcel-page.component';
import { StoragePageComponent } from './pages/parcels-management-page/components/storage-page/storage-page.component';
import { UpdateParcelPageComponent } from './pages/parcels-management-page/components/update-parcel-page/update-parcel-page.component';
import { ParcelsManagementPageComponent } from './pages/parcels-management-page/parcels-management-page.component';
import { ParcelsSearchPageComponent } from './pages/parcels-search-page/parcels-search-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';
import { StoragesManagementPageComponent } from './pages/storages-management-page/storages-management-page.component';
import { AuthGuard } from './services/auth/auth.guard';
import { LoginGuard } from './services/auth/login.guard';

const routes: Routes = [
  { path: 'login', canActivate:[LoginGuard], component: LoginPageComponent },
  {
    path: 'parcels-management',
    component: ParcelsManagementPageComponent,
    canActivate: [AuthGuard],
    canActivateChild:[AuthGuard],
    children: [
      {path:'parcels-dashboard', component:ParcelsDashboardComponent},
      {path:':name/:position/:color', component:StoragePageComponent},
      {path:'recieve-parcels', component:RecieveParcelPageComponent},
      {path:'update-parcels', component:UpdateParcelPageComponent},
      {path:'', redirectTo:'parcels-dashboard',pathMatch:'full'},
    ]
  },
  { path: 'search-parcels', component: ParcelsSearchPageComponent, canActivate: [AuthGuard] },
  { path: 'storages-management', component: StoragesManagementPageComponent, canActivate: [AuthGuard] },
  { path: 'companies-management', component: CompaniesManagementPageComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsPageComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/parcels-management/parcels-dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
