import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-confirm-box',
  standalone: true,
  imports: [],
  templateUrl: './confirm-box.html',
  styleUrl: './confirm-box.scss'
})
export class ConfirmBox {

  @Input() title = 'Confirm';

  @Input() message =
    'Are you sure you want to continue?';

  @Input() confirmText =
    'Confirm';

  @Input() cancelText =
    'Cancel';

  @Input() confirmType:
    'danger' | 'primary' = 'danger';

  @Output() confirm =
    new EventEmitter<void>();

  @Output() cancel =
    new EventEmitter<void>();


  onConfirm(): void {
    this.confirm.emit();
  }


  onCancel(): void {
    this.cancel.emit();
  }


  onOverlayClick(): void {
    this.onCancel();
  }


  stopPropagation(
    event: MouseEvent
  ): void {

    event.stopPropagation();

  }
}