import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  app: {
    baseURL: "/ethnomedix/", // Must match your repo name!
  },
  nitro: {
    prerender: {
      crawlLinks: true,  
      routes: ["/"],    
      failOnError: false, // Prevents build failure
    }
  }
});
