# خارطة طريق إعادة التنظيم (Refactoring Roadmap)

## 🎯 الهدف
تحسين بنية المشروع، تقليل التعقيد، وزيادة القابلية للصيانة مع الحفاظ على جميع الوظائف الحالية.

---

## 📋 المراحل التفصيلية

### المرحلة 1️⃣: تنظيف التكرار (يوم واحد)

#### الخطوات:
1. حذف `src/app/pages/templetes/canvas/config/palette-tools.ts`
2. تحديث `canvas.component.ts` لاستخدام `toolsMap`
3. حذف مجلد `config/` الفارغ

**النتيجة**: إزالة 225 سطر مكرر

---

### المرحلة 2️⃣: إنشاء FormSchemaStoreService (يومان)

#### الخطوات:
1. إنشاء `form-schema-store.service.ts` باستخدام Signals
2. تحديث `createformbuilder.service.ts` لاستخدام Store الجديد
3. تحديث المكونات المستهلكة (Canvas, Nodelayout)

**النتيجة**: استبدال BehaviorSubject بـ Signals

---

### المرحلة 3️⃣: تفكيك CanvasComponent (3-4 أيام)

#### الخطوات:
1. إنشاء `CanvasFieldsManagerService`
2. إنشاء `CanvasImportExportService`
3. إنشاء مكونات UI فرعية (Toolbar, FieldList)
4. تبسيط `canvas.component.ts`

**النتيجة**: تقليل من 612 إلى ~150 سطر

---

### المرحلة 4️⃣: تحسين Type Safety (2-3 أيام)

#### الخطوات:
1. توسيع `FieldType` لتشمل جميع الأنواع
2. إزالة `as any` من جميع الملفات
3. إضافة Type Guards
4. تحسين Types في SchemaSerializer

**النتيجة**: إزالة كاملة لـ `any`

---

### المرحلة 5️⃣: فصل Style Transformation (يومان)

#### الخطوات:
1. إنشاء `StyleTransformerService`
2. نقل منطق التحويل من SchemaSerializer
3. تبسيط SchemaSerializer

**النتيجة**: تقليل SchemaSerializer من 411 إلى ~200 سطر

---

### المرحلة 6️⃣: إضافة localStorage (نصف يوم)

#### الخطوات:
1. إضافة دوال save/load في `BuilderPreferencesService`
2. تحميل التفضيلات عند بدء التطبيق

**النتيجة**: حفظ تفضيلات المستخدم

---

## 📊 جدول زمني

| المرحلة | المدة | الأولوية |
|---------|-------|----------|
| 1️⃣ تنظيف التكرار | 1 يوم | 🔴 عالية |
| 2️⃣ FormSchemaStore | 2 يوم | 🔴 عالية |
| 3️⃣ تفكيك Canvas | 4 أيام | 🟡 متوسطة |
| 4️⃣ Type Safety | 3 أيام | 🟡 متوسطة |
| 5️⃣ Style Transformer | 2 يوم | 🟢 منخفضة |
| 6️⃣ localStorage | 0.5 يوم | 🟢 منخفضة |

**إجمالي**: 12.5 يوم عمل (~2.5 أسبوع)

---

## ✅ Checklist

### قبل البدء
- [ ] عمل backup للمشروع
- [ ] إنشاء branch: `refactor/project-restructure`
- [ ] التأكد من عمل جميع Features

### أثناء التنفيذ
- [ ] Commit بعد كل مرحلة
- [ ] اختبار Features بعد كل تغيير
- [ ] تحديث التوثيق

### بعد الانتهاء
- [ ] اختبار شامل
- [ ] قياس الأداء
- [ ] تحديث README
- [ ] Merge إلى main

---

## 🎯 المقاييس المستهدفة

**قبل**:
- canvas.component: 612 سطر
- schema-serializer: 411 سطر
- عدد `as any`: ~25

**بعد**:
- canvas.component: ~150 سطر (-75%)
- schema-serializer: ~200 سطر (-51%)
- عدد `as any`: 0 (-100%)
