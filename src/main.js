import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import "./style.css";
import "primeicons/primeicons.css";

createApp(App).use(router).mount("#app");
app.use(PrimeVue, {
  unstyled: true,
});
