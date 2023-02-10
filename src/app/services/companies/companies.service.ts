import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Company } from 'src/app/models/Company.model';
import { environment } from 'src/environments/environment';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  allCompanies$ = new BehaviorSubject<Company[]>([]);
  allCompanies: Company[] = []

  constructor(private http: HttpClient, private socketService:SocketService) {}



fetchCompanies() {
  return this.http.get<{allCompanies: Company[]}>(`${environment.domain}/companies`).pipe(tap({
    next: (response) => {
      this.allCompanies = response.allCompanies
      this.allCompanies$.next([...this.allCompanies]);
    },
  }))
}


   createCompany(company: Company) {
    return this.http
      .post<{ createdCompany: Company | null; message: string }>(
        `${environment.domain}/companies`,
        {
          company,
        }
      )
      .pipe(
        tap({
          next: (response) => {
            if (response.createdCompany) {
              this.createCompanyLocal(response.createdCompany);
              this.socketService.emit('createCompany', response.createdCompany)
            }
          },
          complete: () => {},
        })
      );
  }

  updateCompany(company: Company) {
    return this.http
      .patch<{ updatedCompany: Company | null; message: string }>(
        `${environment.domain}/companies`,
        {
          company,
        }
      )
      .pipe(
        tap({
          next: (response) => {
            if (response.updatedCompany) {
              this.updateCompanyLocal(response.updatedCompany);
              this.socketService.emit('updateCompany', response.updatedCompany)
            }
          },
          complete: () => {},
        })
      );
  }

  deleteCompany(company: Company) {
    return this.http
      .post<{ deletedCompany: Company | null; message: string }>(
        `${environment.domain}/companies/delete`,
        {
          company,
        }
      )
      .pipe(
        tap({
          next: (response) => {
            if (response.deletedCompany) {
              this.deleteCompanyLocal(response.deletedCompany);
              this.socketService.emit('deleteCompany', response.deletedCompany)
            }
          },
          complete: () => {},
        })
      );
  }


  

  updateCompanyLocal(company: Company) {

    const allIndex = this.allCompanies.findIndex((allCompany) => {
      return allCompany._id === company._id;
    });
    if (allIndex === -1) {
      //do nothing
    } else {
      this.allCompanies.splice(allIndex, 1, company);
      this.allCompanies$.next([...this.allCompanies]);
    }

  }

  deleteCompanyLocal(company: Company) {
    const allIndex = this.allCompanies.findIndex((allCompany) => {
      return allCompany._id === company._id;
    });
    if (allIndex === -1) {
      //do nothing
    } else {
      this.allCompanies.splice(allIndex, 1);
      this.allCompanies$.next([...this.allCompanies]);
    }
  }



  createCompanyLocal(company: Company) {
    this.allCompanies.push(company);
    this.allCompanies$.next([...this.allCompanies]);
  }




}
