import { Component, OnDestroy, OnInit } from '@angular/core';
import { ParcelsService } from 'src/app/services/parcels/parcels.service';
import { Parcel } from 'src/app/models/Parcel.model';
import { Subject, takeUntil } from 'rxjs';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-parcels-search-page',
  templateUrl: './parcels-search-page.component.html',
  styleUrls: ['./parcels-search-page.component.css'],
})

export class ParcelsSearchPageComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  allParcels:Parcel[] = []
  totalRecords: number = 0;

  displayModal: boolean = false;
  modalTitle: string = '';
  modalParcel!: Parcel;

  constructor(
    private parcelsService: ParcelsService,
  ) {}



  ngOnInit(): void {
    
      
    this.parcelsService.allParcels$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response) => {
          this.allParcels = response;
          this.totalRecords = this.allParcels.length
        },
      });



  }

  onActionsClick(parcel: Parcel) {
this.modalParcel = parcel
this.modalTitle = 'Parcels Actions'
this.displayModal = true
  }

  onHideModal() {
    this.displayModal = false;
  }

  clear(table: Table) {
    table.clear();
}

  
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
