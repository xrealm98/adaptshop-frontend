import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { UserService } from '../../../core/services/users/user.service';
import { User } from '../../../models/user.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { TableHeader } from '../components/table-header/table-header';
import { TableComponent } from '../components/table/table.component';

@Component({
  selector: 'app-users.component',
  imports: [RouterLink, TableHeader, TableComponent, PaginationComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);

  columns = [
    { key: 'first_name', header: 'Nombre', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Rol', sortable: true },
    { key: 'is_blocked', header: 'Estado', sortable: true },
    { key: 'actions', header: 'Acciones', sortable: false },
  ];
  users = signal<User[]>([]);
  searchTerm = signal('');

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    const params: any = { page: this.currentPage(), per_page: 10 };
    if (this.searchTerm()) params.search = this.searchTerm();
    this.userService.getUsers(params).subscribe({
      next: (users) => {
        this.users.set(users.data);
        this.totalPages.set(users.last_page);
      },
      error: (err) => console.error(err),
    });
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
    this.currentPage.set(1);
    this.loadUsers();
  }

  deleteUser(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.currentPage.set(1);
          this.loadUsers();
          this.notificationService.showInfo(`Usuario eliminado correctamente.`);
        },
        error: (err) => {
          this.notificationService.showError(`Error al eliminar el usuario.`);
          console.error(err);
        },
      });
    }
  }
  toggleBlock(user: User) {
    this.userService.updateUser(user.id!, { is_blocked: !user.is_blocked }).subscribe({
      next: (updated) => {
        this.currentPage.set(1);
        this.loadUsers();
        this.notificationService.showInfo(`Estado del usuario modificado correctamente.`);
      },
      error: (err) => console.error(err),
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadUsers();
  }
}
