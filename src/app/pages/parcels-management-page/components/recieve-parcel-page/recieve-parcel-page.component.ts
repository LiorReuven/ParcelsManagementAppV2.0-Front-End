import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Company } from 'src/app/models/Company.model';
import { Parcel } from 'src/app/models/Parcel.model';
import { Storage } from 'src/app/models/Storage.model';
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { ParcelsService } from 'src/app/services/parcels/parcels.service';
import { StoragesService } from 'src/app/services/storages/storages.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-recieve-parcel-page',
  templateUrl: './recieve-parcel-page.component.html',
  styleUrls: ['./recieve-parcel-page.component.css'],
})
export class RecieveParcelPageComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  stockParcels!: Parcel[];
  allStorages: Storage[] = [];
  allCompanies: Company[] = []
  selectedStorage!: Storage;
  selectedCompany!: Company;
  storageCompany!: string;
  error!: string;

  constructor(
    private parcelsService: ParcelsService,
    private storagesService: StoragesService,
    private toastService: ToastService,
    private companiesService: CompaniesService
  ) {}

  ngOnInit(): void {
    this.parcelsService.stockParcels$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.stockParcels = response;
      });

    this.storagesService.allStorages$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.allStorages = response;
      });

      this.companiesService.allCompanies$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.allCompanies = response;
      });
  }

  getStorageCompany(company: string) {
    this.storageCompany = company;
  }

  onSubmit(form: NgForm) {

    const enteredBarcode = form.controls['enteredBarcode']?.value?.toUpperCase().trim()
    const storageCompany = this.storageCompany.toUpperCase().trim()
    const selectedCompany = this.selectedCompany.name.toUpperCase().trim()


    // check if the barcode is a storage
    const isAStorage = this.allStorages.find((storage) => {
      return (
        enteredBarcode === storage.name
      );
    });
    if (isAStorage) {
      this.selectedStorage = isAStorage;
      form.controls['enteredBarcode'].reset();
      let audio = new Audio()
      audio.src = '../../assets/switch.mp3'
      audio.load()
      audio.play()
      return;
    }

    //check if barcode longer than 5
    if (!enteredBarcode || enteredBarcode.length < 5) {
      this.error = 'Barcode must be longer than 5 characters';
      const detail = this.error ? this.error : 'Unknown error occured'
      this.toastService.showError(detail);
      form.controls['enteredBarcode'].reset();
      return;
    }

    // check if parcel exists on stock
    const isAlreadyExist = this.stockParcels.find((stockParcel) => {
      return (
        stockParcel.barcode.toUpperCase().trim() ===
        enteredBarcode
      );
    });

    if (isAlreadyExist) {
      this.error = 'Parcel Already Exists';
      const detail = this.error ? this.error : 'Unknown error occured'
      this.toastService.showError(detail);
      form.controls['enteredBarcode'].reset();
      return;
    }

    //check if company is the same as the storage unless its 'none
    if (selectedCompany != storageCompany && storageCompany != 'NONE') {
      this.error = 'Cannot mix companies in the same storage'
      const detail = this.error ? this.error : 'Unknown error occured'
      this.toastService.showError(detail);
      form.controls['enteredBarcode'].reset();
      return;
    }

    const newParcel = {
      barcode: enteredBarcode,
      position: this.selectedStorage.name.toUpperCase().trim(),
      company: selectedCompany,
    };
    this.parcelsService.createParcel(newParcel).subscribe({
      next: (response) => {
        this.toastService.showSucess(response.message);
      },
      error: (err) => {
        const detail = err.error.message
        ? err.error.message
        : 'Unknown error occured';
      this.toastService.showError(detail);
      }
    });
    form.controls['enteredBarcode'].reset();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
