import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-catalog',
  imports: [],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent {
  private route = inject(ActivatedRoute);
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const categoryId = params['category'];
      const searchTerm = params['search'];
    });
  }
}
