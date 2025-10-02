# JSON Schema Structure - Required vs Optional

## ✅ **Minimum Required** (الأساسي فقط)

```json
{
  "controls": [
    {
      "data": {
        "formControlName": "name",
        "fieldType": "input-text",
        "label": "Name"
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    }
  ]
}
```

**هذا كل ما تحتاجه للعمل! 🎉**

---

## 🎨 **With Optional Enhancements**

### 1. **Basic Form** (بدون enhancements)
```json
{
  "data": {
    "formControlName": "email",
    "fieldType": "input-text",
    "label": "Email",
    "placeholder": "Enter email",
    "required": true
  },
  "style": {
    "columns": 2,
    "width": "100%"
  }
}
```
✅ **يشتغل تمام - بدون أي إضافات!**

---

### 2. **With UI Enhancements** (إضافة مظهر فقط)
```json
{
  "data": {
    "formControlName": "email",
    "fieldType": "input-text",
    "label": "Email",
    "placeholder": "Enter email",
    "required": true,
    
    "uiConfig": {
      "icon": "pi pi-envelope",
      "helpText": "We'll never share your email"
    }
  },
  "style": {
    "columns": 2,
    "width": "100%"
  }
}
```
✅ **Optional - يحسن الشكل فقط**

---

### 3. **With Computed Field** (حسابات تلقائية)
```json
{
  "data": {
    "formControlName": "total",
    "fieldType": "input-number",
    "label": "Total",
    "readonly": true,
    
    "computed": {
      "formula": "price * quantity",
      "dependencies": ["price", "quantity"]
    }
  },
  "style": {
    "columns": 2,
    "width": "100%"
  }
}
```
✅ **Optional - للحسابات التلقائية فقط**

---

### 4. **With Advanced Validations** (validation محسّن)
```json
{
  "data": {
    "formControlName": "email",
    "fieldType": "input-text",
    "label": "Email",
    
    "validations": {
      "required": {
        "value": true,
        "message": "Email is required"
      },
      "email": {
        "value": true,
        "message": "Invalid email format"
      }
    }
  },
  "style": {
    "columns": 2,
    "width": "100%"
  }
}
```
✅ **Optional - للرسائل المخصصة**

---

## 🎯 **Field Properties - Required vs Optional**

| Property | Required | Optional | Description |
|----------|----------|----------|-------------|
| **formControlName** | ✅ | | اسم الـ field (مطلوب) |
| **fieldType** | ✅ | | نوع الـ field (مطلوب) |
| **label** | ✅ | | عنوان الـ field (مطلوب) |
| **columns** | ✅ | | عدد الأعمدة (مطلوب) |
| **placeholder** | | ✅ | نص توضيحي |
| **value** | | ✅ | قيمة افتراضية |
| **required** | | ✅ | هل مطلوب؟ |
| **disabled** | | ✅ | هل معطل؟ |
| **readonly** | | ✅ | للقراءة فقط؟ |
| **uiConfig** | | ✅ | تخصيص المظهر |
| **computed** | | ✅ | حسابات تلقائية |
| **validations** | | ✅ | validation محسّن |
| **conditionalLogic** | | ✅ | إخفاء/إظهار |
| **dataSourceConfig** | | ✅ | ربط بـ API |
| **permissions** | | ✅ | صلاحيات |
| **events** | | ✅ | أحداث مخصصة |
| **cssClasses** | | ✅ | CSS classes |

---

## 📝 **Examples by Use Case**

### ✅ **Simple Form** (للاستخدام العادي)
```json
{
  "controls": [
    {
      "data": {
        "formControlName": "firstName",
        "fieldType": "input-text",
        "label": "First Name",
        "placeholder": "Enter first name",
        "required": true
      },
      "style": {"columns": 2, "width": "100%"}
    },
    {
      "data": {
        "formControlName": "email",
        "fieldType": "input-text",
        "label": "Email",
        "placeholder": "Enter email"
      },
      "style": {"columns": 2, "width": "100%"}
    }
  ]
}
```
**بسيط ويشتغل تمام! ✅**

---

### 🎨 **Enhanced Form** (مع تحسينات)
```json
{
  "controls": [
    {
      "data": {
        "formControlName": "firstName",
        "fieldType": "input-text",
        "label": "First Name",
        "placeholder": "Enter first name",
        "required": true,
        
        "uiConfig": {
          "icon": "pi pi-user",
          "iconPosition": "left",
          "helpText": "Your legal first name"
        },
        
        "validations": {
          "required": {
            "value": true,
            "message": "First name is required"
          },
          "minLength": {
            "value": 2,
            "message": "Name must be at least 2 characters"
          }
        }
      },
      "style": {"columns": 2, "width": "100%"}
    }
  ]
}
```
**مع enhancements - لكن اختياري! ✅**

---

### 🧮 **Form with Calculations** (حسابات)
```json
{
  "controls": [
    {
      "data": {
        "formControlName": "price",
        "fieldType": "input-number",
        "label": "Price",
        "value": 0
      },
      "style": {"columns": 2, "width": "100%"}
    },
    {
      "data": {
        "formControlName": "quantity",
        "fieldType": "input-number",
        "label": "Quantity",
        "value": 0
      },
      "style": {"columns": 2, "width": "100%"}
    },
    {
      "data": {
        "formControlName": "total",
        "fieldType": "input-number",
        "label": "Total",
        "readonly": true,
        
        "computed": {
          "formula": "price * quantity",
          "dependencies": ["price", "quantity"],
          "format": "currency"
        }
      },
      "style": {"columns": 2, "width": "100%"}
    }
  ]
}
```
**استخدم `computed` فقط للحقول المحسوبة! ✅**

---

## 🎯 **Best Practices**

### ✅ **DO:**
- استخدم الـ minimum required فقط للـ forms البسيطة
- أضف enhancements حسب الحاجة
- `uiConfig` للمظهر فقط
- `computed` للحسابات فقط
- `validations` للرسائل المخصصة

### ❌ **DON'T:**
- تضيف كل الـ properties في كل field
- تستخدم `computed` للحقول العادية
- تضيف `uiConfig` إذا مش محتاجه
- تعقد الـ JSON بدون سبب

---

## 📦 **JSON Size Comparison**

### Basic Form (100 fields):
```
Size: ~15 KB
Load Time: <50ms
```

### Enhanced Form (100 fields with all features):
```
Size: ~45 KB
Load Time: <150ms
```

**النصيحة:** استخدم الـ enhancements بحكمة! 🎯

---

## 🚀 **Quick Reference**

| Feature | When to Use | Example |
|---------|-------------|---------|
| **Basic** | Always | `formControlName`, `fieldType`, `label` |
| **uiConfig** | Better UX | Icons, help text, counters |
| **computed** | Calculations | Total, subtotal, tax |
| **validations** | Custom errors | Better user messages |
| **conditionalLogic** | Show/hide fields | Based on other fields |
| **dataSourceConfig** | Dynamic data | Load from API |
| **permissions** | Access control | Role-based fields |

---

## ✅ **Summary**

**الـ Minimum:**
```json
{
  "formControlName": "name",
  "fieldType": "input-text",
  "label": "Name"
}
```

**الـ Maximum (كل شيء):**
```json
{
  "formControlName": "name",
  "fieldType": "input-text",
  "label": "Name",
  "placeholder": "...",
  "uiConfig": {...},
  "computed": {...},
  "validations": {...},
  "conditionalLogic": [...],
  "dataSourceConfig": {...},
  "permissions": {...},
  "events": {...},
  "cssClasses": {...}
}
```

**أنت تختار حسب احتياجك! 🎯**
