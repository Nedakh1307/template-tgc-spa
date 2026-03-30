<template>
  <NConfigProvider>
    <NMessageProvider>
      <NLayout>
        <HeaderBar v-if="auth.isAuthenticated" />

        <NLayoutContent :style="auth.isAuthenticated ? 'padding: 24px' : ''">
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import HeaderBar from './components/layout/HeaderBar.vue'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family:
    v-sans,
    system-ui,
    -apple-system,
    sans-serif;
}
</style>
