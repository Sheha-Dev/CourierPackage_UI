import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipientList } from './recipient-list/recipient-list';
import { RecipientAdd } from './recipient-add/recipient-add';
import { RecipientResponse } from '../../../models/recipient';
import { RecipientService } from '../../../services/recipient.service';
import { TokenService } from '../../../services/token.service';


@Component({
  selector: 'app-recipient',
  standalone: true,
  imports: [
    CommonModule,
    RecipientList,
    RecipientAdd
  ],
  templateUrl: './recipient.html',
  styleUrl: './recipient.scss'
})
export class Recipient implements OnInit {

  recipients: RecipientResponse[] = [];

  selectedRecipient: RecipientResponse | null = null;

  showForm = false;

  isEditMode = false;

  loading = false;

  errorMessage = '';

  // Replace this with your actual logged-in user ID
  currentUserId = 'current-user';


  constructor(
    private recipientService: RecipientService,
    private tokenService : TokenService,
    private cdr : ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.loadRecipients();
  }


  // =========================================
  // LOAD RECIPIENTS
  // =========================================

  loadRecipients(): void {

    this.loading = true;
    this.errorMessage = '';
    this.currentUserId = this.tokenService.getUserId() ?? '';

    this.recipientService
      .getAllRecipientsByUser(this.currentUserId)
      .subscribe({
        next: response => {

          this.recipients =
            response.data ?? [];

          this.loading = false;

          console.log('Recipient List',this.recipients);

          this.cdr.detectChanges();
        },

        error: error => {

          console.error(
            'Error loading recipients:',
            error
          );

          this.errorMessage =
            error?.error?.message ??
            'Unable to load recipients.';

          this.loading = false;
        }
      });
  }


  // =========================================
  // ADD
  // =========================================

  onAddRecipient(): void {

    this.selectedRecipient = null;

    this.isEditMode = false;

    this.showForm = true;
  }


  // =========================================
  // EDIT
  // =========================================

  onEditRecipient(
    recipient: RecipientResponse
  ): void {

    this.selectedRecipient = {
      ...recipient
    };

    this.isEditMode = true;

    this.showForm = true;
  }


  // =========================================
  // CLOSE FORM
  // =========================================

  onCancelForm(): void {

    this.selectedRecipient = null;

    this.isEditMode = false;

    this.showForm = false;
  }


  // =========================================
  // SAVE SUCCESS
  // =========================================

  onRecipientSaved(): void {

    this.selectedRecipient = null;

    this.isEditMode = false;

    this.showForm = false;

    this.loadRecipients();
  }


  // =========================================
  // DEACTIVATE
  // =========================================

  onDeactivateRecipient(
    recipientId: number
  ): void {

    this.recipientService
      .deactivateRecipient(recipientId)
      .subscribe({
        next: response => {

          console.log(
            response.message
          );

          this.loadRecipients();
        },

        error: error => {

          console.error(
            'Error deactivating recipient:',
            error
          );
        }
      });
  }
}