# خطة تحسين مشروع Formify Drag

## نظرة عامة

- **الهدف**: بناء تجربة إنشاء نماذج تدعم الاختيار بين PrimeNG والمكونات native، مع تحسين البنية وتقليل التعقيد في المكونات الثقيلة الحالية.
- **نطاق العمل**: يشمل شاشات الترحيب، إعداد التفضيلات، صفحة `nodelayout`، وخدمات بناء النماذج ضمن `src/app/core/services/`.

## الخطوات المقترحة

### 1. إدارة تفضيلات المستخدم

- **المطلوب**: إنشاء خدمة `BuilderPreferencesService` في `src/app/core/services/` تحتفظ بإشارات `uiChoice` و`styleChoice` بصورة مركزية.
- **التفاصيل**:
  - استخدام `signal` لتخزين الاختيارات مع دوال `setPreferences()` و`reset()` وقراءات readonly.
  - تحضير واجهة `BuilderPreferences` في `src/app/core/models/` لتوثيق القيم المتاحة.
  - يدعو `SetupStylesService.finish()` الخدمة الجديدة قبل التنقّل إلى `/node-layout`.

### 2. فصل مصادر الأدوات (Palette Tools)

- **المطلوب**: إعادة تنظيم تعريف الأدوات في مجلد جديد `src/app/pages/nodelayout/tools/`.
- **التفاصيل**:
  - ملف `primeng-tools.config.ts` لأدوات PrimeNG الحالية.
  - ملف `native-tools.config.ts` لأدوات HTML القياسية.
  - ملف جامع `tools-map.ts` يعيد كائن `Record<UiChoice, FieldConfig[]>` يسهل الاستهلاك داخل `NodelayoutComponent`.

### 3. ربط التفضيلات بالـ Canvas

- **المطلوب**: تحديث `NodelayoutComponent` في `src/app/pages/nodelayout/nodelayout.component.ts` لقراءة الخيار الحالي من الخدمة الجديدة.
- **التفاصيل**:
  - إنشاء `computed` تجمع الأدوات بناءً على `uiChoice`.
  - تمرير نوع الأدوات إلى `CanvasComponent` و`PaletteComponent` عبر `@Input` موحّد.
  - إضافة حارس بسيط: إذا لم تُحدد التفضيلات، يعيد المستخدم إلى `/get-started`.

### 4. توحيد المكونات المشتركة

- **المطلوب**: تجهيز هيكل واضح في `src/app/shared/components/controls/` لمكونات PrimeNG وأخرى Native.
- **التفاصيل**:
  - إنشاء مجلد `native-controls/` يحتوي مكونات standalone لكل حقل أساسي (input، select... إلخ) باستخدام Tailwind.
  - إعداد factory أو mapping (مثلاً `control-renderer-map.ts`) يحدد مكون العرض المناسب حسب `uiChoice` و`field.type`.
  - تحديث `CanvasComponent` أو الخدمة المسؤولة عن التوليد لتستخدم هذا mapping عند الريندر.

### 5. تحسين الخدمات الحالية

- **المطلوب**: تبسيط `CreateformbuilderService` و`CanvasComponent`.
- **التفاصيل**:
  - نقل منطق الاستيراد/التصدير بالكامل إلى `SchemaSerializerService`.
  - إنشاء خدمة وسيطة (مثلاً `FormSchemaStoreService`) تستخدم signals بدل `BehaviorSubject` لتخزين `FormSchema` الحالي.
  - تفكيك `CanvasComponent` إلى مكوّنات أصغر (إدارة السجلات، إدارة الصفحات، محرر الخصائص) وفق مراحل لاحقة.

### 6. حوكمة التجربة والتوثيق

- **المطلوب**: تحديث المستندات والاختبارات.
- **التفاصيل**:
  - توثيق التفضيلات الجديدة وكيفية استخدامها في `docs/`.
  - إضافة اختبار وحدات للخدمات الجديدة باستخدام `Jest` أو `Karma` حسب الإعداد.
  - التحقق من التزام جميع المكونات بـ `ChangeDetectionStrategy.OnPush`.

## خطة التنفيذ المرحلية

- **المرحلة 1**: إنشاء خدمة التفضيلات وربطها بشاشة الترحيب دون تغيير الـ Canvas.
- **المرحلة 2**: تنظيم أدوات الـ Palette وربطها بـ `NodelayoutComponent` حسب الاختيار.
- **المرحلة 3**: إعداد المكونات native وتحديث الـ Canvas للريندر الديناميكي.
- **المرحلة 4**: تفكيك الخدمات الثقيلة وإعادة توزيع المسؤوليات.
- **المرحلة 5**: إضافة التوثيق والاختبارات وإجراء مراجعة أداء خفيفة.

## اعتبارات إضافية

- **حفظ الحالة**: يمكن التفكير في تخزين الاختيار في `localStorage` عبر الخدمة الجديدة للحفاظ على التفضيلات بعد إعادة التحميل.
- **التصميم**: الالتزام بـ Tailwind 4 و`ChangeDetectionStrategy.OnPush` في كل المكوّنات الجديدة.
- **التوافق**: تأكد من أن ملفات التكوين الجديدة لا تكسر استيراد `PALETTE_TOOLS` الحالي حتى اكتمال الانتقال.
