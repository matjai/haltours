<template>
  <v-app>
    <v-app-bar app v-if="isLoggedIn">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout" class="elevation-0">
        <span class="mr-2">Logout</span>
      </v-btn>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
      <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>John Leider</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            @click="$router.push(item.route)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    drawer: null,
    items: [
      { title: "Home", icon: "dashboard", route: null },
      { title: "Companies", icon: "dashboard", route: "companies" },
      { title: "Staffs", icon: "dashboard", route: "staffs" },
      { title: "Attractions", icon: "dashboard", route: "attractions" },
      { title: "About", icon: "question_answer", route: null }
    ]
  }),
  // watch: {
  //   isLoggedIn(val) { //if user exist, push to restricted landing page
  //     if (!val) {
  //       this.$router.push("/companies");
  //     }
  //   }
  // },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push("/")
      })
    }
  }
};
</script>
