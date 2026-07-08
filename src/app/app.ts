import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('employee-management-portal');
  private translate = inject(TranslateService);

  ngOnInit(): void {
    const savedSetings = localStorage.getItem('settings');

    if (savedSetings) {
      const settings = JSON.parse(savedSetings);

      switch (settings.language) {
        case 'English': this.translate.use('en');
          break;

        case 'Hindi':
          this.translate.use('hi');
          break;

        case 'Punjabi':
          this.translate.use('pa');
          break;

        default:
          this.translate.use('en');
      }
    } else {
      this.translate.use('en');
    }
  }
}
