import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSlideToggleModule, TranslatePipe],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);

  settingsForm: FormGroup = this.fb.group({
    adminName: ['HR Admin'],
    email: ['admin@gmail.com'],
    notifications: [true],
    language: ['English'],
    darkMode: [false]
  });

  ngOnInit(): void {


    const saveSettings = localStorage.getItem('settings');

    if (saveSettings) {
      const settings = JSON.parse(saveSettings)
      this.settingsForm.patchValue(settings);

      if (settings.language === 'English') {
        this.translate.use('en');
      } else if (settings.language === 'Hindi') {
        this.translate.use('hi');
      } else if (settings.language === 'Punjabi') {
        this.translate.use('pa');
      }

      if (settings.darkMode) {
        document.body.classList.add('dark-theme');
      }
    } else {
      this.translate.use('en');
    }

  }
  saveSettings() {
    const settings = this.settingsForm.value;

    switch (settings.language) {
      case 'English':
        this.translate.use('en');
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

    localStorage.setItem(
      'settings',
      JSON.stringify(this.settingsForm.value)
    );

    if (settings.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    this.translate.get('MESSAGES.SETTINGS_SAVED').subscribe((message: string) => {
      alert(message);
    });
  }

  resetSettings() {
    this.settingsForm.reset({
      adminName: 'HR Admin',
      email: 'admin@gmail.com',
      notifications: true,
      language: 'English',
      darkMode: false
    });
    this.translate.use('en');

    document.body.classList.remove('dark-theme');
    localStorage.removeItem('settings');
  }
}
