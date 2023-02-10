import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Storage } from 'src/app/models/Storage.model';
import { LoadingErrorService } from 'src/app/services/loadingError/loading-error.service';
import { StoragesService } from 'src/app/services/storages/storages.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-storages-management-page',
  templateUrl: './storages-management-page.component.html',
  styleUrls: ['./storages-management-page.component.css'],
  providers: [ConfirmationService],
})
export class StoragesManagementPageComponent implements OnInit {
  allStorages: Storage[] = [];
  selectedStorages!: Storage[];
  storageDialog: boolean = false;
  storage!: Storage;
  isUpdate: boolean = false;
  prevStorageSnap!: Storage;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private storagesService: StoragesService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private loadingErrorService:LoadingErrorService
  ) {}

  ngOnInit(): void {
    this.storagesService.allStorages$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.allStorages = response;
      });
  }

  deleteSelectedStorages() {
    this.toastService.showError('Currently not supported');
  }

  openNew() {
    this.storage = { name: '', color: '', position: 1 };
    this.isUpdate = false;
    this.storageDialog = true;
  }

  editStorage(storage: Storage) {
    this.storage = { ...storage };
    this.prevStorageSnap = { ...storage };
    this.isUpdate = true;
    this.storageDialog = true;
  }

  deleteStorage(storage: Storage) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${storage.name}" ? `,
      header: 'Delete Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingErrorService.isLoading$.next(true)
        this.storagesService.deleteStorage(storage).subscribe({
          next: (response) => {
            this.loadingErrorService.isLoading$.next(false)
            this.toastService.showSucess(response.message);
          },
          error: (err) => {
            this.loadingErrorService.isLoading$.next(false)
            const detail = err.error.message
              ? err.error.message
              : 'Unknown error occured';
            this.toastService.showError(detail);
          },
        });
      },
    });
  }

  updateStorageSubmit() {
    if (
      this.storage.color === '' ||
      !this.storage.position ||
      this.storage.name === ''
    ) {
      this.toastService.showError('Please fill the required information');
      return;
    }

    const isAlreadyExists = this.allStorages.find((storage) => {
      return (
        storage.name.toUpperCase().trim() === this.storage.name.toUpperCase().trim() &&
        storage.name.toUpperCase().trim() !== this.prevStorageSnap.name.toUpperCase().trim()
      );
    });
    if (isAlreadyExists) {
      this.toastService.showError('Storage Name Is Taken');
      return;
    }
    this.confirmationService.confirm({
      message: 'Are you sure you want to update ' + this.storage.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingErrorService.isLoading$.next(true)
        this.storagesService.updateStorage(this.storage).subscribe({
          next: (response) => {
            this.loadingErrorService.isLoading$.next(false)
            this.toastService.showSucess(response.message);
            this.storageDialog = false;
          },
          error: (err) => {
            this.loadingErrorService.isLoading$.next(false)
            const detail = err.error.message
              ? err.error.message
              : 'Unknown error occured';
            this.toastService.showError(detail);
          },
        });
      },
    });
  }

  createStorageSubmit() {
    if (
      this.storage.color === '' ||
      !this.storage.position ||
      this.storage.name === ''
    ) {
      this.toastService.showError('Please fill the required information');
      return;
    }

    const isAlreadyExists = this.allStorages.find((storage) => {
      return storage.name.toUpperCase().trim() === this.storage.name.toUpperCase().trim();
    });
    if (isAlreadyExists) {
      this.toastService.showError('Storage Name Is Taken');
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure you want to create ' + this.storage.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingErrorService.isLoading$.next(true)
        this.storagesService.createStorage(this.storage).subscribe({
          next: (response) => {
            this.loadingErrorService.isLoading$.next(false)
            this.toastService.showSucess(response.message);
            this.storageDialog = false;
          },
          error: (err) => {
            this.loadingErrorService.isLoading$.next(false)
            const detail = err.error.message
              ? err.error.message
              : 'Unknown error occured';
            this.toastService.showError(detail);
          },
        });
      },
    });
  }

  hideDialog() {
    this.storageDialog = false;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
