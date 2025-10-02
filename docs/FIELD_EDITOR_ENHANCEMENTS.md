# Field Editor Enhancements

## 🎨 **New Tabs in Field Editor**

سنضيف Tabs جديدة في الـ Field Editor لتسهيل إضافة الـ Enhanced Features:

### **Current Structure:**
```
┌─────────────────────────────┐
│ Field Editor Dialog         │
├─────────────────────────────┤
│ [Basic] [Style] [Validation]│
│                             │
│   (Current tabs)            │
└─────────────────────────────┘
```

### **Enhanced Structure:**
```
┌──────────────────────────────────────────────────┐
│ Field Editor Dialog                              │
├──────────────────────────────────────────────────┤
│ [Basic] [Style] [Validation] [UI] [Advanced]    │
│                                                  │
│  New tabs for enhanced features ⭐               │
└──────────────────────────────────────────────────┘
```

---

## 📝 **Tab 1: Basic** (موجود بالفعل)
```
┌─────────────────────────┐
│ Label:     [_________]  │
│ Type:      [Select▼]    │
│ Required:  [☑]          │
│ Placeholder:[_________] │
└─────────────────────────┘
```

---

## 🎨 **Tab 2: UI Customization** (جديد)
```
┌─────────────────────────────────┐
│ Icon Configuration              │
│ ├─ Icon:     [pi pi-user▼]     │
│ └─ Position: [○ Left ● Right]  │
│                                 │
│ Help & Hints                    │
│ ├─ Help Text: [____________]   │
│ └─ Tooltip:   [____________]   │
│                                 │
│ Input Decorations               │
│ ├─ Prefix:    [____________]   │
│ └─ Suffix:    [____________]   │
│                                 │
│ Character Counter               │
│ ├─ Enabled:   [☑]              │
│ ├─ Max:       [500]            │
│ └─ Show Remaining: [☑]         │
│                                 │
│ Theme Colors                    │
│ ├─ Label:     [#1e293b] 🎨    │
│ ├─ Border:    [#3b82f6] 🎨    │
│ └─ Focus:     [#2563eb] 🎨    │
└─────────────────────────────────┘
```

**Output JSON:**
```json
{
  "uiConfig": {
    "icon": "pi pi-user",
    "iconPosition": "left",
    "helpText": "Your full legal name",
    "prefix": "$",
    "suffix": "USD",
    "characterCounter": {
      "enabled": true,
      "max": 500,
      "showRemaining": true
    },
    "theme": {
      "labelColor": "#1e293b",
      "borderColor": "#3b82f6",
      "focusColor": "#2563eb"
    }
  }
}
```

---

## 🧮 **Tab 3: Computed Fields** (جديد)
```
┌─────────────────────────────────┐
│ ☑ This is a Computed Field      │
│                                 │
│ Formula:                        │
│ [quantity * price__________]   │
│                                 │
│ Dependencies:                   │
│ [☑] quantity                    │
│ [☑] price                       │
│ [ ] discount                    │
│                                 │
│ Trigger:                        │
│ [● change  ○ blur  ○ manual]   │
│                                 │
│ Format:                         │
│ [currency ▼]                    │
│ ├─ currency                     │
│ ├─ percentage                   │
│ ├─ decimal                      │
│ └─ none                         │
│                                 │
│ Read Only:  [☑]                 │
└─────────────────────────────────┘
```

**Output JSON:**
```json
{
  "computed": {
    "formula": "quantity * price",
    "dependencies": ["quantity", "price"],
    "trigger": "change",
    "format": "currency"
  },
  "readonly": true
}
```

---

## ✅ **Tab 4: Advanced Validation** (جديد)
```
┌─────────────────────────────────┐
│ Validation Rules                │
│                                 │
│ [☑] Required                    │
│     Message: [____________]     │
│                                 │
│ [☑] Email                       │
│     Message: [____________]     │
│                                 │
│ [ ] Min Length                  │
│     Value:   [____]             │
│     Message: [____________]     │
│                                 │
│ [ ] Max Length                  │
│     Value:   [____]             │
│     Message: [____________]     │
│                                 │
│ [ ] Pattern                     │
│     Regex:   [____________]     │
│     Message: [____________]     │
│                                 │
│ [ ] Custom Validator            │
│     Function:[____________]     │
│     Message: [____________]     │
│                                 │
│ ┌────────────────────────────┐ │
│ │ Async Validation          │ │
│ │ ├─ Endpoint: [_________] │ │
│ │ ├─ Method: [GET ▼]      │ │
│ │ └─ Debounce: [500] ms   │ │
│ └────────────────────────────┘ │
└─────────────────────────────────┘
```

**Output JSON:**
```json
{
  "validations": {
    "required": {
      "value": true,
      "message": "This field is required"
    },
    "email": {
      "value": true,
      "message": "Please enter a valid email"
    },
    "minLength": {
      "value": 5,
      "message": "Must be at least 5 characters"
    },
    "async": {
      "endpoint": "/api/validate-email",
      "method": "GET",
      "debounce": 500
    }
  }
}
```

---

## 🔀 **Tab 5: Conditional Logic** (جديد)
```
┌─────────────────────────────────┐
│ Show/Hide Conditions            │
│                                 │
│ [+ Add Condition]               │
│                                 │
│ Condition #1:                   │
│ ┌────────────────────────────┐ │
│ │ When:   [country ▼]       │ │
│ │ Is:     [equals ▼]        │ │
│ │ Value:  [USA_________]    │ │
│ │                           │ │
│ │ Then:   [show ▼]          │ │
│ │ Fields: [☑] state         │ │
│ │         [☑] zipCode       │ │
│ │         [ ] province      │ │
│ │                           │ │
│ │ [Remove] [Duplicate]      │ │
│ └────────────────────────────┘ │
│                                 │
│ Operators:                      │
│ • equals                        │
│ • notEquals                     │
│ • contains                      │
│ • greaterThan                   │
│ • lessThan                      │
│ • isEmpty                       │
│ • isNotEmpty                    │
└─────────────────────────────────┘
```

**Output JSON:**
```json
{
  "conditionalLogic": [
    {
      "condition": {
        "field": "country",
        "operator": "equals",
        "value": "USA"
      },
      "action": "show",
      "targetFields": ["state", "zipCode"]
    }
  ]
}
```

---

## 🌐 **Tab 6: Data Source** (جديد)
```
┌─────────────────────────────────┐
│ Data Source Configuration       │
│                                 │
│ Type: [● API  ○ Static]         │
│                                 │
│ API Configuration:              │
│ ├─ Endpoint:  [____________]   │
│ ├─ Method:    [GET ▼]          │
│ ├─ Value:     [id__________]   │
│ └─ Label:     [name________]   │
│                                 │
│ Caching:                        │
│ ├─ Enabled:   [☑]              │
│ └─ Duration:  [3600] seconds   │
│                                 │
│ Headers:                        │
│ ┌────────────────────────────┐ │
│ │ Authorization: Bearer ...  │ │
│ │ [+ Add Header]             │ │
│ └────────────────────────────┘ │
│                                 │
│ Transform (JSONPath):           │
│ [data.countries____________]   │
│                                 │
│ [Test Connection]               │
└─────────────────────────────────┘
```

**Output JSON:**
```json
{
  "dataSourceConfig": {
    "type": "api",
    "endpoint": "/api/countries",
    "method": "GET",
    "valueField": "id",
    "labelField": "name",
    "cache": true,
    "cacheDuration": 3600,
    "headers": {
      "Authorization": "Bearer ${token}"
    },
    "transform": "data.countries"
  }
}
```

---

## 🎯 **Tab 7: CSS & Classes** (جديد)
```
┌─────────────────────────────────┐
│ Custom CSS Classes              │
│                                 │
│ Container:                      │
│ [custom-field highlight____]   │
│                                 │
│ Label:                          │
│ [font-bold text-primary____]   │
│                                 │
│ Input:                          │
│ [rounded-lg shadow-sm______]   │
│                                 │
│ Error:                          │
│ [text-red-500 text-xs______]   │
│                                 │
│ Help Text:                      │
│ [text-gray-500 text-sm_____]   │
│                                 │
│ [Preview Classes]               │
└─────────────────────────────────┘
```

**Output JSON:**
```json
{
  "cssClasses": {
    "container": "custom-field highlight",
    "label": "font-bold text-primary",
    "input": "rounded-lg shadow-sm",
    "error": "text-red-500 text-xs",
    "helpText": "text-gray-500 text-sm"
  }
}
```

---

## 🔒 **Tab 8: Permissions** (جديد)
```
┌─────────────────────────────────┐
│ Field Permissions               │
│                                 │
│ Who can VIEW this field?        │
│ [☑] admin                       │
│ [☑] manager                     │
│ [☑] user                        │
│ [ ] guest                       │
│                                 │
│ Who can EDIT this field?        │
│ [☑] admin                       │
│ [☑] manager                     │
│ [ ] user                        │
│ [ ] guest                       │
│                                 │
│ Required for roles:             │
│ [☑] admin                       │
│ [ ] manager                     │
│ [ ] user                        │
│ [ ] guest                       │
└─────────────────────────────────┘
```

**Output JSON:**
```json
{
  "permissions": {
    "view": ["admin", "manager", "user"],
    "edit": ["admin", "manager"],
    "required": ["admin"]
  }
}
```

---

## 📱 **Tab 9: Events** (جديد)
```
┌─────────────────────────────────┐
│ Field Events                    │
│                                 │
│ onChange:                       │
│ [validateEmail______________]  │
│ Debounce: [300] ms             │
│                                 │
│ onBlur:                         │
│ [checkDuplicate_____________]  │
│                                 │
│ onFocus:                        │
│ [showTooltip________________]  │
│                                 │
│ Available Functions:            │
│ • validateEmail                 │
│ • checkDuplicate                │
│ • showTooltip                   │
│ • calculateTotal                │
│ • fetchData                     │
│                                 │
│ [+ Add Custom Event]            │
└─────────────────────────────────┘
```

**Output JSON:**
```json
{
  "events": {
    "onChange": "validateEmail",
    "onBlur": "checkDuplicate",
    "onFocus": "showTooltip"
  }
}
```

---

## 🎯 **Complete Enhanced Field Example**

عند ملء كل الـ Tabs، الـ JSON النهائي:

```json
{
  "data": {
    "formControlName": "email",
    "fieldType": "input-text",
    "label": "Email Address",
    "placeholder": "Enter your email",
    "required": true,
    
    "uiConfig": {
      "icon": "pi pi-envelope",
      "iconPosition": "left",
      "helpText": "We'll never share your email",
      "characterCounter": {
        "enabled": true,
        "max": 100
      }
    },
    
    "validations": {
      "required": {
        "value": true,
        "message": "Email is required"
      },
      "email": {
        "value": true,
        "message": "Please enter a valid email"
      },
      "async": {
        "endpoint": "/api/validate-email",
        "debounce": 500
      }
    },
    
    "events": {
      "onBlur": "checkDuplicate",
      "onChange": "validateEmail"
    },
    
    "cssClasses": {
      "container": "custom-email-field",
      "label": "font-bold text-blue-600"
    },
    
    "permissions": {
      "view": ["all"],
      "edit": ["admin", "user"]
    }
  },
  "style": {
    "columns": 2,
    "width": "100%"
  }
}
```

---

## ✅ **Summary**

**الطريقة:**
1. فتح Field Editor
2. التنقل بين الـ Tabs
3. ملء البيانات المطلوبة
4. الحفظ
5. الـ JSON يُنشأ تلقائياً! 🎉

**النتيجة:**
- لا داعي لكتابة JSON يدوياً
- UI سهل وواضح
- كل الـ features اختيارية
- يمكن إضافة/إزالة في أي وقت
