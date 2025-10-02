# وثيقة SRC لمشروع Formify Drag (تفصيلي)

## 1) نظرة عامة سريعة
- **الغرض**: بناء نماذج ديناميكية عبر السحب والإفلات، ثم معاينتها وتعديل خصائص الحقول وتوليد مخطط JSON يمكن استيراده وتصديره.
- **التقنيات**: Angular 19 (Standalone + Signals + Reactive Forms) + PrimeNG 19 + TailwindCSS 4 + Angular CDK DragDrop.
- **نمط العمل**:
  - واجهة "لوحة عناصر" لاختيار الحقول (Palette).
  - "كانفاس" لإسقاط العناصر وبناء النموذج.
  - نافذة تحرير خصائص الحقل.
  - توليد/تحميل JSON يمثل مخطط النموذج (Schema) للاستعمال الخارجي.

المسار الرئيسي: `src/app/app.routes.ts` يوجه إلى صفحة `node-layout` التي تعرض واجهة البناء الفعلية عبر `NodelayoutComponent` الذي يستضيف `CanvasComponent`.

---

## 2) بنية المشروع المختصرة
- **الدخول**
  - `src/main.ts`: يشغل التطبيق عبر `bootstrapApplication(AppComponent, appConfig)`.
  - `src/app/app.config.ts`: مزودي التطبيق مثل `provideRouter(routes)`, `provideAnimations()`, `provideHttpClient()` وتهيئة PrimeNG.
  - `src/app/app.routes.ts`: يوجه المسار الجذر إلى `node-layout`.
  - `src/styles.css`: استيراد Tailwind و PrimeIcons.

- **الجذر**
  - `src/app/app.component.*`: مكون جذري بسيط يعرض عنوانًا ويحتوي `RouterOutlet`.

- **الصفحات**
  - `src/app/pages/nodelayout/*`: صفحة الحاوية الرئيسية للشريط العلوي وشعار Formify وإزرار تغيير الثيم والتصدير، وتضمين `CanvasComponent`.
  - `src/app/pages/templetes/canvas/*`: لبّ المنطق الخاص بالسحب والإفلات وبناء النموذج، معاينة، توليد/استيراد JSON.
  - `src/app/pages/templetes/palette/*`: عرض عناصر الحقول المتاحة (Palette) للسحب.
  - `src/app/pages/templetes/rerender/*`: إعادة عرض الحقول بحسب نوعها داخل الكانفاس.
  - `src/app/pages/templetes/drop-area/*`: منطقة الإسقاط (إن وُجدت في سيناريوهات أخرى).

- **النواة (Core)**
  - `src/app/core/services/formbuilder/*`:
    - `CreateformbuilderService`: حالة مخطط النموذج + عمليات الحقول + التكويد/الفك عبر `SchemaSerializerService` + بناء FormGroup عبر `FormGroupFactoryService` + نسخ الحقول عبر `FieldFactoryService`.
    - `FormGroupFactoryService`: إنشاء `FormGroup` من مخطط `FormSchema` مع الخرائط الصحيحة للمتحقّقات.
    - `FieldFactoryService`: توحيد ونسخ الحقول، وضمان اسم formControl صالح، وتطبيع `fieldStyle`.
    - `SchemaSerializerService`: تصدير/استيراد مخطط JSON، وبناء شكل التصدير النهائي (controls + style + containerStyle).
  - خدمات أخرى: `ToggleThemeService` للتبديل بين الوضع الليلي والنهاري، و`ImageUploadService` لرفع الصور (قابلة للاستخدام مع حقول الصور مستقبلًا).

- **مشتركات (Shared)**
  - `src/app/shared/components/*`: مكونات قابلة لإعادة الاستخدام، مثل `json-viewer`, محرر الحقول، وعناصر PrimeNG التفصيلية.

---

## 3) التدفق الوظيفي (Workflow)
1. **الدخول إلى واجهة البناء**:
   - التوجيه إلى `node-layout` عبر `app.routes.ts`:
     ```ts
     { path: 'node-layout', loadComponent: () => import('./pages/nodelayout/nodelayout.component').then(m => m.NodelayoutComponent) }
     ```
   - `NodelayoutComponent` يعرض شريط علوي يحتوي شعار وعنوان المشروع وزر تغيير الثيم وزر تنزيل JSON. ثم يستضيف `CanvasComponent` داخل الجزء الرئيسي.

2. **لوحة الأدوات (Palette)** في `CanvasComponent`:
   - تُحمّل عناصر أولية من `PALETTE_TOOLS` و/أو `tools.config.ts` مثل: input-text، password، select، textarea، إلخ.
   - اللوحة هي `cdkDropList` متصلة بقائمة `canvas` لتمكين السحب بينهما.

3. **الكانفاس (Canvas)**:
   - منطقة إسقاط `cdkDropList` ترتبط مع لوحة الأدوات عبر `[cdkDropListConnectedTo]`.
   - عند السحب والإسقاط، يتم:
     - أخذ العنصر من اللوحة.
     - توليد نسخة عبر `CreateformbuilderService.createCopiedField()` لضمان ID وKey و`formControl` صالح.
     - إضافة الحقل إلى `droppedTools` (حالة محلية داخل `CanvasComponent`).
     - إعادة بناء نموذج Reactive `FormGroup` عبر `formBuilderService.buildFormGroup()`.

4. **التحرير والاختيار**:
   - عند النقر على حقل، يتم تعيينه كـ `selectedField` وإتاحة زر "Edit Selected" لفتح محرر الخصائص.
   - بعد حفظ التعديلات، يتم دمج التغييرات في `droppedTools` وتحديث النموذج.

5. **Reactive Forms + Signals**:
   - الحقول المخزنة في `droppedTools` تُحوّل إلى `FormGroup` (عبر `FormGroupFactoryService`) بناءً على `FieldConfig.formControl`.
   - يوجد `effect` مرتبط بـ `fields()` (Signal) لتحديث Controls تلقائيًا عند تغير الحقول.

6. **توليد/تنزيل JSON**:
   - الزر "Generate JSON" يفتح `JsonViewerComponent` بمخطط التصدير عبر `SchemaSerializerService.buildExportSchema()` + `exportSchema()`.
   - الزر "Download JSON" يقوم بمزامنة قيم الـ FormGroup داخل الحقول ثم يبني JSON ويحفظ ملف `*.json` باسم عنوان النموذج.

7. **استيراد JSON**:
   - "Import JSON" يفتح اختيار ملف، ثم يقرأ المحتوى ويحوّله إلى `FieldConfig[]` (أو يقبل صيغة legacy).
   - تٌبنَى `FormGroup` من جديد وتُعرض الحقول المستوردة في الكانفاس.

8. **تغيير الثيم**:
   - `ToggleThemeService.toggleDarkMode()` يضيف/يزيل `my-app-dark` على عنصر `html`، ويُحفظ الاختيار في `localStorage`.

---

## 4) نموذج البيانات (Data Model)
- `FieldConfig` (مبسّط): يصف كل عنصر في النموذج: `id`, `kind` (control/group/array), `formControl`, `type`, `label`, `value`, `fieldStyle`, `validators`, `options` ...
- `FormSchema`: يضم `id`, وربما `layout` أو `controls`/`fields` حسب طريقة التصدير/الاستيراد.
- التصدير النهائي عبر `SchemaSerializerService.buildExportSchema()` يُنتج كائنًا يحتوي:
  - `id`, `formGroup`: اسم النموذج (من عنوان المستخدم).
  - `containerStyle`: خصائص الحاوية.
  - `controls[]`: عناصر تتضمن `data` و`style`، وتراعي الحاويات (group/array) والحقول العادية.

مثال عنصر حقل عند التصدير:
```json
{
  "data": {
    "formControlName": "username",
    "fieldType": "input-text",
    "label": "User Name",
    "value": null,
    "required": true
  },
  "style": {
    "columns": 2,
    "width": "100%"
  }
}
```

---

## 5) الخدمات الأساسية وأدوارها
- `CreateformbuilderService`:
  - مصدر الحقيقة لـ `schema$` (BehaviorSubject) وتحديث الحقول.
  - ينشئ `FormGroup` من `FormSchema`.
  - ينسخ الحقول (`FieldFactoryService`) ويصدر/يستورد (`SchemaSerializerService`).
  - يدير إضافة أطفال لمجموعة/مصفوفة حقول مع توليد مفاتيح فريدة.

- `FormGroupFactoryService`:
  - يبني `FormGroup` من الحقول باستخدام `mapValidators` و`mapAsyncValidators`، ويطبق `Validators.pattern` عند الحاجة.

- `FieldFactoryService`:
  - تطبيع `fieldStyle` (عرض/أعمدة) وضمان اسم `formControl` صالح عبر `sanitizeFieldName`.
  - نسخ عميق للحقول مع تعيين `id/key` جديدة ودعم خاص لـ group/array.

- `SchemaSerializerService`:
  - `export()` و`import()` عبر `exportSchema`/`importSchema`.
  - `buildExportSchema()` يُعيد شكلًا موحدًا (container + controls) مع تضمين أنماط خاصة لبعض الأنواع مثل حقول الصور.

- `ToggleThemeService`:
  - تبديل class `my-app-dark` على عنصر `html` للتغيير بين الوضعين.

- `ImageUploadService`:
  - رفع ملفات الصور عبر `HttpClient`، مع إتاحة تغيير اسم الحقل multipart وإرجاع شكل `UploadResponse` مرن.

---

## 6) الواجهة (UI) الرئيسية
- `NodelayoutComponent` (`src/app/pages/nodelayout/nodelayout.component.*`):
  - شريط علوي مع شعار + عنوان (`<app-root [nameProject]="'Formify Dynamic Form Builder'">`).
  - زر تبديل الثيم، وزر تنزيل JSON يستدعي `canvasRef.downloadJson()`.
  - يعرض `<app-canvas #canvasRef>` كمنطقة العمل.

- `CanvasComponent` (`src/app/pages/templetes/canvas/canvas.component.*`):
  - شريط خيارات اليسار (SelectButton بين PrimeNG/Default).
  - لوحة الأدوات Palette (قابلة للسحب).
  - كانفاس (منطقة الإسقاط + إعادة عرض الحقول + تحرير + حذف + توليد/استيراد JSON).

---

## 7) كيف تعمل خطوة بخطوة (تفصيلي)
- **سحب عنصر جديد**: من `app-palette` إلى `cdkDropList#canvas`.
- **إنشاء نسخة**: `createCopiedField()` يضمن `id/key/formControl` جديدة وقيم `fieldStyle` افتراضية منطقية.
- **تحديث الحالة**: إضافة العنصر لـ `droppedTools` وتحديده كعنصر مختار.
- **بناء الـ FormGroup**: إنشاء Controls بناءً على `formControl` لكل حقل عبر `FormGroupFactoryService`.
- **التحقق والـ valueChanges**: مزامنة قيم الـ FormGroup يرجع لتحديث `value` داخل الحقول.
- **تحرير الحقل**: فتح محرر، تعديل خصائص، دمج التعديلات في الحقل المحدد.
- **التصدير/التنزيل**: بناء `FormSchema` النهائي ثم تحويله JSON وحفظه.
- **الاستيراد**: قراءة JSON، تحويله `FieldConfig[]`, تحديث الكانفاس والـ FormGroup.

---

## 8) تشغيل المشروع محليًا
- تثبيت الاعتمادات: `npm install`.
- تشغيل: `npm start` أو `ng serve`.
- افتح: `http://localhost:4200/node-layout`.

ملاحظة: تأكد من وجود Tailwind 4 وPrimeNG 19 مثبتين ومهيئين كما في `styles.css` و`app.config.ts`.

---

## 9) الإرشادات المعمارية (معتمدة في الكود)
- Standalone Components فقط، بدون NgModules.
- `ChangeDetectionStrategy.OnPush` مفعّل للمكونات الأساسية.
- Reactive Forms + Signals للحالة المحلية.
- PrimeNG 19 مستورد مباشرة داخل المكونات.
- Tailwind 4 مستخدم للتخطيط والألوان والفراغات.

---

## 10) التوسعة المستقبلية
- إضافة أنواع حقول جديدة عبر تحديث `PALETTE_TOOLS` و`RerenderComponent`.
- دعم حاويات متداخلة (Groups داخل Groups) بصورة بصرية أعمق.
- ربط الرفع الحقيقي للملفات عبر `ImageUploadService` ضمن حقول الصور.
- مولد Codegen لمكون Angular من JSON للتضمين السريع.
- نظام قوالب جاهزة (Presets) قابلة للاختيار.

---

## 11) القيود الحالية
- عدم وجود إدارة حالة عالمية خارج الخدمات الحالية (يمكن إضافة Store لاحقًا لو احتاج).
- واجهة التحرير تعتمد على مكون محرر خصائص واحد؛ قد تحتاج تنويع حسب نوع الحقل.
- التحقق المتقدم (Conditional/Async) يحتاج توسيع في `FormGroupFactoryService` عند الحاجة.

---

## 12) مسارات وملفات مفتاحية
- التوجيه: `src/app/app.routes.ts`
- الصفحة الرئيسية للبناء: `src/app/pages/nodelayout/nodelayout.component.*`
- الكانفاس: `src/app/pages/templetes/canvas/canvas.component.*`
- الخدمات الأساسية:
  - `src/app/core/services/formbuilder/createformbuilder.service.ts`
  - `src/app/core/services/formbuilder/field-factory.service.ts`
  - `src/app/core/services/formbuilder/form-group-factory.service.ts`
  - `src/app/core/services/formbuilder/schema-serializer.service.ts`
- الثيم: `src/app/core/services/toggle-theme.service.ts`
- الرفع: `src/app/core/services/upload/image-upload.service.ts`

---

## 13) مثال سريع للاستخدام
1. افتح `/node-layout`.
2. اسحب عنصر "Text Input" وأسقطه في الكانفاس.
3. حدد الحقل واضغط "Edit Selected" لتعديل `label` و`required`.
4. اكتب عنوان النموذج في الحقل أعلى الكانفاس.
5. اضغط "Generate JSON" لعرض المخطط، أو "Download JSON" لتنزيل الملف.
6. جرّب "Import JSON" لإعادة تحميل نموذج محفوظ.

انتهى.
