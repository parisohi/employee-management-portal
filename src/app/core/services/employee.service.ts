import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    private http = inject(HttpClient);

    private apiURL = 'https://employee-management-portal-myas.onrender.com/employees';


    private professionApiURL = 'https://employee-management-portal-myas.onrender.com/professions';
    private dummyApiURL = 'https://hub.dummyapis.com/employee?noofRecords=50&idStarts=1001';

    private employeeSubject = new BehaviorSubject<any[]>([]);
    employee$ = this.employeeSubject.asObservable();

    getEmployees(): Observable<any[]> {
        return this.http.get<any[]>(this.apiURL);
    }

    loadEmployees(): void {
        this.http.get<any[]>(this.apiURL).subscribe(data => {
            this.employeeSubject.next(data);
        });
    }

    getDummyEmployees(): Observable<any[]> {
        return this.http.get<any[]>(this.dummyApiURL);
    }

    getProfessions(): Observable<any[]> {
        return this.http.get<any[]>(this.professionApiURL);
    }

    private generateEmployeeId(): Observable<string> {
        return new Observable(observer => {
            this.getEmployees().subscribe(employees => {
                if (employees.length === 0) {
                    observer.next('1001');
                    observer.complete();
                    return;
                }

                const ids = employees
                    .map(emp => Number(emp.id))
                    .filter(id => !isNaN(id));

                const maxId = Math.max(...ids);
                observer.next(String(maxId + 1));
                observer.complete();
            });
        });

    }


    addEmployee(employee: any): Observable<any> {
        return new Observable(observer => {
            this.generateEmployeeId().subscribe(newId => {
                employee.id = newId;

                this.http.post<any>(this.apiURL, employee).subscribe({
                    next: (data) => {
                        this.loadEmployees();
                        observer.next(data);
                        observer.complete();
                    },
                    error: err => observer.error(err)
                });
            });
        });
    }


    deleteEmployee(id: string | number) {
        return new Observable<any>(observer => {
            this.http.delete(`${this.apiURL}/${id}`).subscribe({
                next: (data) => {
                    this.loadEmployees();

                    observer.next(data);
                    observer.complete();
                },
                error: err => observer.error(err)
            });
        });
    }

    getEmployeeById(id: string | number) {
        return this.http.get(`${this.apiURL}/${id}`);
    }

    updateEmployee(id: string | number, employee: any): Observable<any> {
        return new Observable<any>(observer => {
            this.http.put(`${this.apiURL}/${id}`, employee).subscribe({
                next: (data) => {
                    this.loadEmployees();

                    observer.next(data);
                    observer.complete();
                },
                error: err => observer.error(err)
            });
        });
    }
}
