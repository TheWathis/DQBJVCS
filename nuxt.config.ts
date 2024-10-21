// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  runtimeConfig: {
    public: {
      geoapifyPlacesApiKey:
        process.env.NUXT_GEOAPIFY_PLACES_API_KEY || `FooBar`,
    },
  },
});
