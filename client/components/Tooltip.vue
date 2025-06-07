<template>
  <div v-if="content" class="tooltip">
    <slot />
    <span :class="['tooltip__content', `tooltip__content--${position}`]">{{ content }}</span>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
defineProps({
  content: {
    type: String,
    default: null,
  },
  position: {
    type: String,
    validator: (value: string) => ['top', 'right', 'bottom', 'left'].includes(value),
    default: 'top',
  },
})
</script>

<style scoped>
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip:hover .tooltip__content {
  visibility: visible;
  opacity: 1;
}

.tooltip__content {
  position: absolute;
  z-index: 1;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease-in-out 0.8s;

  color: #ffffff;
  text-align: center;
  padding: 0.25em 0.5em;
  border-radius: 3px;
  width: max-content;
  max-width: 200px;
  background: black;
  font-size: small;
}

.tooltip__content--top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
}
.tooltip__content--right {
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
}
.tooltip__content--bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}
.tooltip__content--left {
  top: 50%;
  right: 100%;
  transform: translateY(-50%);
}
</style>
