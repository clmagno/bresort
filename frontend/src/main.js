import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import vSelect from "vue-select";
import VueSweetalert2 from 'vue-sweetalert2';
import VueSimpleContextMenu from 'vue-simple-context-menu';
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';
import 'sweetalert2/dist/sweetalert2.min.css';

const app = createApp(App);

app.config.globalProperties = {
    //API_URL : "http://192.168.148.4:8081/"
    API_URL : "http://192.168.1.5:8081/" 
}

app.use(router);
app.use(createPinia());
app.use(VueSweetalert2);

app.component("v-select", vSelect).component('vue-simple-context-menu', VueSimpleContextMenu).mount("#app"); 
