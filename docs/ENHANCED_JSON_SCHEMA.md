# Enhanced JSON Schema Features

## 1. **Form Metadata** 📋
```json
{
  "metadata": {
    "id": "form_123",
    "version": "1.2.0",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-20T15:45:00Z",
    "author": "admin@example.com",
    "tags": ["employee", "onboarding", "hr"],
    "description": "Employee registration form",
    "status": "published", // draft, published, archived
    "category": "HR Forms"
  }
}
```

## 2. **Conditional Logic** 🔀
```json
{
  "formControlName": "maritalStatus",
  "fieldType": "select",
  "label": "Marital Status",
  "options": [
    {"label": "Single", "value": "single"},
    {"label": "Married", "value": "married"}
  ],
  "conditionalFields": [
    {
      "condition": {
        "field": "maritalStatus",
        "operator": "equals",
        "value": "married"
      },
      "action": "show",
      "targetFields": ["spouseName", "numberOfChildren"]
    }
  ]
}
```

## 3. **Advanced Validations** ✅
```json
{
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
    },
    "custom": {
      "pattern": "^[a-zA-Z0-9._%+-]+@company\\.com$",
      "message": "Must be a company email"
    },
    "async": {
      "endpoint": "/api/validate-email",
      "debounce": 500
    }
  }
}
```

## 4. **Data Sources / API Integration** 🌐
```json
{
  "formControlName": "country",
  "fieldType": "select",
  "label": "Country",
  "dataSource": {
    "type": "api",
    "endpoint": "/api/countries",
    "method": "GET",
    "valueField": "code",
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

## 5. **Field Dependencies** 🔗
```json
{
  "formControlName": "city",
  "fieldType": "select",
  "label": "City",
  "dependencies": {
    "dependsOn": "country",
    "dataSource": {
      "endpoint": "/api/cities/${country}",
      "trigger": "change"
    }
  }
}
```

## 6. **Permissions & Access Control** 🔒
```json
{
  "formControlName": "salary",
  "fieldType": "input-number",
  "label": "Salary",
  "permissions": {
    "view": ["admin", "hr", "manager"],
    "edit": ["admin", "hr"],
    "required": ["admin"]
  }
}
```

## 7. **UI Customization** 🎨
```json
{
  "formControlName": "bio",
  "fieldType": "textarea",
  "label": "Biography",
  "uiConfig": {
    "icon": "pi pi-user",
    "iconPosition": "left",
    "helpText": "Brief description about yourself",
    "placeholder": "Enter your bio...",
    "prefix": "",
    "suffix": "characters",
    "characterCounter": {
      "enabled": true,
      "max": 500
    },
    "theme": {
      "labelColor": "#1e293b",
      "borderColor": "#3b82f6",
      "focusColor": "#2563eb"
    }
  }
}
```

## 8. **Calculations / Computed Fields** 🧮
```json
{
  "formControlName": "total",
  "fieldType": "input-number",
  "label": "Total",
  "readonly": true,
  "computed": {
    "formula": "quantity * price",
    "dependencies": ["quantity", "price"],
    "trigger": "change"
  }
}
```

## 9. **File Upload Configuration** 📁
```json
{
  "formControlName": "documents",
  "fieldType": "file-upload",
  "label": "Upload Documents",
  "fileConfig": {
    "accept": ".pdf,.docx,.jpg",
    "maxSize": 5242880, // 5MB in bytes
    "maxFiles": 3,
    "uploadEndpoint": "/api/upload",
    "autoUpload": true,
    "preview": true,
    "validation": {
      "imageOnly": false,
      "minDimensions": {"width": 800, "height": 600}
    }
  }
}
```

## 10. **Localization (i18n)** 🌍
```json
{
  "formControlName": "name",
  "fieldType": "input-text",
  "label": {
    "en": "Full Name",
    "ar": "الاسم الكامل",
    "fr": "Nom complet"
  },
  "placeholder": {
    "en": "Enter your full name",
    "ar": "أدخل اسمك الكامل",
    "fr": "Entrez votre nom complet"
  },
  "errorMessages": {
    "required": {
      "en": "Name is required",
      "ar": "الاسم مطلوب",
      "fr": "Le nom est requis"
    }
  }
}
```

## 11. **Form Actions & Buttons** 🔘
```json
{
  "actions": [
    {
      "type": "submit",
      "label": "Save",
      "icon": "pi pi-check",
      "styleClass": "p-button-success",
      "endpoint": "/api/forms/save",
      "method": "POST",
      "confirmMessage": "Are you sure you want to save?",
      "successMessage": "Form saved successfully!",
      "redirectUrl": "/forms/list"
    },
    {
      "type": "custom",
      "label": "Export PDF",
      "icon": "pi pi-file-pdf",
      "action": "exportToPdf",
      "parameters": {
        "template": "invoice",
        "orientation": "portrait"
      }
    }
  ]
}
```

## 12. **Workflow / Multi-Step Forms** 🚶
```json
{
  "workflow": {
    "enabled": true,
    "steps": [
      {
        "id": "personal",
        "label": "Personal Info",
        "icon": "pi pi-user",
        "fields": ["firstName", "lastName", "email"]
      },
      {
        "id": "address",
        "label": "Address",
        "icon": "pi pi-map-marker",
        "fields": ["street", "city", "country"]
      },
      {
        "id": "payment",
        "label": "Payment",
        "icon": "pi pi-credit-card",
        "fields": ["cardNumber", "expiryDate", "cvv"]
      }
    ],
    "navigation": {
      "showStepNumbers": true,
      "allowBack": true,
      "validateOnNext": true
    }
  }
}
```

## 13. **Events & Hooks** ⚡
```json
{
  "formControlName": "email",
  "fieldType": "input-text",
  "events": {
    "onChange": {
      "action": "validateEmail",
      "debounce": 300
    },
    "onBlur": {
      "action": "checkDuplicate"
    },
    "onFocus": {
      "action": "showTooltip"
    }
  },
  "hooks": {
    "beforeSubmit": "validateAllFields",
    "afterSubmit": "sendEmail",
    "onError": "logError"
  }
}
```

## 14. **Field Groups & Sections** 📦
```json
{
  "sections": [
    {
      "id": "personal",
      "title": "Personal Information",
      "description": "Please provide your personal details",
      "icon": "pi pi-user",
      "collapsible": true,
      "collapsed": false,
      "fields": ["firstName", "lastName", "dob"]
    },
    {
      "id": "contact",
      "title": "Contact Information",
      "icon": "pi pi-phone",
      "fields": ["email", "phone", "address"]
    }
  ]
}
```

## 15. **Form Templates & Presets** 📋
```json
{
  "templates": {
    "contact": {
      "name": "Contact Form",
      "description": "Standard contact form template",
      "fields": [
        {"formControlName": "name", "fieldType": "input-text"},
        {"formControlName": "email", "fieldType": "input-text"},
        {"formControlName": "message", "fieldType": "textarea"}
      ]
    }
  }
}
```

## 16. **Analytics & Tracking** 📊
```json
{
  "analytics": {
    "enabled": true,
    "trackSubmissions": true,
    "trackFieldInteractions": true,
    "trackCompletionTime": true,
    "customEvents": [
      {
        "event": "fieldFocus",
        "fields": ["email", "phone"]
      }
    ]
  }
}
```

## 17. **Backup & History** 💾
```json
{
  "backup": {
    "enabled": true,
    "autoSave": true,
    "interval": 30000, // 30 seconds
    "maxVersions": 10,
    "restorePoints": true
  }
}
```

## 18. **Custom CSS Classes** 🎨
```json
{
  "formControlName": "title",
  "fieldType": "input-text",
  "cssClasses": {
    "container": "custom-container highlight-field",
    "label": "font-bold text-primary",
    "input": "rounded-lg shadow-sm",
    "error": "text-red-500 text-xs"
  }
}
```

---

## 📝 Full Example

```json
{
  "metadata": {
    "id": "employee_form_v2",
    "version": "2.0.0",
    "title": "Employee Registration",
    "description": "Complete employee onboarding form",
    "createdAt": "2025-01-01T00:00:00Z",
    "status": "published"
  },
  "workflow": {
    "enabled": true,
    "steps": [
      {"id": "personal", "label": "Personal Info"},
      {"id": "employment", "label": "Employment Details"}
    ]
  },
  "pages": [
    {
      "pageName": "Personal Information",
      "groups": {
        "basic": [
          {
            "controls": [
              {
                "data": {
                  "formControlName": "email",
                  "fieldType": "input-text",
                  "label": {
                    "en": "Email Address",
                    "ar": "البريد الإلكتروني"
                  },
                  "validations": {
                    "required": true,
                    "email": true,
                    "async": {
                      "endpoint": "/api/validate-email"
                    }
                  },
                  "permissions": {
                    "view": ["all"],
                    "edit": ["admin", "hr"]
                  },
                  "events": {
                    "onChange": "validateEmail",
                    "onBlur": "checkDuplicate"
                  }
                },
                "conditionalFields": [
                  {
                    "condition": {
                      "field": "employeeType",
                      "operator": "equals",
                      "value": "contractor"
                    },
                    "action": "show",
                    "targetFields": ["contractEndDate"]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  ],
  "actions": [
    {
      "type": "submit",
      "label": "Save Employee",
      "endpoint": "/api/employees",
      "method": "POST",
      "successMessage": "Employee saved successfully!"
    }
  ],
  "analytics": {
    "enabled": true,
    "trackSubmissions": true
  }
}
```
