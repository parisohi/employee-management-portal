import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MedicalService } from '../../../core/services/medical.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-medical-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './medical-form.html',
  styleUrl: './medical-form.css',
})
export class MedicalForm implements OnInit {

  private fb = inject(FormBuilder);
  private medicalService = inject(MedicalService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);

  medicalId: string | null = null;

  medicalForm: FormGroup = this.fb.group({
    employeeId: ['', Validators.required],
    policyName: ['', Validators.required],
    claimedAmount: ['', Validators.required],
    numberOfDependents: ['', Validators.required]

  });

  ngOnInit(): void {
    this.medicalId = this.route.snapshot.paramMap.get('id');
    if (this.medicalId) {
      this.medicalService.getMedicalDetailById(this.medicalId).subscribe((data: any) => {

        this.medicalForm.patchValue({
          employeeId: data.employeeId,
          policyName: data.policyName,
          claimedAmount: data.claimedAmount,
          numberOfDependents: data.numberOfDependents
        });
      });
    }
  }

  saveMedicalDetails() {

    if (this.medicalForm.invalid) {
      this.medicalForm.markAllAsTouched();
      return;
    }
    if (this.medicalId) {
      this.medicalService.updateMedicalDetail(this.medicalId, this.medicalForm.value).subscribe({

        next: () => {

          this.translate.get('MESSAGES.MEDICAL_UPDATED').subscribe((message: string) => {
            alert(message);
          });
          this.router.navigate(['/medical']);
        },
        error: (err) => {
          console.error(err);
          this.translate.get('MESSAGES.ERROR').subscribe((message: string) => {
            alert(message);
          });
        }
      });

    } else {
      this.medicalService.addMedicalDetail(this.medicalForm.value).subscribe({

        next: () => {

          this.translate.get('MESSAGES.MEDICAL_ADDED').subscribe((message: string) => {
            alert(message);
          });
          this.router.navigate(['/medical']);
        },
        error: (err) => {
          console.error(err);
          this.translate.get('MESSAGES.ERROR').subscribe((message: string) => {
            alert(message);
          });
        }
      });
    }
  }
}
