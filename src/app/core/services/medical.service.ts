import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MedicalService {

    private http = inject(HttpClient);
    private apiURL = 'https://employee-management-portal-myas.onrender.com/medicalDetails';

    getMedicalDetails(): Observable<any[]> {
        return this.http.get<any[]>(this.apiURL);
    }


    getMedicalDetailById(id: number | string) {
        return this.http.get<any>(`${this.apiURL}/${id}`);
    }

    addMedicalDetail(data: any): Observable<any> {
        return this.http.post<any>(this.apiURL, data)
    }

    deleteMedicalDetail(id: string | number): Observable<any> {
        return this.http.delete<any>(`${this.apiURL}/${id}`);
    }

    updateMedicalDetail(id: number | string, data: any): Observable<any> {
        return this.http.put<any>(`${this.apiURL}/${id}`, data);
    }
}