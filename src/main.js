import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Aura from "@primeuix/themes/aura";
import ToastService from "primevue/toastservice";
import "./assets/main.css";
import "./style.css";
import "primeicons/primeicons.css";

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(pinia);
app.use(ToastService);
app.use(router);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.mount("#app");
