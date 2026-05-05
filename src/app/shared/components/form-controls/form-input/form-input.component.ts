import { Component, Input, signal } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  imports: [ReactiveFormsModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
})
export class FormInputComponent {
  @Input() label!: string;
  @Input() control!: AbstractControl;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() id!: string;
  @Input() readonly: boolean = false;
  @Input() errorMessages: { [key: string]: string } = {};

  showPassword = signal(false);

  get inputType(): string {
    if (this.type === 'password') {
      return this.showPassword() ? 'text' : 'password';
    }
    return this.type;
  }

  get errors(): string[] {
    if (!this.control?.errors || !(this.control.touched || this.control.dirty)) {
      return [];
    }
    return Object.keys(this.control.errors)
      .filter((key) => this.errorMessages[key])
      .map((key) => this.errorMessages[key]);
  }
}
