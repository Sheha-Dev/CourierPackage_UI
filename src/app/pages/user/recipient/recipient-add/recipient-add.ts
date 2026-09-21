import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RecipientRequest, RecipientResponse } from '../../../../models/recipient';
import { RecipientService } from '../../../../services/recipient.service';
import { TokenService } from '../../../../services/token.service';




@Component({
  selector: 'app-recipient-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './recipient-add.html',
  styleUrl: './recipient-add.scss'
})
export class RecipientAdd
  implements OnChanges {

  @Input()
  recipient: RecipientResponse | null = null;

  @Input()
  isEditMode = false;


  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  saved = new EventEmitter<void>();


  recipientForm!: FormGroup;
  
  loading = false;

  errorMessage = '';

  successMessage = '';

    constructor(
    private fb: FormBuilder,
    private recipientService: RecipientService,
    private tokenService : TokenService
  ) {

    this.recipientForm = this.fb.group({

    recipientId: [0],

    senderId: [
      this.tokenService.getUserId() ?? 'User',
      Validators.required
    ],

    userName: [
      '',
      [
        Validators.required,
        Validators.maxLength(50)
      ]
    ],

    nickName: [
      '',
      Validators.maxLength(50)
    ],

    contactNumber: [
      '',
      [
        Validators.required,
        Validators.maxLength(20)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]
    ]

  });
  }

  





  // =========================================
  // HANDLE EDIT DATA
  // =========================================

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['recipient'] ||
      changes['isEditMode']
    ) {

      this.populateForm();
    }
  }


  // =========================================
  // POPULATE FORM
  // =========================================

  private populateForm(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (
      this.isEditMode &&
      this.recipient
    ) {

      this.recipientForm.patchValue({

        recipientId:
          this.recipient.recipientId,

        senderId:
         this.tokenService.getRoles() ??  this.recipient.senderId ,

        userName:
          this.recipient.userName,

        nickName:
          this.recipient.nickName,

        contactNumber:
          this.recipient.contactNumber,

        email:
          this.recipient.email

      });

    } else {

      this.recipientForm.reset({

        recipientId: 0,

        senderId: '',

        userName: '',

        nickName: '',

        contactNumber: '',

        email: ''

      });
    }
  }


  // =========================================
  // SUBMIT
  // =========================================

  onSubmit(): void {

    var user = this.tokenService.getUserId();

    this.recipientForm.get('senderId')?.setValue(user);

    if (this.recipientForm.invalid) {

      this.recipientForm.markAllAsTouched();

      console.log('Invalid Form');

      console.log('Form:',this.recipientForm);
      return;
    }

    this.errorMessage = '';

    this.loading = true;


    const formValue =
      this.recipientForm.getRawValue();


    const request: RecipientRequest = {

      recipientId:
        Number(formValue.recipientId) || 0,

      senderId:
        user ?? '',

      userName:
        formValue.userName ?? '',

      nickName:
        formValue.nickName ?? '',

      contactNumber:
        formValue.contactNumber ?? '',

      email:
        formValue.email ?? '',

      trnUser:
        'current-user'

    };


    if (this.isEditMode) {

      this.updateRecipient(request);

    } else {

      this.createRecipient(request);

    }
  }


  // =========================================
  // CREATE
  // =========================================

  private createRecipient(
    request: RecipientRequest
  ): void {

    this.recipientService
      .createRecipient(request)
      .subscribe({

        next: response => {

          this.loading = false;

          this.successMessage =
            response.message ||
            'Recipient created successfully.';

          this.saved.emit();
        },

        error: error => {

          this.loading = false;

          this.errorMessage =
            error?.error?.message ??
            'Unable to create recipient.';
        }

      });
  }


  // =========================================
  // UPDATE
  // =========================================

  private updateRecipient(
    request: RecipientRequest
  ): void {

    this.recipientService
      .updateRecipient(request)
      .subscribe({

        next: response => {

          this.loading = false;

          this.successMessage =
            response.message ||
            'Recipient updated successfully.';

          this.saved.emit();
        },

        error: error => {

          this.loading = false;

          this.errorMessage =
            error?.error?.message ??
            'Unable to update recipient.';
        }

      });
  }


  // =========================================
  // CANCEL
  // =========================================

  onCancel(): void {

    this.cancel.emit();
  }


  // =========================================
  // FIELD ERROR
  // =========================================

  isInvalid(
    controlName: string
  ): boolean {

    const control =
      this.recipientForm.get(controlName);

    return !!(
      control &&
      control.invalid &&
      control.touched
    );
  }
}