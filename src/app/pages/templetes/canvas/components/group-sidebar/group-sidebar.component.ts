import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-group-sidebar',
  standalone: true,
  imports: [CommonModule, ButtonModule, PanelModule, TooltipModule, BadgeModule],
  templateUrl: './group-sidebar.component.html',
  styleUrls: ['./group-sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupSidebarComponent {
  groupNames = input.required<string[]>();
  selectedGroup = input.required<string>();

  groupSelect = output<string>();
  groupAdd = output<void>();
  groupRemove = output<string>();

  onSelectGroup(groupName: string): void {
    this.groupSelect.emit(groupName);
  }

  onAddGroup(): void {
    this.groupAdd.emit();
  }

  onRemoveGroup(groupName: string, event: Event): void {
    event.stopPropagation();
    this.groupRemove.emit(groupName);
  }

  isSelected(groupName: string): boolean {
    return this.selectedGroup() === groupName;
  }
}
