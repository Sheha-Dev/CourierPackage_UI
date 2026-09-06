import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TokenService } from '../../services/token.service';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  userId = '';
  userRoles: string[] = [];

  quickActions: QuickAction[] = [
    {
      title: 'My Packages',
      description: 'View and manage your courier packages.',
      icon: '📦',
      route: '/home/user-package',
      roles: ['User']
    },

    {
      title: 'Recipients',
      description: 'Manage package recipient information.',
      icon: '👤',
      route: '/home/user-recipient',
      roles: ['User']
    },

    {
      title: 'Employees',
      description: 'Manage courier system employees.',
      icon: '👨‍💼',
      route: '/home/employee',
      roles: ['Admin']
    },

    {
      title: 'Packages',
      description: 'View and manage all courier packages.',
      icon: '📦',
      route: '/home/admin-package',
      roles: ['Admin']
    },

    {
      title: 'Roles',
      description: 'Manage system roles and permissions.',
      icon: '🛡️',
      route: '/home/role',
      roles: ['Admin']
    },

    {
      title: 'Warehouses',
      description: 'Manage warehouse information.',
      icon: '🏢',
      route: '/home/warehouse',
      roles: ['Admin']
    }
  ];

  constructor(
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.userRoles =
      this.tokenService.getRoles();

    this.userId =
      this.tokenService.getUserId() ?? '';
  }

  get visibleQuickActions(): QuickAction[] {
    return this.quickActions.filter(action =>
      action.roles.some(role =>
        this.userRoles.includes(role)
      )
    );
  }

  get isAdmin(): boolean {
    return this.userRoles.includes('Admin');
  }

  get displayRole(): string {
    if (this.userRoles.length === 0) {
      return 'User';
    }

    return this.userRoles.join(', ');
  }
}