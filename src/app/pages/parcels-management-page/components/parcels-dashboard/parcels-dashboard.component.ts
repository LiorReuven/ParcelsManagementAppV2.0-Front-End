import { Component, OnDestroy, OnInit } from '@angular/core';
import { ParcelsService } from 'src/app/services/parcels/parcels.service';
import { StoragesService } from 'src/app/services/storages/storages.service';
import { Parcel } from 'src/app/models/Parcel.model';
import { Subject, takeUntil } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { Storage } from 'src/app/models/Storage.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parcels-dashboard',
  templateUrl: './parcels-dashboard.component.html',
  styleUrls: ['./parcels-dashboard.component.css'],
})
export class ParcelsDashboardComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  formError: string | null = null;
  stockParcels: Parcel[] = [];
  allStorages: Storage[] = [];
  parcelUnstockForm!: FormGroup;
  displayModal: boolean = false;
  modalTitle: string = '';
  modalParcel!: Parcel;
  totalRecords!: number;

  constructor(
    private parcelsService: ParcelsService,
    private storagesService: StoragesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.parcelUnstockForm = new FormGroup({
      barcode: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [],
      }),
    });

    this.parcelsService.stockParcels$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.stockParcels = response;
      });

    this.storagesService.allStorages$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response) => {
          this.allStorages = response;
          this.totalRecords = this.allStorages.length;
        },
      });
  }

  toStorageHandler(storage: Storage) {
    this.router.navigate([`/parcels-management/${storage.name}/${storage.position}/${storage.color}`]);
  }

  onHideModal() {
    this.displayModal = false;
  }

  onBarcodeButtonClick() {
    this.onSubmitBarcode();
  }

  onSubmitBarcode() {
    const enteredBarcode = this.parcelUnstockForm?.value?.barcode?.toUpperCase().trim();
    if (!enteredBarcode || enteredBarcode.length < 5) {
      this.formError = 'Barcode must be atleast 5 characters';
      return;
    }
    const isUniqueArray = this.stockParcels.filter((parcel) => {
      return parcel.barcode.includes(enteredBarcode);
    });

    if (isUniqueArray?.length > 1) {
      this.formError = 'Barcode exist more than once';
    } else if (isUniqueArray.length === 1) {
      this.modalParcel = isUniqueArray[0];
      this.modalTitle = 'Release a parcel from the stock';
      this.parcelUnstockForm.reset();
      this.displayModal = true;
      this.formError = null;
    } else if (isUniqueArray.length < 1) {
      this.formError = 'Parcel doesnt exist';
    } else {
      this.formError = 'Bad request';
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

@Pipe({
  name: 'parcelsDashboardPipe',
  pure: true,
})
export class ParcelsDashboardPipe implements PipeTransform {
  parcelsArray: Parcel[] = [];

  transform(
    storage: Storage,
    stockParcels: Parcel[],
    isAmount: boolean
  ): number | string {
    this.parcelsArray = stockParcels.filter((parcel) => {
      return parcel.position === storage.name;
    });

    if (isAmount) {
      return this.parcelsArray.length;
    } else {
      if (this.parcelsArray.length > 0) {
        return this.parcelsArray[0].company;
      } else {
        return 'None';
      }
    }
  }
}
