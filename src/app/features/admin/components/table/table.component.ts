import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, signal, TemplateRef } from '@angular/core';

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-table',
  imports: [NgTemplateOutlet],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() emptyMessage: string = 'No hay datos disponibles.';
  @ContentChild('rowTemplate') rowTemplate!: TemplateRef<any>;
  @ContentChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  sortedData = signal<any[]>([]);
  sortColumn = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  ngOnChanges() {
    this.sortedData.set([...this.data]);
  }

  sort(column: TableColumn) {
    if (!column.sortable) return;

    this.updateSort(column.key);
    this.sortedData.update((items) =>
      [...items].sort((a, b) => this.compareRows(a, b, column.key)),
    );
  }

  // Comparar valores
  private compareRows(a: any, b: any, key: string): number {
    const valA = this.prepareValue(this.getValue(a, key));
    const valB = this.prepareValue(this.getValue(b, key));
    const dir = this.sortDirection() === 'asc' ? 1 : -1;

    // Comparación numérica
    if (this.isNumeric(valA) && this.isNumeric(valB)) {
      return (Number(valA) - Number(valB)) * dir;
    }

    return valA.toString().localeCompare(valB.toString()) * dir;
  }

  // Obtener valores que estan anidados
  private getValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  // Normaliza nulos y pasa a minúsculas
  private prepareValue(value: any): string | number {
    if (value === null || value === undefined) return '';
    return typeof value === 'string' ? value.toLowerCase() : value;
  }

  // Verificar si es numérico
  private isNumeric(value: any): boolean {
    return typeof value !== 'boolean' && !isNaN(parseFloat(value)) && isFinite(value);
  }

  // Actualiza la tabla que se ordena
  updateSort(key: string) {
    if (this.sortColumn() === key) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(key);
      this.sortDirection.set('asc');
    }
  }

  // Establece el icono de las tablas
  getSortIcon(key: string): string {
    if (this.sortColumn() !== key) return '↕';
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }
}
