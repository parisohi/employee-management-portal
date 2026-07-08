import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { skip } from 'rxjs';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, MatProgressSpinnerModule, RouterLink],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})

export class EmployeeList implements OnInit {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);

  employees: any[] = [];
  allEmployees: any[] = [];
  searchText: string = '';
  loading: boolean = false;

  selectedProfession: string = 'All';
  professions: string[] = [
    'All',
    'HR',
    'Developer',
    'Manager',
    'Tester',
    'Designer'
  ];

  selectedAge: string = 'All'
  ageGroups: string[] = [
    'All',
    '18-25',
    '26-35',
    '36-50',
    '50+'
  ];
  sortOption: string = 'None';
  sortOptions: string[] = [
    'None',
    'Name (A-Z)',
    'Name (Z-A)',
    'Salary (Low-High)',
    'Salary (High-Low)',
    'Age (Young-Old)',
    'Age (Old-Young)',
    ' contact(Low-High)',
    'contact(High-Low)'
  ];


  currentPage: number = 1;
  itemsPerPage: number = 2;

  ngOnInit(): void {
    this.loading = true;

    this.employeeService.employee$.pipe(skip(1)).subscribe(data => {

      this.employees = data;
      this.allEmployees = [...data];

      this.loading = false;
      this.cdr.detectChanges();
    });
    this.employeeService.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.loadEmployees();
  }

  searchEmployees(): void {
    this.applyFilters();
  }

  filterByProfession(): void {
    this.applyFilters();
  }

  filterByAge(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchText.toLowerCase();
    this.employees = this.allEmployees.filter(emp => {
      const matchesSearch = emp.firstName.toLowerCase().includes(search) ||
        emp.lastName.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search);

      const matchesProfession =
        this.selectedProfession === 'All' ||
        emp.profession === this.selectedProfession;

      let matchesAge = true;
      switch (this.selectedAge) {
        case '18-25':
          matchesAge = emp.age >= 18 && emp.age <= 25;
          break;
        case '26-35':
          matchesAge = emp.age >= 26 && emp.age <= 35;
          break;
        case '36-50':
          matchesAge = emp.age >= 36 && emp.age <= 50;
          break;
        case '50+':
          matchesAge = emp.age > 50;
          break;
      }
      return matchesSearch && matchesProfession && matchesAge;
    });

    this.sortEmployees();
  }
  sortEmployees(): void {
    switch (this.sortOption) {
      case 'Name (A-Z)':
        this.employees.sort((a, b) => a.firstName.localeCompare(b.firstName)
        );
        break;

      case 'Name (Z-A)':
        this.employees.sort((a, b) => b.firstName.localeCompare(a.firstName)
        );
        break;

      case 'Salary (Low-High)':
        this.employees.sort((a, b) => a.salary - b.salary);
        break;

      case 'Salary (High-Low)':
        this.employees.sort((a, b) => b.salary - a.salary);
        break;

      case 'Age (Young-Old)':
        this.employees.sort((a, b) => a.age - b.age);
        break;

      case 'Age (Old-Young)':
        this.employees.sort((a, b) => b.age - a.age);
        break;

      case 'Contact (Low-High)':
        this.employees.sort((a, b) => Number(a.contactNumber) - Number(a.contactNumber));
        break;

      case 'Contact (High-Low)':
        this.employees.sort((a, b) => Number(b.contactNumber) - Number(a.contactNumber));
        break;

      default:
        break;
    }

    this.currentPage = 1;
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.employees.slice(start, start + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.employees.length) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  editEmployee(id: string | number): void {
    this.router.navigate(['/edit-employee', id]);
  }

  deleteEmployee(id: string | number): void {
    this.translate.get('MESSAGES.DELETE_CONFIRM').subscribe((message: string) => {
      const confirmDelete = confirm(message);

      if (!confirmDelete) {
        return;
      }

      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.translate.get('MESSAGES.EMPLOYEE_DELETED').subscribe((message: string) => {
            alert(message);
          });

        },
        error: (err) => {
          console.error(err);

          this.translate.get('MESSAGES.ERROR').subscribe((message: string) => {
            alert(message);
          });
        }
      });
    });
  }

}