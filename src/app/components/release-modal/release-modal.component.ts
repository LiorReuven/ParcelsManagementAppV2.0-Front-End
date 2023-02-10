import { Component, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Company } from 'src/app/models/Company.model';
import { Parcel } from 'src/app/models/Parcel.model';
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { LoadingErrorService } from 'src/app/services/loadingError/loading-error.service';
import { ParcelsService } from 'src/app/services/parcels/parcels.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-release-modal',
  templateUrl: './release-modal.component.html',
  styleUrls: ['./release-modal.component.css'],
})
export class ReleaseModalComponent implements OnInit, OnDestroy {
  @Input() displayModal: boolean = false;
  @Input() title: string = 'Placeholder Title';
  @Input() parcel!: Parcel;
  @Output() onHideModal = new EventEmitter();
  error: string = '';
  allCompanies:Company[] = []

  private ngUnsubscribe = new Subject<void>();


  constructor(
    private parcelsService: ParcelsService,
    private toastService: ToastService,
    private companiesService: CompaniesService,
    private loadingErrorService:LoadingErrorService
  ) {}

  ngOnInit(): void {

    this.companiesService.allCompanies$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.allCompanies = response;
      });

  }

  onConfirmation() {
    this.onHideModal.emit();
    this.loadingErrorService.isLoading$.next(true);
    this.parcelsService.unstockParcel(this.parcel).subscribe({
      next: (response) => {
        const foundCompany = this.allCompanies.find((company)=> {
          return company.name.toUpperCase().trim() === this.parcel.company.toUpperCase().trim()
        })
        this.loadingErrorService.isLoading$.next(false);
        this.toastService.showSucess(response.message);
        if(foundCompany && foundCompany.releaseUrl) {
          window.open(foundCompany.releaseUrl.replace('PLACEHERE', this.parcel.barcode), '_blank');
        }
      },
      error: (err) => {
        this.loadingErrorService.isLoading$.next(false);
        const detail = err.error.message
          ? err.error.message
          : 'Unknown error occured';
        this.toastService.showError(detail);
      },
    });
  }

  onFormSubmit(form: NgForm) {
    const enteredBarcode = form.controls['enteredBarcode'].value
      .toUpperCase()
      .trim();
    if (enteredBarcode === this.parcel.barcode) {
      this.onConfirmation();
    } else {
      this.error = 'Barcode Doesnt Match';
    }
  }

  onHide() {
    this.onHideModal.emit();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
