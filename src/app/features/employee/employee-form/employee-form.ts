import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeForm implements OnInit {

  private translate = inject(TranslateService);

  employeeForm: FormGroup;
  employeeId: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.employeeForm = this.fb.group({

      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', Validators.required],
      age: ['', Validators.required],
      profession: ['', Validators.required],
      salary: ['', Validators.required],
      showHobbies: [false],
      hobbies: ['']
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.employeeService.getEmployeeById(this.employeeId).subscribe({
        next: (employee: any) => {
          this.employeeForm.patchValue(employee);
        },
        error: (err) => {
          console.error(err);
        }
      });

    }
  }

  get showHobbies(): boolean {
    return this.employeeForm.get('showHobbies')?.value;
  }
  onSubmit() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    if (this.isEditMode && this.employeeId) {
      this.employeeService.updateEmployee(this.employeeId, this.employeeForm.value).subscribe({
        next: () => {
          this.translate.get('MESSAGES.EMPLOYEE_UPDATED').subscribe((message: string) => {
            alert(message);
          })
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error(err);
          this.translate.get('MESSAGES.ERROR').subscribe((message: string) => {
            alert(message);
          });
        }
      });
    } else {

      this.employeeService.addEmployee(this.employeeForm.value).subscribe({

        next: (response) => {
          console.log(response);
          this.translate.get('MESSAGES.EMPLOYEE_ADDED').subscribe((message: string) => {
            alert(message);
          });
          this.employeeForm.reset();
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

