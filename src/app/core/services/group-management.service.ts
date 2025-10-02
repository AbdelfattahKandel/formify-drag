import { Injectable, inject } from '@angular/core';
import { GroupConfig } from '../models/interfaces/group-config';
import { FormSchema } from '../models/interfaces/form-schema';
import { PageManagementService } from './page-management.service';

@Injectable({
  providedIn: 'root',
})
export class GroupManagementService {
  private readonly pageManagementService = inject(PageManagementService);

  addGroup(pageName: string, groupName: string): boolean {
    const trimmedGroupName = groupName.trim();
    if (!trimmedGroupName) {
      console.warn('Group name cannot be empty');
      return false;
    }

    const page = this.pageManagementService.getPageByName(pageName);
    if (!page) {
      console.warn(`Page "${pageName}" not found`);
      return false;
    }

    if (page.groups[trimmedGroupName]) {
      console.warn(`Group "${trimmedGroupName}" already exists in page "${pageName}"`);
      return false;
    }

    const newGroup: GroupConfig = {
      groupName: trimmedGroupName,
      forms: [],
    };

    const updatedGroups = {
      ...page.groups,
      [trimmedGroupName]: newGroup,
    };

    return this.pageManagementService.updatePageGroups(pageName, updatedGroups);
  }

  removeGroup(pageName: string, groupName: string): boolean {
    const page = this.pageManagementService.getPageByName(pageName);
    if (!page) {
      console.warn(`Page "${pageName}" not found`);
      return false;
    }

    if (!page.groups[groupName]) {
      console.warn(`Group "${groupName}" not found in page "${pageName}"`);
      return false;
    }

    const updatedGroups = { ...page.groups };
    delete updatedGroups[groupName];

    return this.pageManagementService.updatePageGroups(pageName, updatedGroups);
  }

  assignFormToGroup(pageName: string, groupName: string, form: FormSchema): boolean {
    const page = this.pageManagementService.getPageByName(pageName);
    if (!page) {
      console.warn(`Page "${pageName}" not found`);
      return false;
    }

    if (!page.groups[groupName]) {
      console.warn(`Group "${groupName}" not found in page "${pageName}"`);
      return false;
    }

    const formWithMeta = {
      ...form,
      pageName,
      groupName,
    };

    const updatedGroup: GroupConfig = {
      ...page.groups[groupName],
      forms: [...page.groups[groupName].forms, formWithMeta],
    };

    const updatedGroups = {
      ...page.groups,
      [groupName]: updatedGroup,
    };

    return this.pageManagementService.updatePageGroups(pageName, updatedGroups);
  }

  getGroupForms(pageName: string, groupName: string): FormSchema[] {
    const page = this.pageManagementService.getPageByName(pageName);
    if (!page) {
      console.warn(`Page "${pageName}" not found`);
      return [];
    }

    const group = page.groups[groupName];
    if (!group) {
      console.warn(`Group "${groupName}" not found in page "${pageName}"`);
      return [];
    }

    return group.forms;
  }

  moveFormBetweenGroups(
    pageName: string,
    formId: string,
    fromGroupName: string,
    toGroupName: string
  ): boolean {
    const page = this.pageManagementService.getPageByName(pageName);
    if (!page) {
      console.warn(`Page "${pageName}" not found`);
      return false;
    }

    const fromGroup = page.groups[fromGroupName];
    const toGroup = page.groups[toGroupName];

    if (!fromGroup) {
      console.warn(`Source group "${fromGroupName}" not found`);
      return false;
    }

    if (!toGroup) {
      console.warn(`Target group "${toGroupName}" not found`);
      return false;
    }

    const formIndex = fromGroup.forms.findIndex((f) => f.id === formId);
    if (formIndex === -1) {
      console.warn(`Form with id "${formId}" not found in group "${fromGroupName}"`);
      return false;
    }

    const formToMove = { ...fromGroup.forms[formIndex], groupName: toGroupName };

    const updatedFromGroup: GroupConfig = {
      ...fromGroup,
      forms: fromGroup.forms.filter((f) => f.id !== formId),
    };

    const updatedToGroup: GroupConfig = {
      ...toGroup,
      forms: [...toGroup.forms, formToMove],
    };

    const updatedGroups = {
      ...page.groups,
      [fromGroupName]: updatedFromGroup,
      [toGroupName]: updatedToGroup,
    };

    return this.pageManagementService.updatePageGroups(pageName, updatedGroups);
  }

  removeFormFromGroup(pageName: string, groupName: string, formId: string): boolean {
    const page = this.pageManagementService.getPageByName(pageName);
    if (!page) {
      console.warn(`Page "${pageName}" not found`);
      return false;
    }

    const group = page.groups[groupName];
    if (!group) {
      console.warn(`Group "${groupName}" not found`);
      return false;
    }

    const updatedGroup: GroupConfig = {
      ...group,
      forms: group.forms.filter((f) => f.id !== formId),
    };

    const updatedGroups = {
      ...page.groups,
      [groupName]: updatedGroup,
    };

    return this.pageManagementService.updatePageGroups(pageName, updatedGroups);
  }

  getGroupNames(pageName: string): string[] {
    const page = this.pageManagementService.getPageByName(pageName);
    if (!page) {
      return [];
    }
    return Object.keys(page.groups);
  }

  renameGroup(pageName: string, oldGroupName: string, newGroupName: string): boolean {
    const trimmedNewName = newGroupName.trim();
    if (!trimmedNewName) {
      console.warn('New group name cannot be empty');
      return false;
    }

    const page = this.pageManagementService.getPageByName(pageName);
    if (!page) {
      console.warn(`Page "${pageName}" not found`);
      return false;
    }

    if (!page.groups[oldGroupName]) {
      console.warn(`Group "${oldGroupName}" not found`);
      return false;
    }

    if (page.groups[trimmedNewName]) {
      console.warn(`Group "${trimmedNewName}" already exists`);
      return false;
    }

    const oldGroup = page.groups[oldGroupName];
    const renamedGroup: GroupConfig = {
      ...oldGroup,
      groupName: trimmedNewName,
      forms: oldGroup.forms.map((form) => ({ ...form, groupName: trimmedNewName })),
    };

    const updatedGroups = { ...page.groups };
    delete updatedGroups[oldGroupName];
    updatedGroups[trimmedNewName] = renamedGroup;

    return this.pageManagementService.updatePageGroups(pageName, updatedGroups);
  }
}
