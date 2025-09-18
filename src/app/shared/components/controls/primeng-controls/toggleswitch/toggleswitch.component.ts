import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-toggleswitch',
  standalone: true,
  imports: [ToggleSwitchModule],
  templateUrl: './toggleswitch.component.html',
  styleUrl: './toggleswitch.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleswitchComponent {

}
