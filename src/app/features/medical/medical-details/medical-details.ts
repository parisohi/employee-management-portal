import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MedicalService } from '../../../core/services/medical.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-medical-details',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, TranslatePipe, MatProgressSpinnerModule],
  templateUrl: './medical-details.html',
  styleUrl: './medical-details.css',
})
export class MedicalDetails implements OnInit {
  private medicalService = inject(MedicalService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);

  medicalDetails: any[] = [];
  loading = false;
  totalDependents: number = 0;

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

  editMedical(id: number | string): void {
    this.router.navigate(['/edit-medical', id]);
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
