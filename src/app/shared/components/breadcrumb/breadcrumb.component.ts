import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Breadcrumb } from '../../../models/breadcrumb.model';

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  items = input.required<Breadcrumb[]>();
}
