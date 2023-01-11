<script setup lang="ts">
import { reactive, onMounted } from "vue";
import requestsHttpRepository, {
  SwapRequest,
} from "@/api/requests.http.repository";
import { ServiceResponse } from "@/types/ServiceResponse.interface";
import notify from "@/helpers/notify";
import { useRouter } from "vue-router";
import { NoContentResponse } from "../../../types/NoContentResponse.interface";
import { useLoadingStore } from "@/stores/loading.store";
const router = useRouter();
const loadingStore = useLoadingStore();
const imagesBaseUrl = import.meta.env.VITE_IMAGES_BASE_URL;

const getImageUrl = (path: string) => {
  return imagesBaseUrl + path;
};
const state = reactive({
  requests: [] as SwapRequest[],
});
onMounted(async () => {
  const response =
    (await requestsHttpRepository.getSwapRequests()) as ServiceResponse<
      SwapRequest[]
    >;
  if (response.isSuccessful) state.requests = response.data!;
});

const success = async (id: string) => {
  const privateKey = prompt("Primary Key");
  if (!privateKey || privateKey?.length == 0) {
    alert("İşlem tamamlanabilmesi için private key bilgisini giriniz.");
    return;
  }
  loadingStore.isLoading = true;
  const response = (await requestsHttpRepository.verifyRequest(
    id,
    privateKey,
    () => (loadingStore.isLoading = false)
  )) as ServiceResponse<NoContentResponse>;
  if (!response.isSuccessful) {
    notify({
      title: "Hata",
      text: "Takas işlemi gerçekleştirilemedi",
      type: "error",
    });
    return;
  }
  notify({
    title: "Bilgi",
    text: "Takas işlemi gerçekleştirildi",
    type: "success",
  });
  router.push({ name: "home" });
};
</script>
<template>
  <v-table fixed-header>
    <thead>
      <tr>
        <th class="text-center" colspan="4">From Product</th>
        <th class="text-center" colspan="4">To Product</th>
      </tr>
      <tr>
        <th class="text-left">Name</th>
        <th class="text-left">Description</th>
        <th class="text-left">Amount</th>
        <th class="text-left">Image</th>

        <th class="text-left">Name</th>
        <th class="text-left">Description</th>
        <th class="text-left">Amount</th>
        <th class="text-left">Image</th>

        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr
        :class="item.verify ? 'bg-green-lighten-2' : 'bg-red-lighten-2'"
        v-for="item in state.requests"
        :key="item.id"
      >
        <td>{{ item.fromProduct.name }}</td>
        <td>{{ item.fromProduct.description }}</td>
        <td>{{ item.fromProduct.amount }}</td>
        <td><v-img :src="getImageUrl(item.fromProduct.image)" /></td>

        <td>{{ item.toProduct.name }}</td>
        <td>{{ item.toProduct.description }}</td>
        <td>{{ item.toProduct.amount }}</td>
        <td><v-img :src="getImageUrl(item.toProduct.image)" /></td>
        <td>
          <v-btn
            v-if="!item.verify"
            @click="success(item.id)"
            size="x-small"
            icon
            color="success"
          >
            <v-icon>mdi-thumb-up</v-icon>
          </v-btn>
        </td>
        <td>
          <v-btn v-if="!item.verify" size="x-small" icon color="red">
            <v-icon>mdi-thumb-down</v-icon>
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
