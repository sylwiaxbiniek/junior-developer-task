import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import VueResource from 'vue-resource';
Vue.use(VueResource);

import App from './App.vue'
import vuetify from './plugins/vuetify';

import Products from './views/Products.vue';

const routes = [
    {
        name: 'products',
        path: '/',
        component: Products
    }
];

var router = new VueRouter({ routes: routes, mode: 'history' });
new Vue(Vue.util.extend({ router, vuetify }, App)).$mount('#app');