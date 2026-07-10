import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MedicalService } from '../../../core/services/medical.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-medical-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './medical-form.html',
  styleUrl: './medical-form.css',
})
export class MedicalForm implements OnInit {

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MedicalForm>)
  data = inject(MAT_DIALOG_DATA);
  private medicalService = inject(MedicalService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  isEditMode: boolean = false;
  medicalId: string | null = null;

  medicalForm: FormGroup = this.fb.group({
    employeeId: ['', Validators.required],
    policyName: ['', Validators.required],
    salary: [''],
    policyMaxAmount: [{ value: '', disabled: true }],
    claimedAmount: ['', Validators.required],
    balance: [{ value: '', disabled: true }],
    numberOfDependents: ['', Validators.required]
  });

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    this.data, this.medicalId = this.data?.id;
    if (this.medicalId) {

      this.medicalService.getMedicalDetailById(this.medicalId).subscribe((data: any) => {

        this.medicalForm.patchValue({
          employeeId: data.employeeId,
          policyName: data.policyName,
          salary: data.salary,
          claimedAmount: data.claimedAmount,
          numberOfDependents: data.numberOfDependents
        });
        this.updatePolicyAndBalance();
      });

    }
    this.medicalForm.get('claimedAmount')?.valueChanges.subscribe(() => {
      this.updatePolicyAndBalance();
    });
  }

  updatePolicyAndBalance() {

    const salary = Number(this.medicalForm.get('salary')?.value);
    const claimed = Number(this.medicalForm.get('claimedAmount')?.value);
    const policyMax =
      salary <= 500000 ? 1000000 : salary * 2.5;
    const balance = policyMax - claimed;

    this.medicalForm.patchValue(
      {
        policyMaxAmount: policyMax,
        balance: balance
      },
      { emitEvent: false }
    );

  }

  saveMedicalDetails() {
    if (this.medicalForm.invalid) {
      this.medicalForm.markAllAsTouched();
      return;
    }

    const medicalData = this.medicalForm.getRawValue();

    if (this.medicalId) {

      this.medicalService.updateMedicalDetail(this.medicalId, medicalData).subscribe({
        next: () => {
          this.translate.get('MESSAGES.MEDICAL_UPDATED').subscribe((message: string) => {
            alert(message);
          });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
        }
      });
    }

    else {

      this.medicalService.addMedicalDetail(medicalData).subscribe({
        next: () => {
          this.translate.get('MESSAGES.MEDICAL_ADDED').subscribe((message: string) => {
            alert(message);
          });
          this.dialogRef.close(true);
        },

        error: (err) => {
          console.error(err);
          this.translate.get('MESSAGES.ERROR').subscribe((message: string) => {
            alert(message);
          });
        }
      });
    }
  };
}
