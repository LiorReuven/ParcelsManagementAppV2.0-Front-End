import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PrimengModule } from './primeng.module';
import { FormsModule } from '@angular/forms';
//Components
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LoginFormComponent } from './pages/login-page/components/login-form/login-form.component';
import { ParcelsManagementPageComponent } from './pages/parcels-management-page/parcels-management-page.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AuthInterceptorService } from './services/auth-interceptor/auth-interceptor.service';
import { ParcelsDashboardComponent } from './pages/parcels-management-page/components/parcels-dashboard/parcels-dashboard.component';
import { ParcelsDashboardPipe } from './pages/parcels-management-page/components/parcels-dashboard/parcels-dashboard.component';
import { RecieveParcelPageComponent } from './pages/parcels-management-page/components/recieve-parcel-page/recieve-parcel-page.component';
import { StorageBoxComponent } from './components/storage-box/storage-box.component';
import { UpdateParcelPageComponent } from './pages/parcels-management-page/components/update-parcel-page/update-parcel-page.component';
import { ParcelsSearchPageComponent } from './pages/parcels-search-page/parcels-search-page.component';
import { ReleaseModalComponent } from './components/release-modal/release-modal.component';
import { ParcelActionsModalComponent } from './components/parcel-actions-modal/parcel-actions-modal.component';
import { MessageService } from 'primeng/api';
import { StoragePageComponent } from './pages/parcels-management-page/components/storage-page/storage-page.component';
import { StoragesManagementPageComponent } from './pages/storages-management-page/storages-management-page.component';
import { CompaniesManagementPageComponent } from './pages/companies-management-page/companies-management-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';
import { StoragesListComponent } from './components/storages-list/storages-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    LoginFormComponent,
    ParcelsManagementPageComponent,
    NavBarComponent,
    ParcelsDashboardComponent,
    ParcelsDashboardPipe,
    ReleaseModalComponent,
    RecieveParcelPageComponent,
    StorageBoxComponent,
    UpdateParcelPageComponent,
    ParcelsSearchPageComponent,
    ParcelActionsModalComponent,
    StoragePageComponent,
    StoragesManagementPageComponent,
    CompaniesManagementPageComponent,
    ReportsPageComponent,
    StoragesListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    PrimengModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    MessageService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
