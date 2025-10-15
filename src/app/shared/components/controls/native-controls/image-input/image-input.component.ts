import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';

@Component({
  selector: 'app-image-input',
  imports: [],
  templateUrl : './image-input.component.html',
  styleUrl: './image-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageInputComponent { 

  field = input.required<FieldConfig>();

}
