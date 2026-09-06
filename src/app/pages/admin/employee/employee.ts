import {
  Component
} from '@angular/core';

import {
  EmployeeAdd,
  EmployeeModel
} from './employee-add/employee-add';

import {
  EmployeeList,
  EmployeeUser
} from './employee-list/employee-list';

@Component({
  selector: 'app-employee',
  standalone: true,

  imports: [
    EmployeeAdd,
    EmployeeList
  ],

  templateUrl: './employee.html',
  styleUrl: './employee.scss'
})
export class Employee {

  selectedEmployee:
    EmployeeModel | null = null;


  onEditEmployee(
    user: EmployeeUser
  ): void {

    this.selectedEmployee = {

      id:
        user.id,

      userName:
        user.userName,

      email:
        user.email ?? '',

      phoneNumber:
        user.phoneNumber ?? '',

      nickName:
        user.nickName ?? '',

      position:
        user.roles?.[0] ?? ''

    };


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  onEmployeeSaved(): void {

    this.selectedEmployee = null;

  }


  onEmployeeCancelled(): void {

    this.selectedEmployee = null;

  }

}