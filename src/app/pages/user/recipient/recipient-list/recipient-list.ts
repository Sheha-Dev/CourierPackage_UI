import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RecipientResponse } from '../../../../models/recipient';


@Component({
  selector: 'app-recipient-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './recipient-list.html',
  styleUrl: './recipient-list.scss'
})
export class RecipientList {

  @Input()
  recipients: RecipientResponse[] = [];

  @Input()
  loading = false;


  @Output()
  addRecipient =
    new EventEmitter<void>();

  @Output()
  editRecipient =
    new EventEmitter<RecipientResponse>();

  @Output()
  deactivateRecipient =
    new EventEmitter<number>();


  onEdit(
    recipient: RecipientResponse
  ): void {

    this.editRecipient.emit(recipient);
  }


  onDeactivate(
    recipient: RecipientResponse
  ): void {

    const confirmed =
      window.confirm(
        `Deactivate ${recipient.nickName || recipient.userName}?`
      );

    if (!confirmed) {
      return;
    }

    this.deactivateRecipient.emit(
      recipient.recipientId
    );
  }
}