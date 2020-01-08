<template>
<v-container fluid class="pa-5 mt-10">
  <v-tabs
    dark
    background-color="deep-purple accent-4"
    centered
    icons-and-text
  >
    <v-tab>
      Flights
    </v-tab>
    <v-tab>
      Hotel
    </v-tab>
    <v-tab>
      Meal
    </v-tab>
    <v-tab>
      Miscellaneous
    </v-tab>

    <v-tab-item>
      <v-card>
        <flight/>
      </v-card>
    </v-tab-item>
    <v-tab-item>
      <v-card>
      </v-card>
    </v-tab-item>
    <v-tab-item>
      <v-card>
      </v-card>
    </v-tab-item>
    <v-tab-item>
      <v-card>
      </v-card>
    </v-tab-item>
  </v-tabs>
</v-container>
</template>
<script>
import flight from "./subviews/Flights";
  export default {
    components:{
        flight: flight,
      },
    data () {
      return {
        tab: 3,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      }
    },
  }
</script>