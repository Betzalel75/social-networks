import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

const app = createApp(App);

// Définir une propriété de données pour stocker la classe de la balise body
// Définissez la classe de la balise body en fonction de la route actuelle
router.beforeEach((to, _, next) => {
    document.body.className = 'body-' + to.name.toLocaleLowerCase(); // Modifiez directement la classe de la balise body
    next();
});

app.use(store);
app.use(router);
app.mount("#app");

