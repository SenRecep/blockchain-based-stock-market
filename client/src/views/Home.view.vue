<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useLoadingStore } from "../stores/loading.store";
import { useDisplay } from "vuetify/lib/framework.mjs";
import productsHttpRepository, {
  MarketItem,
} from "@/api/products.http.repository";
import { ServiceResponse } from "@/types/ServiceResponse.interface";
import { useRouter } from "vue-router";
const display = useDisplay();
const router = useRouter();

const col = computed(() => (display.mobile.value ? 6 : 3));
const imagesBaseUrl = import.meta.env.VITE_IMAGES_BASE_URL;

const getImageUrl = (path: string) => {
  return imagesBaseUrl + path;
};

const state = ref({
  marketItems: [] as MarketItem[],
  userMarketItems: [] as MarketItem[],
});

const loadingStore = useLoadingStore();
onMounted(async () => {
  loadingStore.isLoading = true;
  const response = (await productsHttpRepository.getOther(
    () => (loadingStore.isLoading = false)
  )) as ServiceResponse<MarketItem[]>;

  if (!response.isSuccessful) {
    return;
  }
  state.value.marketItems = response.data!;
});

const swap = (marketItemId: string) => {
  console.log(marketItemId);
  router.push({ name: "swap", params: { marketItemId } });
};
</script>
<template>
  <v-row class="justify-start">
    <v-col :cols="col" v-for="item in state.marketItems">
      <v-card>
        <v-img
          class="align-end text-white"
          height="200"
          :src="getImageUrl(item.product.image)"
          cover
        >
          <v-card-title>{{ item.product.name }}</v-card-title>
        </v-img>

        <v-card-subtitle class="pt-4"> {{ item.createTime }} </v-card-subtitle>
        <v-card-subtitle class="pt-4">
          Ammount:{{ item.product.amount }}
        </v-card-subtitle>

        <v-card-text>
          <div>{{ item.product.description }}</div>
        </v-card-text>

        <v-card-actions>
          <v-btn color="orange" @click="swap(item.id)"> Swap </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
