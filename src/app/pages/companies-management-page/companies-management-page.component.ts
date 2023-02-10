import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Company } from 'src/app/models/Company.model';
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { LoadingErrorService } from 'src/app/services/loadingError/loading-error.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-companies-management-page',
  templateUrl: './companies-management-page.component.html',
  styleUrls: ['./companies-management-page.component.css'],
  providers: [ConfirmationService]
})
export class CompaniesManagementPageComponent implements OnInit,OnDestroy {
  allCompanies: Company[] = [];
  selectedCompanies!: Company[];
  companyDialog: boolean = false;
  company!: Company;
  isUpdate: boolean = false;
  prevCompanySnap!: Company;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private companiesService: CompaniesService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private loadingErrorService:LoadingErrorService
  ) {}


  ngOnInit(): void {
    this.companiesService.allCompanies$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        this.allCompanies = response;
      });

  }


  deleteSelectedCompanies() {
    this.toastService.showError('Currently not supported');
  }

  openNew() {
    this.company = { name: '', releaseUrl: ''};
    this.isUpdate = false;
    this.companyDialog = true;
  }

  editCompany(company: Company) {
    this.company = { ...company };
    this.prevCompanySnap = { ...company };
    this.isUpdate = true;
    this.companyDialog = true;
  }

  deleteCompany(company: Company) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${company.name}" ? `,
      header: 'Delete Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingErrorService.isLoading$.next(true)
        this.companiesService.deleteCompany(company).subscribe({
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

  updateCompanySubmit() {
    if (
      this.company.name === '' 
      
    ) {
      this.toastService.showError('Please fill the required information');
      return;
    }

    const isAlreadyExists = this.allCompanies.find((company) => {
      return (
        company.name.toUpperCase().trim() === this.company.name.toUpperCase().trim() &&
        company.name.toUpperCase().trim() !== this.prevCompanySnap.name.toUpperCase().trim()
      );
    });
    if (isAlreadyExists) {
      this.toastService.showError('Company Name Is Taken');
      return;
    }
    this.confirmationService.confirm({
      message: 'Are you sure you want to update ' + this.company.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingErrorService.isLoading$.next(true)

        this.companiesService.updateCompany(this.company).subscribe({
          next: (response) => {
            this.loadingErrorService.isLoading$.next(false)
            this.toastService.showSucess(response.message);
            this.companyDialog = false;
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

  createCompanySubmit() {
    if (
      this.company.name === ''
    ) {
      this.toastService.showError('Please fill the required information');
      return;
    }

    const isAlreadyExists = this.allCompanies.find((company) => {
      return company.name.toUpperCase().trim() === this.company.name.toUpperCase().trim();
    });
    if (isAlreadyExists) {
      this.toastService.showError('Storage Name Is Taken');
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure you want to create ' + this.company.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingErrorService.isLoading$.next(true)
        this.companiesService.createCompany(this.company).subscribe({
          next: (response) => {
            this.loadingErrorService.isLoading$.next(false)
            this.toastService.showSucess(response.message);
            this.companyDialog = false;
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
    this.companyDialog = false;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
