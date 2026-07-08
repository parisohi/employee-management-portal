import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../core/services/employee.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, Chart, ArcElement, PieController, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { TranslatePipe } from '@ngx-translate/core';

Chart.register(
  PieController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, TranslatePipe],
  templateUrl: './charts.html',
  styleUrl: './charts.css',
})
export class Charts implements OnInit {

  private employeeService = inject(EmployeeService);
  private cdr = inject(ChangeDetectorRef);
  employees: any[] = [];

  totalEmployees = 0;
  totalSalary = 0;
  averageSalary = 0;
  highestSalary = 0;


  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  };


  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Salary',
        data: []
      }
    ]
  };

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 18,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        enabled: true
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };


  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data: any[]) => {
        this.employees = [...data];
        this.totalEmployees = this.employees.length;
        this.totalSalary = this.employees.reduce(
          (sum, emp) => sum + Number(emp.salary),
          0
        );
        this.averageSalary =
          this.totalEmployees > 0 ? this.totalSalary / this.totalEmployees : 0;

        this.highestSalary = Math.max(...this.employees.map(emp => Number(emp.salary || 0))
        );

        const professionCount: { [key: string]: number } = {};

        this.employees.forEach(emp => {
          professionCount[emp.profession] = (professionCount[emp.profession] || 0) + 1;
        });

        this.pieChartData = {
          labels: Object.keys(professionCount),
          datasets: [
            {
              data: Object.values(professionCount),
              backgroundColor: [
                '#3b82f6',
                '#10b981',
                '#f59e0b',
                '#ef4444',
                '#8b5cf6',
                '#06b6d4'
              ],
              hoverOffset: 20,
              borderColor: '#fff',
              borderWidth: 3,
            }
          ]
        };

        const salaryByProfession: { [key: string]: number } = {};
        this.employees.forEach(emp => {
          salaryByProfession[emp.profession] = (salaryByProfession[emp.profession] || 0) + Number(emp.salary || 0);
        });

        this.barChartData = {
          labels: Object.keys(salaryByProfession),
          datasets: [
            {
              label: 'Salary',
              data: Object.values(salaryByProfession),
              backgroundColor: [
                '#3b82f6',
                '#10b981',
                '#f59e0b',
                '#ef4444',
                '#8b5cf6',
                '#06b6d4'
              ],
              borderRadius: 12,
              borderSkipped: false,
              maxBarThickness: 100
            }
          ]
        };

        this.cdr.detectChanges();

        console.log(this.pieChartData);
        console.log(this.barChartData);

        console.log('Employees', this.employees);
        console.log('Total Employees', this.totalEmployees);
        console.log('Total Salary', this.totalSalary);
        console.log('Average Salary', this.averageSalary);
        console.log('Highest Salary', this.highestSalary);
      },

      error: (err) => {
        console.error(err);
      }
    });
  }

}
