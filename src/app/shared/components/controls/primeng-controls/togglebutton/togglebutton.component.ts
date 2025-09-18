import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-togglebutton',
  standalone: true,
  imports: [ToggleButtonModule],
  templateUrl: './togglebutton.component.html',
  styleUrl: './togglebutton.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TogglebuttonComponent {

}
