# Bootstrap Vue to Tailwind CSS Migration Guide

**Project**: FEM - QL Chi Tiêu
**Date**: December 24, 2025
**Status**: ✅ COMPLETED - January 14, 2026

---

## Migration Progress

### ✅ ALL COMPONENTS MIGRATED (97 files)

**Migration completed successfully on January 14, 2026**

All Vue components in `src/views/` have been migrated from Bootstrap Vue to Tailwind CSS.

- ✅ 70+ files with Bootstrap Vue components migrated
- ✅ 0 remaining `<b-*>` tags
- ✅ 0 remaining `$bvModal` or `$bvToast` references
- ✅ All modals converted to Tailwind CSS
- ✅ All forms converted to standard HTML with Tailwind classes

For detailed migration report, see: [BOOTSTRAP_TO_TAILWIND_MIGRATION_COMPLETE.md](../BOOTSTRAP_TO_TAILWIND_MIGRATION_COMPLETE.md)

### Previously Completed Components (5)
1. ✅ `src/views/admin/over_view/OverView.vue` - Dashboard with Google Charts
2. ✅ `src/views/staff/StaffLogin.vue` - Login page
3. ✅ `src/views/staff/StaffChangePass.vue` - Password change
4. ✅ `src/components/common/AppHeader.vue` - Header component
5. ✅ `src/App.vue` - Root component with sidebar

### ✅ COMPLETED - All Remaining Components (92 files)

#### Admin Module Components:
- `src/views/admin/income/IncomeList.vue`
- `src/views/admin/income/IncomeIndex.vue`
- `src/views/admin/income/IncomeDetail.vue`
- `src/views/admin/expend/ExpendList.vue`
- `src/views/admin/expend/ExpendIndex.vue`
- `src/views/admin/income_group/IncomeGroupList.vue`
- `src/views/admin/income_group/IncomeGroupIndex.vue`
- `src/views/admin/expend_group/ExpendGroupList.vue`
- `src/views/admin/expend_group/ExpendGroupIndex.vue`
- `src/views/admin/ie_book/IEBookList.vue`
- `src/views/admin/ie_book/IEBookIndex.vue`
- `src/views/admin/fund/FundReport.vue`
- `src/views/admin/role/RoleList.vue`
- `src/views/admin/role/RoleIndex.vue`
- `src/views/admin/staff/List.vue`
- `src/views/admin/staff/Index.vue`
- `src/views/admin/statistic/Statistic.vue`

#### Super Admin Components:
- `src/views/supperAdmin/HomeSPAdmin.vue`
- `src/views/supperAdmin/store/List.vue`
- `src/views/supperAdmin/store/Index.vue`
- `src/views/supperAdmin/storeAdmin/List.vue`
- `src/views/supperAdmin/storeAdmin/Index.vue`

#### Common Components:
- `src/views/common/contact.vue`

---

## Complete Component Mapping Reference

### Layout Components

#### 1. Grid System (b-row / b-col)

**Bootstrap Vue:**
```vue
<div>
  <b-col md="6">Column 1</b-col>
  <b-col md="6">Column 2</b-col>
</div>
```

**Tailwind CSS:**
```vue
<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
  <div class="w-full md:col-span-6">Column 1</div>
  <div class="w-full md:col-span-6">Column 2</div>
</div>
```

**Column Span Mapping:**
- `md="1"` → `md:col-span-1`
- `md="2"` → `md:col-span-2`
- `md="3"` → `md:col-span-3`
- `md="4"` → `md:col-span-4`
- `md="6"` → `md:col-span-6`
- `md="8"` → `md:col-span-8`
- `md="9"` → `md:col-span-9`
- `md="12"` → `md:col-span-12`

#### 2. Cards (b-card / b-card-body)

**Bootstrap Vue:**
```vue
<b-card>
  <b-card-body class="p-4">
    Content here
  </b-card-body>
</b-card>
```

**Tailwind CSS:**
```vue
<div class="bg-white rounded-lg shadow p-6 mb-4">
  <div class="p-4">
    Content here
  </div>
</div>
```

**Card Variants:**
- `border-variant="primary"` → `border-2 border-blue-500`
- `border-variant="danger"` → `border-2 border-red-500`
- `border-variant="warning"` → `border-2 border-yellow-500`
- `border-variant="success"` → `border-2 border-green-500`

### Form Components

#### 3. Buttons (b-button)

**Bootstrap Vue:**
```vue
<b-button variant="primary" class="px-4" @click="handleClick">
  Submit
</b-button>
```

**Tailwind CSS:**
```vue
<button class="btn btn-primary px-4 py-2" @click="handleClick">
  Submit
</button>
```

**Button Variants (using Tailwind CSS classes in our project):**
- `variant="primary"` → `btn btn-primary` (blue background)
- `variant="secondary"` → `btn btn-secondary` (gray background)
- `variant="success"` → `btn btn-success` (green background)
- `variant="danger"` → `btn btn-danger` (red background)
- `variant="warning"` → `btn btn-warning` (yellow background)
- `variant="outline-primary"` → `btn btn-outline-primary` (blue border)
- `variant="outline-success"` → `btn btn-outline-success` (green border)

#### 4. Form Elements (b-form / b-form-select)

**Bootstrap Vue:**
```vue
<b-form @submit.prevent="onSubmit">
  <b-form-select v-model="selected" :options="options"></b-form-select>
</b-form>
```

**Tailwind CSS:**
```vue
<form @submit.prevent="onSubmit">
  <select v-model="selected" class="form-control">
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.text }}
    </option>
  </select>
</form>
```

#### 5. Form Validation (b-form-invalid-feedback)

**Bootstrap Vue:**
```vue
<input v-model="name" :class="{'is-invalid': errorName}" />
<b-form-invalid-feedback :state="!errorName">
  Name is required
</b-form-invalid-feedback>
```

**Tailwind CSS:**
```vue
<input v-model="name" :class="{'border-red-500': errorName}" class="form-control" />
<div v-if="errorName" class="text-red-600 text-sm mt-1">
  Name is required
</div>
```

### Data Display Components

#### 6. Tables (b-table)

**Bootstrap Vue:**
```vue
<b-table
  striped
  hover
  :items="items"
  :fields="fields"
  :current-page="currentPage"
  :per-page="perPage"
>
  <template #cell(actions)="data">
    <button @click="edit(data.item.id)">Edit</button>
  </template>
</b-table>
```

**Tailwind CSS:**
```vue
<div class="overflow-x-auto">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th v-for="field in fields" :key="field.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          {{ field.label }}
        </th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="(item, index) in paginatedItems" :key="index"
          class="hover:bg-gray-50">
        <td v-for="field in fields" :key="field.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <span v-if="field.key !== 'actions'">{{ item[field.key] }}</span>
          <div v-else class="flex gap-2">
            <button @click="edit(item.id)" class="text-blue-600 hover:text-blue-900">
              Edit
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Pagination -->
<div class="flex justify-between items-center mt-4">
  <div>Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ items.length }} entries</div>
  <div class="flex gap-2">
    <button @click="currentPage--" :disabled="currentPage === 1"
            class="btn btn-secondary px-3 py-1">
      Previous
    </button>
    <button @click="currentPage++" :disabled="currentPage === totalPages"
            class="btn btn-secondary px-3 py-1">
      Next
    </button>
  </div>
</div>
```

**Computed properties needed:**
```javascript
computed: {
  paginatedItems() {
    const start = (this.currentPage - 1) * this.perPage
    const end = start + this.perPage
    return this.items.slice(start, end)
  },
  totalPages() {
    return Math.ceil(this.items.length / this.perPage)
  },
  startIndex() {
    return (this.currentPage - 1) * this.perPage
  },
  endIndex() {
    return Math.min(this.startIndex + this.perPage, this.items.length)
  }
}
```

#### 7. List Groups (b-list-group)

**Bootstrap Vue:**
```vue
<b-list-group horizontal>
  <b-list-group-item v-b-tooltip.hover title="Edit" @click="edit(id)">
    <i class="fa fa-edit"></i>
  </b-list-group-item>
  <b-list-group-item v-b-tooltip.hover title="Delete" @click="remove(id)">
    <i class="fa fa-trash"></i>
  </b-list-group-item>
</b-list-group>
```

**Tailwind CSS:**
```vue
<div class="flex gap-2">
  <button
    @click="edit(id)"
    class="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded"
    title="Edit">
    <i class="fa fa-edit"></i>
  </button>
  <button
    @click="remove(id)"
    class="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
    title="Delete">
    <i class="fa fa-trash"></i>
  </button>
</div>
```

### Modal Components

#### 8. Modals (b-modal)

**Bootstrap Vue:**
```vue
<b-modal
  id="modal-confirm"
  centered
  hide-footer
  hide-header
  @hide="onModalHide">
  <div>
    <b-col>
      <h5>Confirm Action</h5>
    </b-col>
  </div>
  <div>
    <b-col>
      <p>Are you sure?</p>
    </b-col>
  </div>
  <div>
    <b-col class="text-center">
      <button @click="$bvModal.hide('modal-confirm')">Cancel</button>
      <button @click="confirmAction">Confirm</button>
    </b-col>
  </div>
</b-modal>
```

**Tailwind CSS:**
```vue
<!-- In template -->
<div v-if="showConfirmModal"
     class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
     @click.self="showConfirmModal = false">
  <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
    <div class="mb-4">
      <h5 class="text-xl font-semibold">Confirm Action</h5>
    </div>
    <div class="mb-6">
      <p class="text-gray-700">Are you sure?</p>
    </div>
    <div class="flex justify-center gap-4">
      <button @click="showConfirmModal = false"
              class="btn btn-secondary px-4 py-2">
        Cancel
      </button>
      <button @click="confirmAction"
              class="btn btn-primary px-4 py-2">
        Confirm
      </button>
    </div>
  </div>
</div>
```

**In script (data):**
```javascript
data() {
  return {
    showConfirmModal: false
  }
}
```

**Show/Hide modal:**
```javascript
// Instead of: this.$bvModal.show('modal-confirm')
this.showConfirmModal = true

// Instead of: this.$bvModal.hide('modal-confirm')
this.showConfirmModal = false
```

---

## Directive Replacements

### 1. Tooltips (v-b-tooltip)

**Bootstrap Vue:**
```vue
<button v-b-tooltip.hover title="Edit record">
  <i class="fa fa-edit"></i>
</button>
```

**Tailwind CSS (Simple - just use title):**
```vue
<button title="Edit record">
  <i class="fa fa-edit"></i>
</button>
```

**Tailwind CSS (Advanced - custom tooltip):**
```vue
<button
  @mouseenter="showTooltip = true"
  @mouseleave="showTooltip = false"
  class="relative">
  <i class="fa fa-edit"></i>
  <span v-if="showTooltip"
        class="absolute bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap">
    Edit record
  </span>
</button>
```

---

## Plugin Replacements

### 1. Toast Notifications ($bvToast)

**Bootstrap Vue:**
```javascript
this.$bvToast.toast('Operation successful', {
  title: 'Success',
  variant: 'success',
  autoHideDelay: 3000
})
```

**Temporary Solution (console):**
```javascript
console.log('✅ Operation successful')
```

**Better Solution (create a composable):**

Create `src/composables/useToast.js`:
```javascript
import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

export function useToast() {
  function showToast(message, type = 'info', duration = 3000) {
    const id = nextId++
    toasts.value.push({ id, message, type })

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  function removeToast(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    showToast,
    removeToast,
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'error'),
    info: (msg) => showToast(msg, 'info'),
    warning: (msg) => showToast(msg, 'warning')
  }
}
```

**Usage:**
```javascript
import { useToast } from '@/composables/useToast'

export default {
  setup() {
    const toast = useToast()

    function saveData() {
      // ... save logic
      toast.success('Operation successful')
    }

    return { saveData }
  }
}
```

### 2. Message Box ($bvModal.msgBoxConfirm)

**Bootstrap Vue:**
```javascript
this.$bvModal.msgBoxConfirm('Are you sure?', {
  title: 'Confirm',
  okVariant: 'danger',
  okTitle: 'Yes',
  cancelTitle: 'No'
}).then(value => {
  if (value) {
    this.deleteItem()
  }
})
```

**Native JavaScript (temporary):**
```javascript
if (confirm('Are you sure?')) {
  this.deleteItem()
}
```

**Better Solution (custom modal):**
```javascript
// Use the modal pattern shown above with showConfirmModal state
this.confirmMessage = 'Are you sure?'
this.confirmCallback = () => this.deleteItem()
this.showConfirmModal = true
```

---

## Migration Checklist

For each component file, follow these steps:

### ☑️ Template Changes

1. [ ] Replace all `<div>` with `<div class="grid grid-cols-1 md:grid-cols-12 gap-4">`
2. [ ] Replace all `<b-col md="X">` with `<div class="w-full md:col-span-X">`
3. [ ] Replace all `<b-col>` (no props) with `<div class="w-full">`
4. [ ] Replace all `<b-card>` with `<div class="bg-white rounded-lg shadow p-6">`
5. [ ] Replace all `<b-card-body>` with `<div class="p-4">`
6. [ ] Replace all `<b-button>` with `<button class="btn btn-{variant}">`
7. [ ] Replace all `<b-form>` with `<form>`
8. [ ] Replace all `<b-form-select>` with `<select>` + options loop
9. [ ] Replace all `<b-form-invalid-feedback>` with `<div v-if="error" class="text-red-600 text-sm mt-1">`
10. [ ] Replace all `<b-table>` with proper HTML `<table>` structure
11. [ ] Replace all `<b-modal>` with custom modal div using fixed positioning
12. [ ] Replace all `<b-list-group>` with flex/grid containers
13. [ ] Replace all `<b-list-group-item>` with button/div elements
14. [ ] Remove all `v-b-tooltip` directives (replace with title attribute)

### ☑️ Script Changes

1. [ ] Add modal state variables (e.g., `showConfirmModal: false`)
2. [ ] Replace `this.$bvModal.show('id')` with `this.showModalName = true`
3. [ ] Replace `this.$bvModal.hide('id')` with `this.showModalName = false`
4. [ ] Replace `this.$bvToast.toast()` with `console.log()` or custom toast
5. [ ] Replace `this.$bvModal.msgBoxConfirm()` with `confirm()` or custom modal
6. [ ] Add pagination computed properties if using tables
7. [ ] Add table sorting/filtering logic if needed

### ☑️ Testing

1. [ ] Component renders without errors
2. [ ] All buttons work correctly
3. [ ] Forms submit properly
4. [ ] Modals open and close
5. [ ] Tables display data
6. [ ] Pagination works
7. [ ] Validation shows errors
8. [ ] Responsive design works on mobile

---

## Example: Complete Component Migration

### Before (Bootstrap Vue):

```vue
<template>
  <div>
    <div>
      <b-col>
        <b-card>
          <div>
            <b-col md="6">
              <b-form-select v-model="selected" :options="options"></b-form-select>
            </b-col>
            <b-col md="6">
              <b-button variant="primary" @click="submit">Submit</b-button>
            </b-col>
          </div>

          <b-table striped hover :items="items" :fields="fields">
            <template #cell(actions)="data">
              <b-button variant="outline-primary" size="sm" @click="edit(data.item)">
                Edit
              </b-button>
            </template>
          </b-table>
        </b-card>
      </b-col>
    </div>

    <b-modal id="modal-edit" title="Edit Item" @ok="save">
      <b-form>
        <b-form-group label="Name">
          <input v-model="editItem.name" class="form-control" />
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: null,
      options: [{value: 1, text: 'One'}],
      items: [],
      fields: ['id', 'name', 'actions'],
      editItem: {}
    }
  },
  methods: {
    submit() {
      this.$bvToast.toast('Submitted!', { variant: 'success' })
    },
    edit(item) {
      this.editItem = {...item}
      this.$bvModal.show('modal-edit')
    },
    save() {
      // Save logic
      this.$bvToast.toast('Saved!', { variant: 'success' })
    }
  }
}
</script>
```

### After (Tailwind CSS):

```vue
<template>
  <div>
    <div class="grid grid-cols-1 gap-4">
      <div class="w-full">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div class="w-full md:col-span-6">
              <select v-model="selected" class="form-control">
                <option v-for="opt in options" :key="opt.value" :value="opt.value">
                  {{ opt.text }}
                </option>
              </select>
            </div>
            <div class="w-full md:col-span-6">
              <button class="btn btn-primary px-4 py-2" @click="submit">
                Submit
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm">{{ item.id }}</td>
                  <td class="px-6 py-4 text-sm">{{ item.name }}</td>
                  <td class="px-6 py-4 text-sm">
                    <button class="btn btn-outline-primary px-3 py-1" @click="edit(item)">
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showEditModal"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         @click.self="showEditModal = false">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-semibold mb-4">Edit Item</h3>
        <form @submit.prevent="save">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input v-model="editItem.name" class="form-control" />
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="showEditModal = false" class="btn btn-secondary px-4 py-2">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary px-4 py-2">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: null,
      options: [{value: 1, text: 'One'}],
      items: [],
      editItem: {},
      showEditModal: false
    }
  },
  methods: {
    submit() {
      console.log('✅ Submitted!', this.selected)
    },
    edit(item) {
      this.editItem = {...item}
      this.showEditModal = true
    },
    save() {
      // Save logic
      console.log('✅ Saved!', this.editItem)
      this.showEditModal = false
    }
  }
}
</script>
```

---

## Quick Reference Card

### Common Patterns

| Bootstrap Vue | Tailwind CSS |
|--------------|--------------|
| `<div>` | `<div class="grid grid-cols-1 md:grid-cols-12 gap-4">` |
| `<b-col md="6">` | `<div class="w-full md:col-span-6">` |
| `<b-card>` | `<div class="bg-white rounded-lg shadow p-6">` |
| `<b-button variant="primary">` | `<button class="btn btn-primary">` |
| `<b-form-select>` | `<select>` |
| `v-b-tooltip.hover` | `title="..."` |
| `$bvToast.toast()` | `console.log()` or custom toast |
| `$bvModal.show()` | `this.showModal = true` |

---

## Tips & Best Practices

1. **Keep Options API**: Don't convert to Composition API during this migration to avoid too many changes at once
2. **Test Incrementally**: Migrate and test one component at a time
3. **Use Version Control**: Commit after each successful component migration
4. **Maintain Functionality**: Focus on visual migration first, keep all logic identical
5. **Responsive Design**: Test on mobile after each migration
6. **Reusable Components**: Consider creating shared components for repeated patterns (tables, modals, forms)

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Grid System Reference](https://tailwindcss.com/docs/grid-template-columns)
- [Flexbox Reference](https://tailwindcss.com/docs/flex)
