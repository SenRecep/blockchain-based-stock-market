<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
import productsHttpRepository, {
  MarketItem,
  Product,
} from "@/api/products.http.repository";
import { ServiceResponse } from "@/types/ServiceResponse.interface";
import { useRouter } from "vue-router";
import { useLoadingStore } from "@/stores/loading.store";
import { NoContentResponse } from "../../../types/NoContentResponse.interface";
const display = useDisplay();
const router = useRouter();

const col = computed(() => (display.mobile.value ? 6 : 3));
const imagesBaseUrl = import.meta.env.VITE_IMAGES_BASE_URL;

const getImageUrl = (path: string) => {
  return imagesBaseUrl + path;
};

const state = ref({
  products: [] as Product[],
});

const loadingStore = useLoadingStore();
onMounted(async () => {
  loadingStore.isLoading = true;
  const response = (await productsHttpRepository.getProducts(
    () => (loadingStore.isLoading = false)
  )) as ServiceResponse<Product[]>;

  if (!response.isSuccessful) {
    return;
  }

  state.value.products = response.data!;
});

const createMarketItem = async (id: string) => {
  loadingStore.isLoading = true;
  const response = (await productsHttpRepository.createMarketItem(
    id,
    () => (loadingStore.isLoading = false)
  )) as ServiceResponse<NoContentResponse>;

  if (!response.isSuccessful) {
    return;
  }
  router.push({ name: "home" });
};
</script>
<template>
  <v-row class="justify-start">
    <v-col :cols="col" v-for="item in state.products">
      <v-card class="h-100">
        <v-img
          class="align-end text-white"
          height="200"
          :src="getImageUrl(item.image)"
        >
          <v-card-title>{{ item.name }}</v-card-title>
        </v-img>

        <v-card-subtitle class="pt-4">
          Amount:{{ item.amount }}
        </v-card-subtitle>

        <v-card-text>
          <div>{{ item.description }}</div>
        </v-card-text>

        <v-card-actions>
          <v-btn
            v-if="item.verify"
            color="orange"
            @click="createMarketItem(item.id)"
          >
            Create Market Item
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
