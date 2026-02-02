# Toast Notification System - vue-toastification

## Overview

The project uses `vue-toastification@next` for displaying toast notifications in Vue 3. This replaces the old Bootstrap Vue `$bvToast` system.

## Installation

Already installed in the project:
```bash
npm install vue-toastification@next
```

## Configuration

The toast plugin is configured in `src/main.js`:

```javascript
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 3,
  newestOnTop: true,
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
})
```

## Usage

### Method 1: Using Composable (Composition API)

```vue
<script setup>
import { useToastNotification } from '@/composables/useToast'

const { popToast } = useToastNotification()

function handleSuccess() {
  popToast('success', 'Operation completed successfully!')
}

function handleError() {
  popToast('danger', 'An error occurred!')
}
</script>
```

### Method 2: Using $toast (Options API)

```vue
<script>
import { useToast } from 'vue-toastification'

export default {
  data() {
    return {
      // ...
    }
  },
  mounted() {
    this.toast = useToast()
  },
  methods: {
    popToast(variant, content) {
      switch(variant) {
        case 'success': this.toast.success(content); break;
        case 'danger': this.toast.error(content); break;
        case 'warning': this.toast.warning(content); break;
        default: this.toast.info(content);
      }
    },
    
    handleSave() {
      // Your save logic
      this.popToast('success', 'Data saved successfully!')
    }
  }
}
</script>
```

### Method 3: Direct $toast Access

After the plugin is registered, you can also use `this.$toast` directly:

```javascript
export default {
  methods: {
    showSuccess() {
      this.$toast.success('Success message!')
    },
    showError() {
      this.$toast.error('Error message!')
    },
    showWarning() {
      this.$toast.warning('Warning message!')
    },
    showInfo() {
      this.$toast.info('Info message!')
    }
  }
}
```

## Migration from Bootstrap Vue

### Old Pattern (Bootstrap Vue):
```javascript
popToast(variant, content) {
  this.$bvToast.toast(content, {
    toastClass: 'my-toast',
    noCloseButton: true,
    variant: variant,
    autoHideDelay: 3000
  })
}
```

### New Pattern (vue-toastification):
```javascript
import { useToast } from 'vue-toastification'

export default {
  mounted() {
    this.toast = useToast()
  },
  methods: {
    popToast(variant, content) {
      switch(variant) {
        case 'success': this.toast.success(content); break;
        case 'danger': this.toast.error(content); break;
        case 'warning': this.toast.warning(content); break;
        default: this.toast.info(content);
      }
    }
  }
}
```

## Toast Types

| Bootstrap Vue Variant | vue-toastification Method | Visual Style |
|-----------------------|---------------------------|--------------|
| `success`             | `toast.success()`         | Green ✓      |
| `danger` / `error`    | `toast.error()`           | Red ✗        |
| `warning`             | `toast.warning()`         | Yellow ⚠     |
| `info` / `default`    | `toast.info()`            | Blue ℹ       |

## Advanced Usage

### Custom Duration

```javascript
this.$toast.success('Message', {
  timeout: 5000 // 5 seconds
})
```

### With Callback

```javascript
this.$toast.success('Item deleted', {
  onClose: () => {
    console.log('Toast closed')
  }
})
```

### Custom Position

```javascript
this.$toast.info('Bottom center message', {
  position: 'bottom-center'
})
```

Available positions:
- `top-right` (default)
- `top-left`
- `top-center`
- `bottom-right`
- `bottom-left`
- `bottom-center`

### Dismiss Programmatically

```javascript
const toastId = this.$toast.info('Processing...')

// Later...
this.$toast.dismiss(toastId)
```

### Clear All Toasts

```javascript
this.$toast.clear()
```

## Styling

The default styles are imported from `vue-toastification/dist/index.css`. You can customize by overriding CSS:

```css
/* In your component or global CSS */
.Vue-Toastification__toast--success {
  background-color: #28a745 !important;
}

.Vue-Toastification__toast--error {
  background-color: #dc3545 !important;
}
```

## Examples from Migrated Components

### Example 1: Form Validation (storeAdmin/Index.vue)

```javascript
save() {
  if (this.checkValidate()) {
    superAdminAPI.addAdminStore(this.adminStore).then(res => {
      if (res.data.status == 200) {
        this.popToast('success', 'Thêm thành công')
        this.$router.push("/admin-store/list")
      }
    }).catch(err => {
      let errorMess = commonFunc.handleStaffError(err)
      this.popToast('danger', errorMess)
    })
  }
}
```

### Example 2: Delete Confirmation (store/List.vue)

```javascript
deleted(store) {
  if (confirm('Xóa [' + store.name + "]. Bạn có chắc không?")) {
    superAdminAPI.deleteStore(store.id).then(res => {
      this.popToast('success', 'Xóa thành công')
      this.prepareToSearch()
    }).catch(err => {
      let errorMess = commonFunc.handleStaffError(err)
      this.popToast('danger', errorMess)
    })
  }
}
```

### Example 3: API Error Handling (IncomeList.vue)

```javascript
getOptionsRelated() {
  incomeApi.getOptionRelatedIncome(params).then(res => {
    if(res && res.data && res.data.data) {
      this.optionsIncomeGroup = res.data.data.income_groups
    }
  }).catch(err => {
    let errorMess = commonFunc.handleStaffError(err)
    this.popToast('danger', errorMess)
  })
}
```

## Troubleshooting

### Toast not showing

1. **Check plugin is registered** in `main.js`:
   ```javascript
   import Toast from 'vue-toastification'
   app.use(Toast)
   ```

2. **Check CSS is imported**:
   ```javascript
   import 'vue-toastification/dist/index.css'
   ```

3. **For Options API, initialize in mounted**:
   ```javascript
   mounted() {
     this.toast = useToast()
   }
   ```

### TypeScript errors

If using TypeScript, install types:
```bash
npm install -D @types/vue-toastification
```

### Multiple toasts stacking

Limit maximum toasts in configuration:
```javascript
app.use(Toast, {
  maxToasts: 3,
  newestOnTop: true
})
```

## Resources

- [vue-toastification Documentation](https://vue-toastification.maronato.dev/)
- [GitHub Repository](https://github.com/Maronato/vue-toastification)
- [Migration Guide](./VUE2_TO_VUE3_MIGRATION_GUIDE.md)

---

**Last Updated**: December 25, 2025
**Project**: FEM_WEB_BK Vue 3 Toast Notifications
