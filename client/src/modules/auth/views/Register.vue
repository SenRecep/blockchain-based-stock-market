<script setup lang="ts">
import { reactive, computed, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import authHttpRepository from "../../../api/auth.http.repository";
import { useLoadingStore } from "../../../stores/loading.store";
import { ServiceResponse } from "../../../types/ServiceResponse.interface";
import { useAuthStore } from "../../../stores/auth.store";
import { useRouter } from "vue-router";
import { User } from "@/types/User.interface";
import { initWallet } from "../services/wallet.js";
const loadingStore = useLoadingStore();
const authStore = useAuthStore();
const router = useRouter();
const dialog = ref(false);
const dialogContent = ref({
  publicKey: "",
  priviteKey: "",
});
const formState = reactive({
  email: "",
  password: "",
  name: "",
  surname: "",
  identityNumber: "",
  publicKey: "",
});

const apiErrors = reactive({
  errors: [] as string[],
});

const rules = computed(() => ({
  email: { required, email },
  password: { required, minLength: minLength(6) },
  name: { required },
  surname: { required },
  identityNumber: { required },
}));

const validator = useVuelidate(rules, formState);

const formSubmit = async () => {
  const validationResults = await validator.value.$validate();
  if (!validationResults) return;
  loadingStore.beginLoading();
  const wallet = initWallet();
  dialogContent.value.priviteKey = wallet.privateKey;
  dialogContent.value.publicKey = wallet.publicKey;
  formState.publicKey = wallet.publicKey;
  const response = (await authHttpRepository.signUp(formState, () =>
    loadingStore.endLoading()
  )) as ServiceResponse<User>;
  if (!response.isSuccessful) {
    if (response.error) apiErrors.errors = response.error!.errors;
    return;
  }
  dialog.value = true;
};

const agree = () => {
  router.push({ name: authStore.isAuthenticated ? "home" : "login" });
};
</script>

<template>
  <v-row no-gutters class="justify-center align-center h-100">
    <v-dialog v-model="dialog" transition="dialog-top-transition" persistent>
      <template v-slot:default>
        <v-card>
          <v-toolbar title="Bilgileri lütfen kayıt ediniz!"></v-toolbar>
          <v-card-text>
            <h4>Public Key: {{ dialogContent.publicKey }}</h4>
            <h4>Private Key: {{ dialogContent.priviteKey }}</h4>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="green-darken-1" variant="text" @click="agree">
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-col lg="5" md="8" sm="12">
      <v-card>
        <v-toolbar class="pl-4">
          <v-icon icon="mdi-account-plus"></v-icon>
          <v-toolbar-title>Register</v-toolbar-title>
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
            <v-text-field
              class="mb-4"
              prepend-icon="mdi-account"
              placeholder="Your name"
              name="name"
              label="Name"
              type="text"
              clearable
              v-model="formState.name"
              :error-messages="
                validator.name.$errors.map((x) => x.$message.toString())
              "
            ></v-text-field>
            <v-text-field
              class="mb-4"
              prepend-icon="mdi-account"
              placeholder="Your Surname"
              name="surname"
              label="Surname"
              type="text"
              clearable
              v-model="formState.surname"
              :error-messages="
                validator.surname.$errors.map((x) => x.$message.toString())
              "
            ></v-text-field>

            <v-text-field
              class="mb-4"
              prepend-icon="mdi-badge-account-horizontal"
              placeholder="Your Identity Number"
              name="identityNUMBER"
              label="Identity Number"
              type="text"
              clearable
              v-model="formState.identityNumber"
              :error-messages="
                validator.identityNumber.$errors.map((x) =>
                  x.$message.toString()
                )
              "
            ></v-text-field>

            <v-text-field
              class="mb-4"
              prepend-icon="mdi-email"
              placeholder="mail@domain.com"
              name="email"
              label="Email"
              type="email"
              clearable
              v-model="formState.email"
              :error-messages="
                validator.email.$errors.map((x) => x.$message.toString())
              "
            ></v-text-field>
            <v-text-field
              id="password"
              prepend-icon="mdi-form-textbox-password"
              name="password"
              label="Password"
              type="password"
              clearable
              v-model="formState.password"
              :error-messages="
                validator.password.$errors.map((x) => x.$message.toString())
              "
            ></v-text-field>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                prepend-icon="mdi-account-plus"
                type="submit"
                variant="outlined"
                >Register</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
