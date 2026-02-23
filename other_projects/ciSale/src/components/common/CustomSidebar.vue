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
              <template v-if="!item.child">
                <div
                  class="sidebar-parent-wrapper"
                  @mouseenter="handleParentHover(item.title)"
                  @mouseleave="handleParentLeave"
                >
                  <router-link
                    :to="item.href"
                    class="sidebar-link"
                    :class="{ 'active': isActive(item.href) }"
                    @click="handleMenuClick"
                  >
                    <span v-if="item.icon" class="sidebar-icon-box">
                      <i :class="getIconClass(item.icon)" class="sidebar-icon-inner" aria-hidden="true"></i>
                    </span>
                    <span class="sidebar-title">{{ item.title }}</span>
                  </router-link>

                  <!-- Popover for items without children (header only) -->
                  <div
                    v-show="shouldShowPopover(item.title)"
                    class="sidebar-popover"
                    @mouseenter="handleParentHover(item.title)"
                  >
                    <router-link
                      :to="item.href"
                      class="popover-header popover-header-clickable"
                      @click="handleMenuClick"
                    >
                      <span v-if="item.icon" class="sidebar-icon-box">
                        <i :class="getIconClass(item.icon)" class="sidebar-icon-inner" aria-hidden="true"></i>
                      </span>
                      <span class="popover-header-title">{{ item.title }}</span>
                    </router-link>
                  </div>
                </div>
              </template>

              <!-- Item with children -->
              <template v-else>
                <div
                  class="sidebar-parent-wrapper"
                  @mouseenter="handleParentHover(item.title)"
                  @mouseleave="handleParentLeave"
                >
                  <a
                    href="#"
                    class="sidebar-link"
                    :class="{ 'active': hasActiveChild(item.child), 'open': openMenus[item.title] }"
                    @click.prevent="toggleMenu(item.title)"
                  >
                    <span v-if="item.icon" class="sidebar-icon-box">
                      <i :class="getIconClass(item.icon)" class="sidebar-icon-inner" aria-hidden="true"></i>
                    </span>
                    <span class="sidebar-title">{{ item.title }}</span>
                    <i class="fa fa-chevron-right sidebar-arrow" aria-hidden="true"></i>
                  </a>

                  <!-- Regular submenu (shown when expanded) -->
                  <ul v-show="!collapsed && openMenus[item.title]" class="sidebar-submenu">
                    <li v-for="child in item.child" :key="child.href" class="sidebar-item">
                      <router-link
                        :to="child.href"
                        class="sidebar-link"
                        :class="{ 'active': isActive(child.href) }"
                        @click="handleMenuClick"
                      >
                        <span v-if="child.icon" class="sidebar-icon-box">
                          <i :class="getIconClass(child.icon)" class="sidebar-icon-inner" aria-hidden="true"></i>
                        </span>
                        <span class="sidebar-title">{{ child.title }}</span>
                      </router-link>
                    </li>
                  </ul>

                  <!-- Popover (shown when collapsed and hovering/clicked) -->
                  <div
                    v-show="shouldShowPopover(item.title)"
                    class="sidebar-popover"
                    @mouseenter="handleParentHover(item.title)"
                  >
                    <div class="popover-header">
                      <span v-if="item.icon" class="sidebar-icon-box">
                        <i :class="getIconClass(item.icon)" class="sidebar-icon-inner" aria-hidden="true"></i>
                      </span>
                      <span class="popover-header-title">{{ item.title }}</span>
                      <i class="fa fa-caret-left popover-header-arrow" aria-hidden="true"></i>
                    </div>
                    <ul class="popover-menu">
                      <li v-for="child in item.child" :key="child.href" class="popover-item">
                        <router-link
                          :to="child.href"
                          class="popover-link"
                          :class="{ 'active': isActive(child.href) }"
                          @click="handleMenuClick"
                        >
                          <span v-if="child.icon" class="sidebar-icon-box">
                            <i :class="getIconClass(child.icon)" class="sidebar-icon-inner" aria-hidden="true"></i>
                          </span>
                          <span class="popover-title">{{ child.title }}</span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </div>
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
import { ref, reactive, watch } from 'vue'
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
const openMenus = reactive({})
const hoveredMenu = ref(null)
const clickedMenu = ref(null)

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
    'fa-star-o': 'far fa-star',
    'fa-dropbox': 'fab fa-dropbox',
    'fa-commenting-o': 'far fa-comment-dots',
    'fa-hand-paper-o': 'far fa-hand-paper'
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
  if (props.collapsed) {
    // When collapsed, toggle the clicked menu to show/hide popover on click
    if (clickedMenu.value === title) {
      clickedMenu.value = null
      hoveredMenu.value = null
    } else {
      clickedMenu.value = title
      hoveredMenu.value = title
    }
  } else {
    // When expanded, toggle the submenu and close others
    const isCurrentlyOpen = openMenus[title]

    // Close all other menus
    Object.keys(openMenus).forEach(key => {
      openMenus[key] = false
    })

    // Toggle the current menu
    openMenus[title] = !isCurrentlyOpen
  }
}

// Handle menu click - close sidebar on mobile
const handleMenuClick = () => {
  // Close popover when child item is clicked in collapsed mode
  if (props.collapsed) {
    clickedMenu.value = null
    hoveredMenu.value = null
  }
  // Close sidebar when menu item is clicked
  if (props.visible) {
    emit('close')
  }
}

// Handle hover for popover in collapsed state
const handleParentHover = (title) => {
  if (props.collapsed) {
    hoveredMenu.value = title
  }
}

const handleParentLeave = () => {
  if (props.collapsed && !clickedMenu.value) {
    // Only clear hover if menu wasn't clicked (just hovering)
    hoveredMenu.value = null
  }
}

// Check if popover should be shown
const shouldShowPopover = (title) => {
  return props.collapsed && hoveredMenu.value === title
}

// Auto-open menu if child is active
watch(() => route.path, () => {
  props.menu.forEach(item => {
    if (item.child && hasActiveChild(item.child)) {
      openMenus[item.title] = true
    }
  })
}, { immediate: true })

// Close all menus when sidebar collapses
watch(() => props.collapsed, (isCollapsed) => {
  if (isCollapsed) {
    // Close all expanded menus
    Object.keys(openMenus).forEach(key => {
      openMenus[key] = false
    })
    // Close any clicked/hovered popover
    clickedMenu.value = null
    hoveredMenu.value = null
  }
})
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
    overflow: visible;

    .sidebar-title {
      display: none;
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
    }

    .sidebar-icon {
      margin-right: 0;
      width: 30px;
      height: 30px;
    }

    .has-children {
      > .sidebar-parent-wrapper > .sidebar-link {
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
  overflow: visible;
}

.sidebar-nav {
  padding: 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: visible;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .collapsed & {
    overflow: visible;
  }
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
  overflow: visible;
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
    > .sidebar-parent-wrapper > .sidebar-link {
      padding-right: 45px;
    }
  }
}

.sidebar-parent-wrapper {
  position: relative;
  width: 100%;
  overflow: visible;
  z-index: 1;
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
    border-left: 4px solid #ff8c42;

    .sidebar-icon,
    .sidebar-title {
      color: #fff !important;
    }
  }

  &.open {
    background-color: rgba(255, 255, 255, 0.05);
  }
}


.sidebar-icon-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #23272b;
  border-radius: 6px;
  margin-right: 10px;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
}

.sidebar-icon-inner {
  font-size: 15px;
  color: #fff;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}

.sidebar-link.open .sidebar-arrow {
  transform: translateY(-50%) rotate(90deg);
}

.sidebar-submenu {
  list-style: none;
  margin: 0;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.2);
}

// Popover styles
.sidebar-popover {
  position: absolute;
  left: 100%;
  top: 0;
  margin-left: 1px;
  min-width: 220px;
  max-width: 320px;
  background-color: #2f353a;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  animation: popoverFadeIn 0.2s ease-out;
  pointer-events: auto;
}

.popover-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  color: #fff;

  &.popover-header-clickable {
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}

.popover-header-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: 0;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
}

.popover-header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  font-size: 18px;
  color: #ff8c42;
}

.popover-header-title {
  flex: 1;
  color: #fff;
  white-space: nowrap;
  font-size: 15px;
  font-weight: 600;
}

.popover-menu {
  list-style: none;
  margin: 0;
  padding: 8px 0;
}

.popover-item {
  position: relative;
}

.popover-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: 600;
    border-left: 3px solid #ff8c42;
    padding-left: 17px;
  }
}

.popover-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  font-size: 16px;
  color: #fff;
}

.popover-title {
  flex: 1;
  color: #fff;
  white-space: nowrap;
  font-size: 14px;
}

@keyframes popoverFadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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
