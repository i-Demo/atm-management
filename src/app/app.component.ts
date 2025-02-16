import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, DashboardComponent, PaginationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'atm-management';
}
