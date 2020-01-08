<template>
  <v-container fluid class="pa-5 mt-10">
    <v-tabs dark background-color="deep-purple accent-4" centered fixed-tabs icons-and-text>
      <v-tab>
        <v-icon>mdi-airplane-takeoff</v-icon>Flights
      </v-tab>
      <v-tab>
        <v-icon>mdi-hotel</v-icon>Hotels
      </v-tab>
      <v-tab>
        <v-icon>mdi-food</v-icon>Meal
      </v-tab>
      <v-tab>
        <v-icon>mdi-bag-checked</v-icon>Miscellaneous
      </v-tab>

      <v-tab-item class="pa-5">
        <flight />
      </v-tab-item>
      <v-tab-item class="pa-5">
        <hotels />
      </v-tab-item>
      <v-tab-item>
        <v-card></v-card>
      </v-tab-item>
      <v-tab-item></v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
import flight from "./subviews/Flights";
import hotels from "./subviews/Hotels";
export default {
  components: {
    flight: flight,
    hotels: hotels
  },
  data() {
    return {
      tab: 3,
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    };
  }
};
</script>