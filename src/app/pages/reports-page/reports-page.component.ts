import { Component, OnDestroy, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { Parcel } from 'src/app/models/Parcel.model';
import { ParcelsService } from 'src/app/services/parcels/parcels.service';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { Company } from 'src/app/models/Company.model';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.css'],
})
export class ReportsPageComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  allParcels: Parcel[] = [];
  filteredArray: Parcel[] = [];
  totalRecords: number = 0;
  cols!: any[];
  exportColumns!: any[];
  allCompanies: Company[] = [];
  selectedCompany!: Company;
  selectedStartDate!: Date;
  selectedEndDate!: Date;
  selectedStock: boolean = false;
  selectedReturned: boolean = false;
  loading:boolean = false

  constructor(
    private parcelsService: ParcelsService,
    private companiesService: CompaniesService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: 'barcode', header: 'Barcode' },
      { field: 'company', header: 'Company' },
      { field: 'created', header: 'Created' },
      { field: 'released', header: 'Released' },
      { field: 'returned', header: 'Returned' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));

    this.companiesService.allCompanies$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.allCompanies = response;
      });

    this.parcelsService.allParcels$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response) => {
          this.allParcels = response;
          this.totalRecords = this.allParcels.length;
        },
      });
  }

  onGenerate() {
    if (!this.selectedStock) {
      if (!this.selectedStartDate || !this.selectedEndDate) {
        this.toastService.showError('Please select dates');
        return;
      }
    } else {
      if (!this.selectedStartDate) {
        this.toastService.showError('Please select Start Date ');
        return;
      }

      if(this.selectedReturned) {
        this.toastService.showError('Parcel cant be on stock and returned');
        return;
      }
    }

    this.loading = true

    this.filteredArray = this.allParcels.filter((parcel) => {
      let updatedAt = new Date(parcel.updatedAt);
      let createdAt = new Date(parcel.createdAt);
      updatedAt.setHours(0, 0, 0, 0);
      createdAt.setHours(0, 0, 0, 0);

      if (this.selectedStock) {
        return (
          parcel.company === this.selectedCompany.name &&
          createdAt <= this.selectedStartDate &&
          !parcel.returned &&
          parcel.isOnStock
        );
      } else {
        return (
          parcel.company === this.selectedCompany.name &&
          updatedAt <= this.selectedEndDate &&
          updatedAt >= this.selectedStartDate &&
          parcel.returned === this.selectedReturned &&
          !parcel.isOnStock
        );
      }
    });
    this.loading = false
  }

  exportPdf() {
    const doc = new jsPDF('portrait', 'px', 'a4');
    const array = this.filteredArray.map((parcel) => {
      return {
        barcode: parcel.barcode,
        company: parcel.company,
        created: parcel.created!,
        released: parcel.released,
        returned: parcel.returned,
      };
    });
    autoTable(doc, {
      body: array,
      columns: this.exportColumns,
      didDrawPage: function (data) {
        doc.text(`Amount: ${array.length.toString()}`, 50, 20);
      },
    });
    doc.save('parcels.pdf');
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const array = this.filteredArray.map((parcel) => {
        return {
          barcode: parcel.barcode,
          company: parcel.company,
          created: parcel.created!,
          released: parcel.released,
          returned: parcel.returned,
        };
      });
      const worksheet = xlsx.utils.json_to_sheet(array);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'parcels');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  clear(table: Table) {
    table.clear();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
