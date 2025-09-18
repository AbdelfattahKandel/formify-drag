import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-palette',
  imports: [CommonModule, CdkDrag],
  standalone: true,
  templateUrl: './palette.component.html',
  styleUrl: './palette.component.css'
})
export class PaletteComponent {
  @Input() tools : any[] = [];
  @Output() itemDragged = new EventEmitter<any>();

  selectedOption: any;
  checked: boolean = true;

  // This is needed to track the original items for the palette
  trackByFn(index: number, item: any) {
    const base = item?.id ?? item?.type ?? item?.kind ?? 'tool';
    return `${String(base)}-${index}`;
  }

  onDragStarted(tool: any) {
    // Generate a random number between 1 and 10 and append it to the tool's name to create a unique ID
    const randomNum = Math.floor(Math.random() * 10) + 1;
    tool.id = `${tool.type}-${randomNum}`;
    
    // This method prevents the original item from being removed from the palette
    // The actual copying is handled in the canvas component's drop handler
  }
  onDragEnd(tool: any) {
    this.itemDragged.emit(tool);
  }
}
