<script setup lang="ts">
import { computed, ref } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
const display = useDisplay();
const col = computed(() => (display.mobile.value ? 12 : 6));

const labStatusKey = ref(0);
const userHistoryKey = ref(4);
const forceReload = () => {
  labStatusKey.value++;
  userHistoryKey.value++;
};
</script>
<template>
  <v-row> </v-row>
</template>
