import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-json-viewer',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, TooltipModule],
  templateUrl: './json-viewer.component.html',
  styleUrl: './json-viewer.component.css',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonViewerComponent {
  json: string = '';

  // Use inject() for better tree-shaking
  private messageService = inject(MessageService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  constructor() {
      if (this.config.data?.json) {
          this.json = this.config.data.json;
      }
  }

  copyToClipboard(): void {
      navigator.clipboard.writeText(this.json).then(() => {
          this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'JSON copied to clipboard!'
          });
          return true;
      }).catch(err => {
          console.error('Failed to copy text: ', err);
          this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to copy to clipboard'
          });
          return false;
      });
  }

  copyAndClose(): void {
      this.copyToClipboard();
      this.ref.close(true);
  }
}
