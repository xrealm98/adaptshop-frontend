import { Component, computed, input, output } from '@angular/core';
import { calculateVisiblePages } from '../../../core/utils/pagination.util';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();

  pageChange = output<number>();
  visiblePages = computed(() => {
    return calculateVisiblePages(this.currentPage(), this.totalPages());
  });

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }
}
