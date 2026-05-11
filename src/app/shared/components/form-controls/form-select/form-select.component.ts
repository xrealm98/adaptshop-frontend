import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-select',
  imports: [ReactiveFormsModule],
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.scss',
})
export class FormSelectComponent {
  @Input() id!: string;
  @Input() label!: string;
  @Input() control!: AbstractControl;
  @Input() errorMessages: { [key: string]: string } = {};

  get errors(): string[] {
    if (!this.control?.errors || !(this.control.touched || this.control.dirty)) return [];
    return Object.keys(this.control.errors)
      .filter((key) => this.errorMessages[key])
      .map((key) => this.errorMessages[key]);
  }
}
