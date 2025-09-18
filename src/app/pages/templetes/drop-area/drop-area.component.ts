import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { CdkDropList, CdkDragDrop } from '@angular/cdk/drag-drop';
import { CreateformbuilderService } from '../../../core/services/formbuilder/createformbuilder.service';
import { FieldConfig } from '../../../core/models/interfaces/legacy-extras';
import { RerenderComponent } from '../rerender/rerender.component';
@Component({
  selector: 'app-drop-area',
  standalone: true,
  imports: [CommonModule, AsyncPipe, CdkDropList, RerenderComponent],
  templateUrl: './drop-area.component.html',
  styleUrl: './drop-area.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropAreaComponent {
  private _fbService = inject(CreateformbuilderService);
  fields$ = this._fbService.schema$;

  onDrop(event: CdkDragDrop<any>) {
    const tool = event.item?.data as FieldConfig;
    if (!tool) return;
    const copied = this._fbService.createCopiedField(tool);
    this._fbService.addField(copied);
  }
}
