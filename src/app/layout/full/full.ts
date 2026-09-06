import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  roles: string[];
}

@Component({
  selector: 'app-full',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './full.html',
  styleUrl: './full.scss'
})
export class Full implements OnInit {

  isDarkMode = false;
  isSidebarOpen = false;

  userRoles: string[] = [];

  menuItems: MenuItem[] = [

    {
      label: 'Home',
      route: '/home',
      icon: '🏠',
      roles: ['User', 'Admin']
    },

    {
      label: 'Package',
      route: '/home/user-package',
      icon: '📦',
      roles: ['User']
    },

    {
      label: 'Recipient',
      route: '/home/user-recipient',
      icon: '👤',
      roles: ['User']
    },

    {
      label: 'Employee',
      route: '/home/employee',
      icon: '👨‍💼',
      roles: ['Admin']
    },

    {
      label: 'Package',
      route: '/home/admin-package',
      icon: '📦',
      roles: ['Admin']
    },

    {
      label: 'Role',
      route: '/home/role',
      icon: '🛡️',
      roles: ['Admin']
    },

    {
      label: 'Warehouse',
      route: '/home/warehouse',
      icon: '🏢',
      roles: ['Admin']
    }

  ];

  constructor(
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {

    this.userRoles =
      this.tokenService.getRoles();

    const savedTheme =
      localStorage.getItem('theme');

    if (savedTheme) {

      this.isDarkMode =
        savedTheme === 'dark';

    } else {

      this.isDarkMode =
        window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;

    }

    this.applyTheme();
  }

  get visibleMenuItems(): MenuItem[] {

    return this.menuItems.filter(item =>
      item.roles.some(role =>
        this.userRoles.includes(role)
      )
    );

  }

  get userRole(): string {

    if (this.userRoles.length === 0) {
      return '';
    }

    return this.userRoles.join(', ');
  }

  toggleSidebar(): void {

    this.isSidebarOpen =
      !this.isSidebarOpen;

  }

  closeSidebar(): void {

    this.isSidebarOpen = false;

  }

  toggleTheme(): void {

    this.isDarkMode =
      !this.isDarkMode;

    localStorage.setItem(
      'theme',
      this.isDarkMode
        ? 'dark'
        : 'light'
    );

    this.applyTheme();
  }

  logout(): void {

    this.closeSidebar();

    this.userService.removeAccessToken();

    this.router.navigate(['/login']);
  }

  private applyTheme(): void {

    document.documentElement.setAttribute(
      'data-theme',
      this.isDarkMode
        ? 'dark'
        : 'light'
    );

  }
}