import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';

interface GroupOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-form-group-assign',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, ButtonModule, TooltipModule, SelectModule],
  templateUrl: './form-group-assign.component.html',
  styleUrls: ['./form-group-assign.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormGroupAssignComponent {
  groupNames = input.required<string[]>();
  selectedGroup = input.required<string>();
  disabled = input<boolean>(false);

  groupChange = output<string>();
  assignToGroup = output<void>();

  groupOptions = computed<GroupOption[]>(() => {
    return this.groupNames().map((name) => ({
      label: name,
      value: name,
    }));
  });

  selectedGroupValue = computed<string>(() => this.selectedGroup());

  onGroupChange(groupName: string): void {
    this.groupChange.emit(groupName);
  }

  onAssignClick(): void {
    this.assignToGroup.emit();
  }

  hasGroups(): boolean {
    return this.groupNames().length > 0;
  }
}
