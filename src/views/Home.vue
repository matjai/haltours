<template>
  <v-container fluid="" class="pa-0">
    <v-toolbar flat="">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Haltours Destination Management</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn text>ABOUT US</v-btn>
        <v-btn text>CONTACT</v-btn>
        <v-btn text>SOCIALS</v-btn>
      </v-toolbar-items>
      <v-btn icon to="/login">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-toolbar>
    <v-layout>
      <v-flex>
        <v-card class="mx-auto mt-6" max-width="500">
          <v-img
            class="white--text align-end"
            height="200px"
            src="@/assets/banner.jpg"
          >
            <v-card-title>HALTOURS.COM IS HAPPENING</v-card-title>
          </v-img>

          <v-card-text>
            <p class="text--primary">
              Welcome to the new website of Haltours.com. We are in the middle
              of developing the DMC system for all our partners and clients. It
              will be an exciting year for 2020 as we mode forward towards
              digitalization.
            </p>
            <div class="text--primary">
              We will keep you updated to the development of this new online
              system and we hope you are as excited as we are. In the meantime,
              do contact us through the following email addresses for immediate
              queries:
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="deep-purple accent-4">
              murni@haltours.com
            </v-btn>
            <v-btn text color="deep-purple accent-4">
              joehan@haltours.com
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-footer dark padless absolute="">
      <v-card
        flat
        class="indigo lighten-1 white--text text-center"
        style="width: 100%;"
      >
        <v-card-text>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-4 white--text"
            icon
            large
          >
            <v-icon large>{{ icon }}</v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          3 Tower Jalan Ampang 68000 Selangor Malaysia
        </v-card-text>
        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>Haltours</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    icons: ["mdi-facebook-box", "mdi-instagram", "mdi-youtube"]
  })
};
</script>
