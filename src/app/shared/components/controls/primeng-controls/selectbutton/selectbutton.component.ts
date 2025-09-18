import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-selectbutton',
  standalone: true,
  imports: [SelectButtonModule],
  templateUrl: './selectbutton.component.html',
  styleUrl: './selectbutton.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectbuttonComponent {

}
