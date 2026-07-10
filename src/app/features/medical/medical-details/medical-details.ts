import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MedicalService } from '../../../core/services/medical.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from "@angular/router";
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MedicalForm } from '../medical-form/medical-form';


@Component({
  selector: 'app-medical-details',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, FormsModule, MatProgressSpinnerModule],
  templateUrl: './medical-details.html',
  styleUrl: './medical-details.css',
})
export class MedicalDetails implements OnInit {
  private medicalService = inject(MedicalService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);

  medicalDetails: any[] = [];
  loading = false;
  totalDependents: number = 0;
  sortAscending = true;
  sortIcon = '▲';

  ngOnInit(): void {
    this.loadMedicalDetails();
  }

  loadMedicalDetails(): void {
    this.loading = true;

    this.medicalService.getMedicalDetails().subscribe({
      next: (data: any[]) => {
        console.log('API Response:', data);
        this.medicalDetails = [...data];
        this.loading = false;
        this.totalDependents = this.medicalDetails.reduce((total, medical) => total + medical.numberOfDependents, 0
        );

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  toggleEmployeeIdSort() {
    if (this.sortAscending) {
      this.medicalDetails.sort((a, b) => a.employeeId - b.employeeId);
      this.sortIcon = '▼';
    } else {
      this.medicalDetails.sort((a, b) => b.employeeId - a.employeeId);
      this.sortIcon = '▲';
    }
    this.sortAscending = !this.sortAscending;
  }

  editMedical(id: number | string): void {
    this.dialog.open(MedicalForm, {
      width: '550px',
      data: { id: id }
    }).afterClosed().subscribe(() => {
      this.loadMedicalDetails();
    });
  }


  addMedicalDetails(): void {
    const dialogRef = this.dialog.open(MedicalForm, {
      width: '550px',
      maxHeight: '80vh',
      panelClass: 'employee-dialog'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadMedicalDetails();
    });
  }
  deleteMedical(id: number | string): void {
    this.translate.get('MESSAGES.DELETE_CONFIRM').subscribe((message: string) => {
      const confirmDelete = confirm(message);

      if (!confirmDelete) {
        return;
      }
      this.medicalService.deleteMedicalDetail(id).subscribe({
        next: () => {
          this.translate.get('MESSAGES.MEDICAL_DELETED').subscribe((message: string) => {
            alert(message);
          });

          this.loadMedicalDetails();
        },
        error: (err) => {
          console.error(err);
          this.translate.get('MESSAGES.ERROR').subscribe((messsage: string) => {
            alert(message);
          });
        }
      });

    });
  }
}
