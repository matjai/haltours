<template>
  <v-app>
    <v-app-bar app v-if="isLoggedIn">
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="$store.dispatch('logout')" class="elevation-0">
        <span class="mr-2">Logout</span>
      </v-btn>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({}),
  watch: {
    isLoggedIn(val) {
      if (!val) {
        this.$router.push("/");
      }
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  },
  methods: {}
};
</script>
