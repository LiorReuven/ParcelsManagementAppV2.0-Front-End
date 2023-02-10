import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Company } from './models/Company.model';
import { Parcel } from './models/Parcel.model';
import { Storage } from './models/Storage.model';
import { AuthService } from './services/auth/auth.service';
import { CompaniesService } from './services/companies/companies.service';
import { LoadingErrorService } from './services/loadingError/loading-error.service';
import { ParcelsService } from './services/parcels/parcels.service';
import { SocketService } from './services/socket/socket.service';
import { StoragesService } from './services/storages/storages.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  isLoading: boolean = false;
  isAuth: boolean = false;
  completedCounter: number = 0;
  error!: string | null;

  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private socketService: SocketService,
    private parcelsService: ParcelsService,
    private storagesService: StoragesService,
    private companiesService: CompaniesService,
    private loadingErrorService: LoadingErrorService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    if (localStorage.getItem('profile')) {
      this.authService.autoLogin();
    }

    this.loadingErrorService.isLoading$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response) => {
          this.isLoading = response;
        },
      });

    this.loadingErrorService.error$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response) => {
          this.error = response;
        },
      });

    this.authService.user.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (response) => {
        this.isAuth = !!response;


        //only run if user is logged 

        if (this.isAuth) {
          this.completedCounter = 0;
          this.loadingErrorService.isLoading$.next(true);

          this.companiesService.fetchCompanies().subscribe({
            next: () => {
              this.completedCounter++;
              if (this.completedCounter === 3) {
                this.loadingErrorService.isLoading$.next(false);
              }
            },
            error: (err) => {
              if (err.error.message) {
                this.loadingErrorService.error$.next(err.error.message);
              } else {
                this.loadingErrorService.error$.next('Unknown server error');
              }
            },
          });
          this.storagesService.fetchStorages().subscribe({
            next: () => {
              this.completedCounter++;
              if (this.completedCounter === 3) {
                this.loadingErrorService.isLoading$.next(false);
              }
            },
            error: (err) => {
              if (err.error.message) {
                this.loadingErrorService.error$.next(err.error.message);
              } else {
                this.loadingErrorService.error$.next('Unknown server error');
              }
            },
          });
          this.parcelsService.fetchParcels().subscribe({
            next: () => {
              this.completedCounter++;
              if (this.completedCounter === 3) {
                this.loadingErrorService.isLoading$.next(false);
              }
            },
            error: (err) => {
              if (err.error.message) {
                this.loadingErrorService.error$.next(err.error.message);
              } else {
                this.loadingErrorService.error$.next('Unknown server error');
              }
            },
            complete: () => {},
          });
        }
      },
    });

    this.socketService.isSocketInit$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response) => {

          //only run if socket init


          if (response) {
            // Parcels listeners
            this.socketService
              .listen('createParcel')
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (data) => {
                  const createdParcel: Parcel = data as Parcel;
                  this.parcelsService.createParcelLocal(createdParcel);
                },
              });

            this.socketService
              .listen('unstockParcel')
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (data) => {
                  const unstockedParcel: Parcel = data as Parcel;
                  this.parcelsService.unstockParcelLocal(unstockedParcel);
                },
              });

            this.socketService
              .listen('updateParcel')
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (data) => {
                  const updatedParcel: Parcel = data as Parcel;
                  this.parcelsService.updateParcelLocal(updatedParcel);
                },
              });

            this.socketService
              .listen('deleteParcel')
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (data) => {
                  const deletedParcel: Parcel = data as Parcel;
                  this.parcelsService.deleteParcelLocal(deletedParcel);
                },
              });

            // storages listeners

            this.socketService
              .listen('createStorage')
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (data) => {
                  const updatedStorages: Storage[] = data as Storage[];
                  this.storagesService.createStorageLocal(updatedStorages);
                },
              });

            this.socketService
              .listen('updateStorage')
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (data) => {
                  const updatedStorages: Storage[] = data as Storage[];
                  this.storagesService.updateStorageLocal(updatedStorages);
                },
              });

            this.socketService
              .listen('deleteStorage')
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (data) => {
                  const updatedStorages: Storage[] = data as Storage[];
                  this.storagesService.deleteStorageLocal(updatedStorages);
                },
              });

            // companies listeners

            this.socketService
              .listen('createCompany')
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (data) => {
                  const createdCompany: Company = data as Company;
                  this.companiesService.createCompanyLocal(createdCompany);
                },
              });

            this.socketService
              .listen('updateCompany')
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (data) => {
                  const updatedCompany: Company = data as Company;
                  this.companiesService.updateCompanyLocal(updatedCompany);
                },
              });

            this.socketService
              .listen('deleteCompany')
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (data) => {
                  const deletedCompany: Company = data as Company;
                  this.companiesService.deleteCompanyLocal(deletedCompany);
                },
              });
          }



        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
