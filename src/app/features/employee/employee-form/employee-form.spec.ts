import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeForm } from './employee-form';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

describe('EmployeeForm', () => {

    let component: EmployeeForm;
    let fixture: ComponentFixture<EmployeeForm>;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [EmployeeForm],
            providers: [
                provideHttpClient(),
                provideRouter([]),
                provideTranslateService()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EmployeeForm);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create the employee form', () => {
        expect(component.employeeForm).toBeTruthy();
    });

});