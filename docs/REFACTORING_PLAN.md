# 📋 خطة تعديل بنية JSON - Formify Drag & Build

## 📌 ملخص التعديل المطلوب

تحويل بنية الـ JSON من:
- **فورم واحد** يحتوي على `controls`

إلى:
- **Array من الصفحات (Pages)**
- كل صفحة تحتوي على **Groups**
- كل Group يحتوي على **Array من Forms**

---

## 🔍 البنية الحالية

### الـ JSON الحالي:
```json
{
  "id": "form_156",
  "formGroup": "form_group",
  "containerStyle": {...},
  "controls": [
    {
      "data": {
        "formControlName": "text",
        "fieldType": "input-text",
        ...
      },
      "style": {...}
    }
  ]
}
```

### المشاكل في البنية الحالية:
1. ✖️ لا يدعم تعدد الصفحات (Pages)
2. ✖️ لا يدعم تجميع الفورمات في Groups
3. ✖️ بنية ثابتة غير قابلة للتوسع
4. ✖️ مفتاح `formGroup` ثابت

---

## 🎯 البنية الجديدة المطلوبة

### الـ JSON الجديد:
```json
[
  {
    "home": {
      "groups": {
        "عملاء جدد": [
          {
            "id": "form_1",
            "formGroup": "عملاء جدد_group",
            "controls": [...]
          },
          {
            "id": "form_2",
            "formGroup": "عملاء جدد_group",
            "controls": [...]
          }
        ],
        "Products": [
          {
            "id": "form_3",
            "formGroup": "Products_group",
            "controls": [...]
          }
        ],
        "Orders 2025": []
      }
    }
  },
  {
    "offer": {
      "groups": {
        "عملاء جدد": [...],
        "Products": [...]
      }
    }
  },
  {
    "dashboard": {
      "groups": {...}
    }
  }
]
```

### مميزات البنية الجديدة:
1. ✅ دعم تعدد الصفحات (Pages) ديناميكياً
2. ✅ دعم تجميع الفورمات في Groups
3. ✅ أسماء ديناميكية للصفحات والـ Groups
4. ✅ قابلية توسع عالية
5. ✅ تنظيم أفضل للبيانات

---

## 🗂️ الهيكل المطلوب

```
Array<Page>
├── Page Object (dynamic key: "home", "offer", etc.)
│   └── groups: Object
│       ├── Group (dynamic key: "عملاء جدد")
│       │   └── Array<Form>
│       │       ├── Form 1 {id, formGroup, controls[]}
│       │       └── Form 2 {id, formGroup, controls[]}
│       ├── Group (dynamic key: "Products")
│       │   └── Array<Form>
│       └── Group (dynamic key: "Orders 2025")
│           └── [] (empty array)
```

---

## 📊 دياجرام التدفق (Flow Diagram)

```
┌─────────────────────────────────────────────────────────┐
│              USER INTERFACE (Canvas)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Pages   │  │  Groups  │  │  Forms   │             │
│  │  Tabs    │  │  List    │  │  Builder │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│                   CANVAS COMPONENT                       │
│  • currentPage: Signal<string>                          │
│  • pages: Signal<PageConfig[]>                          │
│  • selectedGroup: Signal<string>                        │
│  • droppedTools: Signal<FieldConfig[]>                  │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│              PAGE MANAGEMENT SERVICE                     │
│  • addPage(pageName: string)                            │
│  • removePage(pageName: string)                         │
│  • switchPage(pageName: string)                         │
│  • getPages(): PageConfig[]                             │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│              GROUP MANAGEMENT SERVICE                    │
│  • addGroup(pageName, groupName)                        │
│  • removeGroup(pageName, groupName)                     │
│  • assignFormToGroup(form, group)                       │
│  • getGroupForms(pageName, groupName)                   │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│           SCHEMA SERIALIZER SERVICE (Updated)            │
│  • buildMultiPageExportSchema()                         │
│  • exportMultiPage()                                    │
│  • importMultiPage()                                    │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│                    JSON OUTPUT                           │
│         Array<{[pageName]: {groups: {...}}}>            │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 الملفات المطلوب تعديلها/إنشاؤها

### 1️⃣ **Core Models (Interfaces)**
الملفات: `src/app/core/models/interfaces/`

#### إنشاء ملفات جديدة:
- ✨ **`page-config.ts`** - Interface للصفحة
```typescript
export interface PageConfig {
  pageName: string;
  groups: Record<string, GroupConfig>;
}
```

- ✨ **`group-config.ts`** - Interface للمجموعة
```typescript
export interface GroupConfig {
  groupName: string;
  forms: FormSchema[];
}
```

- ✨ **`multi-page-schema.ts`** - Interface للبنية الكاملة
```typescript
export interface MultiPageSchema {
  pages: PageConfig[];
}
```

#### تعديل ملفات موجودة:
- 📝 **`form-schema.ts`** - إضافة support للـ groupName & pageName
  - Location: Line 8-39
  - Changes: Add `groupName?: string; pageName?: string;`

---

### 2️⃣ **Core Services**
الملفات: `src/app/core/services/`

#### إنشاء Services جديدة:
- ✨ **`page-management.service.ts`**
  - Location: `core/services/page-management.service.ts`
  - Purpose: إدارة الصفحات (إضافة، حذف، التبديل)
  - Methods:
    ```typescript
    addPage(pageName: string): void
    removePage(pageName: string): void
    switchPage(pageName: string): void
    getPages(): PageConfig[]
    getCurrentPage(): string
    ```

- ✨ **`group-management.service.ts`**
  - Location: `core/services/group-management.service.ts`
  - Purpose: إدارة المجموعات داخل كل صفحة
  - Methods:
    ```typescript
    addGroup(pageName: string, groupName: string): void
    removeGroup(pageName: string, groupName: string): void
    assignFormToGroup(pageName: string, groupName: string, form: FormSchema): void
    getGroupForms(pageName: string, groupName: string): FormSchema[]
    moveFormBetweenGroups(formId: string, fromGroup: string, toGroup: string): void
    ```

#### تعديل Services موجودة:
- 📝 **`schema-serializer.service.ts`**
  - Location: `core/services/formbuilder/schema-serializer.service.ts`
  - Current Lines: 1-123
  - Changes Needed:
    - Line 31-40: تعديل `buildExportSchema()` ليصبح `buildMultiPageExportSchema()`
    - Line 12-14: تعديل `export()` لدعم البنية الجديدة
    - إضافة:
      ```typescript
      buildMultiPageExportSchema(pages: PageConfig[]): any[]
      exportMultiPage(pages: PageConfig[]): string
      importMultiPage(json: string): PageConfig[]
      ```

---

### 3️⃣ **Components**
الملفات: `src/app/pages/templetes/canvas/`

#### تعديل المكونات الموجودة:
- 📝 **`canvas.component.ts`**
  - Location: Lines 1-573
  - Changes:
    - **Line 80-120**: إضافة state management للصفحات والمجموعات
      ```typescript
      // Add new signals
      currentPage = signal<string>('home');
      pages = signal<PageConfig[]>([]);
      selectedGroup = signal<string>('');
      ```
    
    - **Line 286-319**: تعديل `generateJson()` لدعم multi-page
      ```typescript
      generateJson() {
        const pages = this.pageManagementService.getPages();
        const multiPageSchema = this.schemaSerializer.buildMultiPageExportSchema(pages);
        this.generatedJson = this.schemaSerializer.exportMultiPage(pages);
        // ... rest
      }
      ```
    
    - **Line 323-355**: تعديل `downloadJson()` بنفس المنطق
    
    - **Line 357-425**: تعديل `onImportJsonSelected()` لدعم import البنية الجديدة

- 📝 **`canvas.component.html`**
  - Location: قراءة الملف لاحقاً
  - Changes: إضافة UI للتحكم في:
    - Tabs للصفحات
    - Sidebar للمجموعات
    - Dropdown لتعيين الفورم لمجموعة

#### إنشاء مكونات جديدة:
- ✨ **`page-tabs.component.ts`**
  - Location: `src/app/pages/templetes/canvas/components/page-tabs/`
  - Purpose: عرض tabs للصفحات + إضافة/حذف صفحات
  - Template:
    ```html
    <p-tabView [(activeIndex)]="activePageIndex">
      @for (page of pages(); track page.pageName) {
        <p-tabPanel [header]="page.pageName">
          <!-- محتوى الصفحة -->
        </p-tabPanel>
      }
      <p-button label="+" (click)="addNewPage()"></p-button>
    </p-tabView>
    ```

- ✨ **`group-sidebar.component.ts`**
  - Location: `src/app/pages/templetes/canvas/components/group-sidebar/`
  - Purpose: عرض قائمة المجموعات + إضافة/حذف مجموعات
  - Template:
    ```html
    <div class="groups-sidebar">
      <h3>Groups</h3>
      @for (group of groups(); track group) {
        <div class="group-item" (click)="selectGroup(group)">
          {{ group }}
          <button (click)="removeGroup(group)">×</button>
        </div>
      }
      <button (click)="addNewGroup()">+ Add Group</button>
    </div>
    ```

- ✨ **`form-group-assign.component.ts`**
  - Location: `src/app/pages/templetes/canvas/components/form-group-assign/`
  - Purpose: تعيين الفورم الحالي لمجموعة معينة
  - Template:
    ```html
    <p-dropdown 
      [options]="groupOptions()" 
      [(ngModel)]="selectedFormGroup"
      placeholder="Assign to Group"
      (onChange)="onGroupAssign($event)">
    </p-dropdown>
    ```

---

### 4️⃣ **Utils**
الملفات: `src/app/utils/`

- 📝 **`export-schema.ts`**
  - Current: Line 3-5
  - Add:
    ```typescript
    export function exportMultiPageSchema(pages: PageConfig[], pretty: boolean = true): string {
      const output = pages.map(page => ({
        [page.pageName]: {
          groups: Object.entries(page.groups).reduce((acc, [groupName, groupConfig]) => {
            acc[groupName] = groupConfig.forms;
            return acc;
          }, {} as Record<string, FormSchema[]>)
        }
      }));
      return pretty ? JSON.stringify(output, null, 2) : JSON.stringify(output);
    }
    ```

- ✨ **`import-multi-page-schema.ts`** (New File)
  - Purpose: استيراد البنية الجديدة
  - Function:
    ```typescript
    export function importMultiPageSchema(json: string): PageConfig[] {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) throw new Error('Invalid format');
      
      return parsed.map(pageObj => {
        const pageName = Object.keys(pageObj)[0];
        const pageData = pageObj[pageName];
        const groups: Record<string, GroupConfig> = {};
        
        Object.entries(pageData.groups).forEach(([groupName, forms]) => {
          groups[groupName] = {
            groupName,
            forms: forms as FormSchema[]
          };
        });
        
        return { pageName, groups };
      });
    }
    ```

---

## 🔧 خطوات التنفيذ (Step by Step)

### المرحلة 1: إنشاء Interfaces الجديدة
1. ✅ إنشاء `page-config.ts`
2. ✅ إنشاء `group-config.ts`
3. ✅ إنشاء `multi-page-schema.ts`
4. ✅ تعديل `form-schema.ts`

### المرحلة 2: إنشاء Services الجديدة
1. ✅ إنشاء `page-management.service.ts`
2. ✅ إنشاء `group-management.service.ts`
3. ✅ تعديل `schema-serializer.service.ts`

### المرحلة 3: إنشاء Utils الجديدة
1. ✅ تعديل `export-schema.ts`
2. ✅ إنشاء `import-multi-page-schema.ts`

### المرحلة 4: تعديل Canvas Component
1. ✅ إضافة Signals للـ pages, groups
2. ✅ تعديل `generateJson()`
3. ✅ تعديل `downloadJson()`
4. ✅ تعديل `onImportJsonSelected()`
5. ✅ Inject الـ Services الجديدة

### المرحلة 5: إنشاء UI Components
1. ✅ إنشاء `page-tabs.component.ts`
2. ✅ إنشاء `group-sidebar.component.ts`
3. ✅ إنشاء `form-group-assign.component.ts`
4. ✅ تعديل `canvas.component.html`

### المرحلة 6: الاختبار والتكامل
1. ✅ اختبار إضافة/حذف صفحات
2. ✅ اختبار إضافة/حذف مجموعات
3. ✅ اختبار تعيين فورمات للمجموعات
4. ✅ اختبار Export/Import JSON
5. ✅ اختبار التبديل بين الصفحات

---

## 🎨 UI/UX Design

### Layout الجديد:

```
┌─────────────────────────────────────────────────────────────┐
│  Formify Builder                              [Dark Mode]   │
├─────────────────────────────────────────────────────────────┤
│  [Home] [Offer] [Dashboard] [+]                             │
├──────────┬──────────────────────────────────────────────────┤
│ Groups   │  Form Title: ____________                        │
│          │                                                   │
│ ☰ عملاء  │  Current Group: [عملاء جدد ▼]                   │
│   جدد    │                                                   │
│          │  ┌──────────────────────────────────────────┐   │
│ ☰ Products│  │         Drag & Drop Canvas              │   │
│          │  │                                          │   │
│ ☰ Orders │  │  [Palette]        [Canvas Area]         │   │
│   2025   │  │                                          │   │
│          │  │  • Text                                  │   │
│ [+ Add   │  │  • Number         Dropped Fields:       │   │
│  Group]  │  │  • Date           - Name (Text)         │   │
│          │  │  • Select         - Email (Email)       │   │
│          │  │  ...              - Age (Number)        │   │
│          │  │                                          │   │
│          │  └──────────────────────────────────────────┘   │
│          │                                                   │
│          │  [Generate JSON] [Download JSON] [Import]        │
└──────────┴──────────────────────────────────────────────────┘
```

---

## 📋 Checklist للتأكد من اتباع القواعد

### Angular 19 Guidelines:
- ✅ استخدام Standalone Components فقط
- ✅ استخدام `ChangeDetectionStrategy.OnPush`
- ✅ استخدام Signals للـ state
- ✅ استخدام `@for`, `@if` بدلاً من `*ngFor`, `*ngIf`
- ✅ استخدام `inject()` بدلاً من constructor injection
- ✅ Reactive Forms فقط
- ✅ استخدام FormBuilder مع pattern `_fb = inject(FormBuilder)`

### Code Quality:
- ✅ No `any` type
- ✅ Strict typing في كل مكان
- ✅ Business logic في Services
- ✅ Components صغيرة ومركزة
- ✅ أسماء واضحة ووصفية

### PrimeNG 19:
- ✅ استيراد المكونات مباشرة في standalone components
- ✅ استخدام Tailwind للـ styling
- ✅ استخدام PrimeNG themes

---

## 🚨 نقاط مهمة يجب الانتباه لها

1. **Backward Compatibility**: التأكد من أن النظام يدعم استيراد الـ JSON القديم
2. **Data Migration**: إنشاء utility لتحويل البنية القديمة للجديدة
3. **State Sync**: مزامنة الـ state بين الصفحات والمجموعات والفورمات
4. **Performance**: استخدام Signals و OnPush للأداء الأمثل
5. **Validation**: التحقق من أسماء الصفحات والمجموعات (لا تكرار، لا أسماء فارغة)

---

## 📊 Data Flow Example

```typescript
// User Action
addPage('home') → PageManagementService
                ↓
// State Update
pages.update(p => [...p, { pageName: 'home', groups: {} }])
                ↓
// UI Update (Signals)
tabs automatically refresh
                ↓
// User adds group
addGroup('home', 'عملاء جدد') → GroupManagementService
                ↓
// State Update
pages.update(p => p.map(page => 
  page.pageName === 'home' 
    ? { ...page, groups: { ...page.groups, 'عملاء جدد': { groupName: '...', forms: [] } } }
    : page
))
                ↓
// User builds form and assigns to group
assignFormToGroup('home', 'عملاء جدد', formSchema)
                ↓
// Export
generateJson() → SchemaSerializer.buildMultiPageExportSchema()
                ↓
// Output
[
  {
    "home": {
      "groups": {
        "عملاء جدد": [formSchema]
      }
    }
  }
]
```

---

## 🎯 Expected Output Example

```json
[
  {
    "home": {
      "groups": {
        "عملاء جدد": [
          {
            "id": "form_1",
            "formGroup": "عملاء جدد_group",
            "containerStyle": {
              "dir": "ltr",
              "cssClass": "container grid",
              "columns": 4,
              "gap": "1rem"
            },
            "controls": [
              {
                "data": {
                  "formControlName": "name",
                  "fieldType": "input-text",
                  "value": null,
                  "label": "Name",
                  "required": true
                },
                "style": {
                  "columns": 2,
                  "width": "100%"
                }
              }
            ]
          }
        ],
        "Products": [],
        "Orders 2025": []
      }
    }
  },
  {
    "offer": {
      "groups": {
        "Special Offers": [],
        "Discounts": []
      }
    }
  }
]
```

---

## ✅ Success Criteria

1. ✅ يمكن إضافة صفحات ديناميكياً
2. ✅ يمكن إضافة مجموعات ديناميكياً داخل كل صفحة
3. ✅ يمكن تعيين فورم لمجموعة معينة
4. ✅ الـ JSON المُصدَّر يطابق البنية المطلوبة
5. ✅ يمكن استيراد الـ JSON الجديد بنجاح
6. ✅ Backward compatibility مع الـ JSON القديم
7. ✅ UI سلس وسهل الاستخدام
8. ✅ كل القواعد متبعة (Angular 19 + PrimeNG 19 + Tailwind)

---

## 📝 Notes

- هذه الخطة قابلة للتعديل حسب الاحتياج
- يمكن إضافة features إضافية مثل:
  - Drag & Drop لترتيب الصفحات
  - Drag & Drop لترتيب المجموعات
  - Clone Page/Group
  - Templates للصفحات
  - Export/Import لصفحة واحدة فقط

---

**Last Updated**: 2025-10-02  
**Author**: Cascade AI  
**Version**: 1.0.0
