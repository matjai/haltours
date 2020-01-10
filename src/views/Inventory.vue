<template>
  <v-container fluid class="pa-5 mt-10">
    <v-tabs dark background-color="deep-purple accent-4" centered fixed-tabs icons-and-text>
      <v-tab>
        <v-icon>mdi-airplane-takeoff</v-icon>Flights
      </v-tab>
      <v-tab>
        <v-icon>mdi-hotel</v-icon>Grounds
      </v-tab>
      <!-- <v-tab>
        <v-icon>mdi-hotel</v-icon>Hotels
      </v-tab> -->
      <v-tab>
        <v-icon>mdi-food</v-icon>Meal
      </v-tab>
      <v-tab>
        <v-icon>mdi-human</v-icon>Tour Leader
      </v-tab>
      <v-tab>
        <v-icon>mdi-briefcase</v-icon>Bag And Insurances
      </v-tab>
      <!-- <v-tab>
        <v-icon>mdi-bag-checked</v-icon>Miscellaneous
      </v-tab> -->

      <v-tab-item class="pa-5">
        <flight />
      </v-tab-item>
      <v-tab-item class="pa-5">
        <ground />
      </v-tab-item>
      <v-tab-item class="pa-5">
        <meal />
      </v-tab-item>
      <v-tab-item class="pa-5">
        <tourLeader />
      </v-tab-item>
      <v-tab-item class="pa-5">
        <bagAndInsurance />
      </v-tab-item>
      <!-- <v-tab-item class="pa-5">
        <hotels />
      </v-tab-item> -->
      <!-- <v-tab-item class="pa-5">
        <mealtypes />
      </v-tab-item> -->
      <v-tab-item></v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
import flight from "./subviews/Flights";
// import hotels from "./subviews/Hotels";
// import mealtypes from "./subviews/MealTypes";
import ground from "./subviews/Ground";
import tourLeader from "./subviews/TourLeader";
import bagAndInsurance from "./subviews/BagAndInsurance";
import meal from "./subviews/Meal";

export default {
  components: {
    flight: flight,
    // hotels: hotels,
    // mealtypes: mealtypes,
    ground: ground,
    meal: meal,
    tourLeader: tourLeader,
    bagAndInsurance: bagAndInsurance
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