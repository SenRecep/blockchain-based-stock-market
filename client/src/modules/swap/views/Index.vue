<script setup lang="ts">
import productsHttpRepository, {
  MarketItem,
} from "@/api/products.http.repository";
import { useLoadingStore } from "@/stores/loading.store";
import { ServiceResponse } from "@/types/ServiceResponse.interface";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { NoContentResponse } from "../../../types/NoContentResponse.interface";
import notify from "@/helpers/notify";
const route = useRoute();
const router = useRouter();
const marketItemId = route.params.marketItemId as string;

const imagesBaseUrl = import.meta.env.VITE_IMAGES_BASE_URL;

const getImageUrl = (path: string) => {
  return imagesBaseUrl + path;
};

const state = ref({
  marketItems: [] as MarketItem[],
  marketItem: {} as MarketItem,
});

const selectedMarketItem = ref<string>("");

const loadingStore = useLoadingStore();
onMounted(async () => {
  loadingStore.isLoading = true;
  const response = (await productsHttpRepository.getUser(
    () => (loadingStore.isLoading = false)
  )) as ServiceResponse<MarketItem[]>;

  if (!response.isSuccessful) {
    return;
  }
  state.value.marketItems = response.data!;
});

onMounted(async () => {
  const response = (await productsHttpRepository.getMarketItem(
    marketItemId
  )) as ServiceResponse<MarketItem>;

  if (!response.isSuccessful) {
    return;
  }
  state.value.marketItem = response.data!;
});
const send = async () => {
  loadingStore.isLoading = true;
  const response = (await productsHttpRepository.swap(
    {
      fromMarketItemId: selectedMarketItem.value,
      toMarketItemId: marketItemId,
    },
    () => (loadingStore.isLoading = false)
  )) as ServiceResponse<NoContentResponse>;
  console.log(response);

  notify({
    title: "Bilgi",
    text: "Takas isteği gönderildi",
    type: "info",
  });
  router.push({ name: "home" });
};
</script>
<template>
  <v-row class="align-center h-100">
    <v-col cols="6 " >
      <v-card v-if="state.marketItem" class="h-100">
        <v-img
          class="align-end text-white"
          height="200"
          :src="getImageUrl(state.marketItem?.product?.image)"
        >
          <v-card-title>{{ state.marketItem?.product?.name }}</v-card-title>
        </v-img>

        <v-card-subtitle class="pt-4">
          {{ state.marketItem?.createTime }}
        </v-card-subtitle>
        <v-card-subtitle class="pt-4">
          Amount:{{ state.marketItem?.product?.amount }}
        </v-card-subtitle>

        <v-card-text>
          <div>{{ state.marketItem?.product?.description }}</div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-select
        label="Products"
        :items="state.marketItems"
        item-title="product.name"
        item-value="id"
        v-model="selectedMarketItem"
        variant="solo"
      ></v-select>
      <v-btn color="green" block @click="send">Gönder</v-btn>
    </v-col>
  </v-row>
</template>
