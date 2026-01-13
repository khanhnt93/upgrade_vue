<template>
  <aside class="custom-sidebar" :class="{ 'collapsed': collapsed, 'hidden': !visible }" :style="{ width: width }">
    <div class="sidebar-content">
      <nav class="sidebar-nav">
        <ul class="sidebar-menu">
          <template v-for="item in menu" :key="item.href || item.title">
            <li v-if="item.header" class="sidebar-header">
              {{ item.title }}
            </li>
            <li v-else class="sidebar-item" :class="{ 'has-children': item.child }">
              <!-- Item without children -->
              <router-link
                v-if="!item.child"
                :to="item.href"
                class="sidebar-link"
                :class="{ 'active': isActive(item.href) }"
                @click="handleMenuClick"
              >
                <i v-if="item.icon" :class="getIconClass(item.icon)" class="sidebar-icon" aria-hidden="true"></i>
                <span class="sidebar-title">{{ item.title }}</span>
              </router-link>

              <!-- Item with children -->
              <template v-else>
                <a
                  href="#"
                  class="sidebar-link"
                  :class="{ 'active': hasActiveChild(item.child), 'open': openMenus[item.title] }"
                  @click.prevent="toggleMenu(item.title)"
                >
                  <i v-if="item.icon" :class="getIconClass(item.icon)" class="sidebar-icon" aria-hidden="true"></i>
                  <span class="sidebar-title">{{ item.title }}</span>
                  <i class="fa fa-chevron-right sidebar-arrow" :class="{ 'open': openMenus[item.title] }" aria-hidden="true"></i>
                </a>
                <ul v-show="openMenus[item.title]" class="sidebar-submenu">
                  <li v-for="child in item.child" :key="child.href" class="sidebar-item">
                    <router-link
                      :to="child.href"
                      class="sidebar-link"
                      :class="{ 'active': isActive(child.href) }"
                      @click="handleMenuClick"
                    >
                      <i v-if="child.icon" :class="getIconClass(child.icon)" class="sidebar-icon" aria-hidden="true"></i>
                      <span class="sidebar-title">{{ child.title }}</span>
                    </router-link>
                  </li>
                </ul>
              </template>
            </li>
          </template>
        </ul>
      </nav>
      
      <!-- Toggle Button -->
      <div class="sidebar-toggle-wrapper">
        <button 
          class="sidebar-toggle-btn" 
          @click="$emit('toggle')"
          :title="collapsed ? 'Mở rộng menu' : 'Thu gọn menu'">
          <i :class="collapsed ? 'fa fa-chevron-right' : 'fa fa-chevron-left'" class="toggle-icon" aria-hidden="true"></i>
          <span v-if="!collapsed" class="toggle-text">Thu gọn</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  menu: {
    type: Array,
    required: true
  },
  collapsed: {
    type: Boolean,
    default: false
  },
  visible: {
    type: Boolean,
    default: true
  },
  width: {
    type: String,
    default: '250px'
  }
})

const emit = defineEmits(['toggle', 'close'])

const route = useRoute()
const openMenus = ref({})

// Get icon class - handles both object {class: 'fa fa-icon'} and string 'fa fa-icon' formats
// Also handles Font Awesome 4 to 5+ icon name mapping
const getIconClass = (icon) => {
  if (!icon) return ''
  let iconClass = ''
  if (typeof icon === 'string') {
    iconClass = icon
  } else if (typeof icon === 'object' && icon.class) {
    iconClass = icon.class
  }
  
  // Map Font Awesome 4 icons to Font Awesome 5+ icons
  const iconMap = {
    'fa-plus-square-o': 'far fa-plus-square',
    'fa-minus-square-o': 'far fa-minus-square',
    'fa-square-o': 'far fa-square',
    'fa-check-square-o': 'far fa-check-square',
    'fa-circle-o': 'far fa-circle',
    'fa-dot-circle-o': 'far fa-dot-circle',
    'fa-file-o': 'far fa-file',
    'fa-folder-o': 'far fa-folder',
    'fa-heart-o': 'far fa-heart',
    'fa-star-o': 'far fa-star'
  }
  
  // Check if icon needs mapping
  for (const [oldIcon, newIcon] of Object.entries(iconMap)) {
    if (iconClass.includes(oldIcon)) {
      iconClass = iconClass.replace(oldIcon, newIcon)
      break
    }
  }
  
  return iconClass
}

// Check if current route matches
const isActive = (href) => {
  if (!href) return false
  return route.path === href || route.path.startsWith(href + '/')
}

// Check if any child is active
const hasActiveChild = (children) => {
  if (!children) return false
  return children.some(child => isActive(child.href))
}

// Toggle submenu
const toggleMenu = (title) => {
  openMenus.value[title] = !openMenus.value[title]
}

// Handle menu click - close sidebar on mobile
const handleMenuClick = () => {
  // Check if on mobile/tablet (screen width < 992px)
  if (window.innerWidth < 992 && props.visible) {
    emit('close')
  }
}

// Auto-open menu if child is active
watch(() => route.path, () => {
  if (props.menu && Array.isArray(props.menu)) {
    props.menu.forEach(item => {
      if (item.child && hasActiveChild(item.child)) {
        openMenus.value[item.title] = true
      }
    })
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.custom-sidebar {
  position: fixed;
  top: 55px;
  left: 0;
  height: calc(100vh - 55px);
  background-color: #2f353a;
  z-index: 1000;
  transition: width 0.3s ease, transform 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  transform: translateX(0);

  &.hidden {
    transform: translateX(-100%);
  }

  &.collapsed {
    width: 60px !important;
    
    .sidebar-title {
      opacity: 0;
      visibility: hidden;
      position: absolute;
      left: 60px;
      top: 50%;
      transform: translateY(-50%);
      background-color: #2f353a;
      padding: 8px 15px;
      border-radius: 4px;
      box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
      white-space: nowrap;
      z-index: 1001;
      pointer-events: none;
      transition: opacity 0.2s ease, visibility 0.2s ease;
    }
    
    .sidebar-arrow {
      display: none !important;
    }
    
    .sidebar-submenu {
      display: none !important;
    }
    
    .sidebar-link {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px 0;
      position: relative;
      
      &:hover {
        .sidebar-title {
          opacity: 1;
          visibility: visible;
        }
      }
    }
    
    .sidebar-icon {
      margin-right: 0;
      width: 30px;
      height: 30px;
    }
    
    .has-children {
      .sidebar-link {
        padding-right: 0;
      }
    }
  }

  &:not(.collapsed) {
    transform: translateX(0);
  }
}

.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-nav {
  padding: 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-toggle-wrapper {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0;
  background-color: rgba(0, 0, 0, 0.2);
}

.sidebar-toggle-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
  gap: 10px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .toggle-icon {
    font-size: 16px;
    transition: transform 0.3s ease;
  }
  
  .toggle-text {
    font-weight: 500;
  }
}

.sidebar-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar-header {
  color: #8a8e91;
  padding: 15px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.sidebar-item {
  position: relative;

  &.has-children {
    > .sidebar-link {
      padding-right: 45px;
    }
  }
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.2s ease;
  position: relative;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.15);
    font-weight: 600;
  }

  &.open {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

.sidebar-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  font-size: 18px;
  color: #fff;
}

.sidebar-title {
  flex: 1;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.open {
    transform: translateY(-50%) rotate(90deg);
  }
}

.sidebar-submenu {
  list-style: none;
  margin: 0;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.2);

  .sidebar-link {
    padding-left: 55px;
  }
}

// Scrollbar styling
.custom-sidebar::-webkit-scrollbar {
  width: 6px;
}

.custom-sidebar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.custom-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}
</style>
