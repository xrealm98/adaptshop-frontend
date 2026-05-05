import { Component, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-textarea',
  imports: [ReactiveFormsModule],
  templateUrl: './form-textarea.component.html',
  styleUrl: './form-textarea.component.scss',
})
export class FormTextareaComponent {
  @Input() id!: string;
  @Input() label!: string;
  @Input() control!: AbstractControl;
  @Input() placeholder: string = '';
  @Input() rows: number = 3;
  @Input() errorMessages: { [key: string]: string } = {};
  get errors(): string[] {
    if (!this.control?.errors || !(this.control.touched || this.control.dirty)) return [];
    return Object.keys(this.control.errors)
      .filter((key) => this.errorMessages[key])
      .map((key) => this.errorMessages[key]);
  }
}
