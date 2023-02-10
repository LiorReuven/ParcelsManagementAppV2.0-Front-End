import { Component, Input, EventEmitter, Output, OnInit} from '@angular/core';
import { Parcel } from 'src/app/models/Parcel.model';
import { ParcelsService } from 'src/app/services/parcels/parcels.service';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from 'src/app/services/toast/toast.service';
import { LoadingErrorService } from 'src/app/services/loadingError/loading-error.service';

@Component({
  selector: 'app-parcel-actions-modal',
  templateUrl: './parcel-actions-modal.component.html',
  styleUrls: ['./parcel-actions-modal.component.css'],
  providers: [ConfirmationService],
})
export class ParcelActionsModalComponent {
  @Input() displayModal: boolean = false;
  @Input() title: string = 'Placeholder Title';
  @Input() parcel!: Parcel;
  @Output() onHideModal = new EventEmitter();
  error: string = '';


  constructor(
    private parcelsService: ParcelsService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private loadingErrorService:LoadingErrorService
  ) {}


  onLock() {

    if (!this.parcel.isOnStock) {
      this.toastService.showError('Parcel is out of stock')
      return
    }
    
    this.confirmationService.confirm({
      message:
        'Are you sure that you want to lock this parcel for returns?',
      header: 'Unlock confirmation',
      accept: () => {
        this.loadingErrorService.isLoading$.next(true)
        this.parcelsService.lockReturnsParcel(this.parcel).subscribe({
          next: (response) => {
            this.loadingErrorService.isLoading$.next(false)
            this.toastService.showSucess(response.message);
            this.onHideModal.emit();
          },
          error: (err) => {
            this.loadingErrorService.isLoading$.next(false)
            const detail = err.error.message
              ? err.error.message
              : 'Unknown error occured';
            this.toastService.showError(detail);
            this.onHideModal.emit();
          },
        });
      },
    });


  }

  onUnlock() {

    if (!this.parcel.isOnStock) {
      this.toastService.showError('Parcel is out of stock')
      return
    }

    this.confirmationService.confirm({
      message:
        'Are you sure that you want to Unlock this parcel for returns?',
      header: 'Unlock confirmation',
      accept: () => {
        this.loadingErrorService.isLoading$.next(true)
        this.parcelsService.unlockReturnsParcel(this.parcel).subscribe({
          next: (response) => {
            this.loadingErrorService.isLoading$.next(false)
            this.toastService.showSucess(response.message);
            this.onHideModal.emit();
          },
          error: (err) => {
            this.loadingErrorService.isLoading$.next(false)
            const detail = err.error.message
              ? err.error.message
              : 'Unknown error occured';
            this.toastService.showError(detail);
            this.onHideModal.emit();
          },
        });
      },
    });

  }

  onReturn() {

    if (!this.parcel.isOnStock) {
      this.toastService.showError('Parcel is out of stock' )
      return
    }

    if (this.parcel.returnLocked) {
      this.toastService.showError('Parcel is locked for returns')
      return
    }


    this.confirmationService.confirm({
      message:
        'Are you sure that you want to return this parcel back to the company?',
      header: 'Return confirmation',
      accept: () => {
        this.loadingErrorService.isLoading$.next(true)
        this.parcelsService.returnParcel(this.parcel).subscribe({
          next: (response) => {
            this.loadingErrorService.isLoading$.next(false)
            this.toastService.showSucess(response.message);
            this.onHideModal.emit();
          },
          error: (err) => {
            this.loadingErrorService.isLoading$.next(false)
            const detail = err.error.message
              ? err.error.message
              : 'Unknown error occured';
            this.toastService.showError(detail);
            this.onHideModal.emit();
          },
        });
      },
    });
  }

  onDelete() {
    this.confirmationService.confirm({
      message:
        'Are you sure that you want to delete this parcel from the database?',
      header: 'Delete confirmation',
      accept: () => {
        this.loadingErrorService.isLoading$.next(true)
        this.parcelsService.deleteParcel(this.parcel).subscribe({
          next: (response) => {

            this.loadingErrorService.isLoading$.next(false)
            this.toastService.showSucess(response.message);
            this.onHideModal.emit();
          },
          error: (err) => {
            this.loadingErrorService.isLoading$.next(false)
            const detail = err.error.message? err.error.message: 'Unknown error occured';
            this.onHideModal.emit();
            this.toastService.showError(detail);
          },
        });
      },
    });
  }

  onHide() {
    this.onHideModal.emit();
  }



}
