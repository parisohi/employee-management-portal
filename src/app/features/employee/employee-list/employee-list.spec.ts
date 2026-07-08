import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeList } from './employee-list';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

describe('EmployeeList', () => {
    let component: EmployeeList;
    let fixture: ComponentFixture<EmployeeList>;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [EmployeeList],
            providers: [
                provideHttpClient(),
                provideRouter([]),
                provideTranslateService()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EmployeeList);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have current page as 1', () => {
        expect(component.currentPage).toBe(1);
    });

    it('should have items per page as 2', () => {
        expect(component.itemsPerPage).toBe(2);
    });

});