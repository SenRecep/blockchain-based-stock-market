<script setup lang="ts">
import productsHttpRepository from "@/api/products.http.repository";
import { useLoadingStore } from "@/stores/loading.store";
import { ServiceResponse } from "@/types/ServiceResponse.interface";
import { User } from "@/types/User.interface";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import notify from "@/helpers/notify";
const loadingStore = useLoadingStore();
const router = useRouter();
const formState = reactive({
  images: "",
  name: "",
  amount: 0,
  description: "",
});

const apiErrors = reactive({
  errors: [] as string[],
});

const selectFile = (e: any) => {
  if (e.target.files.length > 0) formState.images = e.target.files[0];
  else formState.images = "";
};

const formSubmit = async () => {
  const formData = new FormData();
  formData.append("images", formState.images);
  formData.append("name", formState.name);
  formData.append("description", formState.description);
  formData.append("amount", formState.amount.toString());

  loadingStore.beginLoading();
  const response = (await productsHttpRepository.createProduct(formData, () =>
    loadingStore.endLoading()
  )) as ServiceResponse<User>;
  if (!response.isSuccessful) {
    if (response.error) apiErrors.errors = response.error!.errors;
    return;
  }
  notify({
    title: "Bilgi",
    text: "Ürün eklendi",
    type: "success",
  });
  router.push({ name: "home" });
};
</script>
<template>
  <v-row no-gutters class="justify-center align-center h-100">
    <v-col lg="5" md="8" sm="12">
      <v-card>
        <v-toolbar class="pl-4">
          <v-icon icon="mdi-tag-text-outline"></v-icon>
          <v-toolbar-title>Create Product</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-alert
            title="Api Errors"
            type="warning"
            variant="outlined"
            class="mb-4"
            v-if="apiErrors.errors.length > 0"
          >
            <template v-for="error in apiErrors.errors">
              <span>{{ error }} </span><br />
            </template>
          </v-alert>
          <v-form @submit.prevent="formSubmit">
            <v-file-input
              class="mb-4"
              show-size
              label="Product Image"
              @change="selectFile"
            ></v-file-input>
            <v-text-field
              class="mb-4"
              placeholder="Your name"
              prepend-icon="mdi-tag-text-outline"
              name="name"
              label="Name"
              type="text"
              clearable
              v-model="formState.name"
            ></v-text-field>
            <v-text-field
              class="mb-4"
              placeholder="Description"
              prepend-icon="mdi-card-text-outline"
              name="description"
              label="Description"
              type="text"
              clearable
              v-model="formState.description"
            ></v-text-field>

            <v-text-field
              class="mb-4"
              placeholder="Amount"
              prepend-icon="mdi-numeric"
              name="amount"
              label="Amount"
              type="text"
              clearable
              v-model="formState.amount"
            ></v-text-field>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                prepend-icon="mdi-tag-text-outline"
                type="submit"
                variant="outlined"
                >Create</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
