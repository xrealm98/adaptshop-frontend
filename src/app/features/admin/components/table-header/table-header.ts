import { Component, EventEmitter, Output, input } from '@angular/core';

@Component({
  selector: 'app-table-header',
  imports: [],
  templateUrl: './table-header.html',
  styleUrl: './table-header.scss',
})
export class TableHeader {
  placeholder = input<string>('Buscar...');
  buttonLabel = input<string | null>(null);

  @Output() onSearch = new EventEmitter<string>();
  @Output() onAdd = new EventEmitter<void>();

  handleSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onSearch.emit(value);
  }

  handleAdd() {
    this.onAdd.emit();
  }
}
