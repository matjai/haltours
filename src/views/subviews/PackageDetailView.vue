<template>
  <v-container fluid class="pa-2 mt-10">
    <!-- {{flights}}
        {{ground}}
        {{meal}}
        {{bagAndInsurance}}
    {{tourLeader}}-->
    <v-card>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-carousel></v-carousel>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <p>Displaying Travel Date For:</p>
          <v-select
            :items="flights"
            item-text="date"
            item-value="id"
            label="Departure Date"
            @change="changeFlightSelection"
            return-object
            outlined
          ></v-select>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Type</th>
                  <th class="text-left">Airline</th>
                  <th class="text-left">Flight Number</th>
                  <th class="text-left">From</th>
                  <th class="text-left">To</th>
                  <th class="text-left">Date</th>
                  <th class="text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!flight.child">
                  <td class="text-center" colspan="10">No Data Available</td>
                </tr>

                <tr v-for="item in flight.child" :key="item.name">
                  <td>{{ item.type }}</td>
                  <td>{{ item.airline }}</td>
                  <td>{{ item.number }}</td>
                  <td>{{ item.from }}</td>
                  <td>{{ item.to }}</td>
                  <td>{{ item.date }}</td>
                  <td>{{ item.time }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-row class="pl-10 pr-10">
        <v-col cols="12" sm="6" md="12">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Departure Date</th>
                  <th class="text-left">Return Date</th>
                  <th class="text-left">Tour Code</th>
                  <th class="text-left">Status</th>
                  <th class="text-left">Ground Options</th>
                  <th class="text-left">Starting From</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in flights" :key="item.name">
                  <td>{{ item.child[0].date }}</td>
                  <td>{{ item.child[item.child.length-1].date }}</td>
                  <td>{{ item.tourCode }}</td>
                  <td>{{ item.status }}</td>
                  <td>
                    <v-dialog v-model="dialog" max-width="800px">
                      <template v-slot:activator="{ on }">
                        <v-fab-transition>
                          <v-btn color="primary" v-on="on" @click="seeItem(item)">
                            <v-icon>mdi-hotel</v-icon>&nbsp; See Options
                          </v-btn>
                        </v-fab-transition>
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="headline"></span>
                        </v-card-title>

                        <v-card-text>
                          <v-simple-table>
                            <template v-slot:default>
                              <thead>
                                <tr>
                                  <th class="text-left">Rate Code</th>
                                  <th class="text-left">Rate Name</th>
                                  <th class="text-left">Fare Price</th>
                                  <th class="text-left">All In Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="gr in ground.child" :key="gr.type">
                                  <td>CODE</td>
                                  <td>{{ gr.type}}</td>
                                  <td>{{ calculateFare(gr.price)}}</td>
                                  <td>{{ calculateAllIn(gr.price)}}</td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </td>
                  <td>
                    {{ lowestPrice(item) }}
                    <br />
                    {{ lowestPriceAllIn(item) }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    companyID: null,
    top: true,
    right: true,
    package: {},
    flights: [],
    flight: {},
    selectedTour: {},
    ground: {},
    tourLeader: {},
    meal: {},
    bagAndInsurance: {},
    text: "This is notification!."
  }),
  mounted() {
    this.$store
      .dispatch("fetchPackageByID", this.$router.currentRoute.params.packageID)
      .then(result => {
        this.package = result.data();
      })
      .catch(err => console.log(err));

    this.$store
      .dispatch(
        "fetchFlightByPackageID",
        this.$router.currentRoute.params.packageID
      )
      .then(result => {
        result.forEach(element => {
          element.date = element.child[0].date;
        });

        this.flights = result;

        this.flights = this.flights.sort(function(a, b) {
          var dateA = new Date(a.date),
            dateB = new Date(b.date);
          return dateA - dateB;
        });
      })
      .catch(err => console.log(err));

    this.$store
      .dispatch(
        "fetchMealByPackageID",
        this.$router.currentRoute.params.packageID
      )
      .then(result => {
        this.meal = result[0];
      })
      .catch(err => console.log(err));

    this.$store
      .dispatch(
        "fetchGroundByPackageID",
        this.$router.currentRoute.params.packageID
      )
      .then(result => {
        this.ground = result[0];
      })
      .catch(err => console.log(err));

    this.$store
      .dispatch(
        "fetchBagAndInsuranceByPackageID",
        this.$router.currentRoute.params.packageID
      )
      .then(result => {
        this.bagAndInsurance = result[0];
      })
      .catch(err => console.log(err));

    this.$store
      .dispatch(
        "fetchTourLeaderByPackageID",
        this.$router.currentRoute.params.packageID
      )
      .then(result => {
        this.tourLeader = result[0];
      })
      .catch(err => console.log(err));
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    changeFlightSelection(item) {
      this.flight = item;
    },

    seeItem(item) {
      this.selectedTour = item;
    },

    calculateFare(item) {
      let groundPrice =
        (Number(item) + Number(this.package.tipping)) *
        Number(this.package.days);

      let netPrice =
        Number(this.selectedTour.allInTicketFare) +
        groundPrice +
        Number(this.tourLeader.price) +
        Number(this.bagAndInsurance.price);

      let sellingPrice = (4 / 100) * netPrice + netPrice;
      return sellingPrice.toFixed(2);
    },

    calculateAllIn(item) {
      let groundPrice =
        (Number(item) + Number(this.package.tipping)) *
        Number(this.package.days);

      let netPrice =
        Number(this.selectedTour.allInTicketFare) +
        groundPrice +
        Number(this.selectedTour.allInFlightTax) +
        Number(this.tourLeader.price) +
        Number(this.bagAndInsurance.price);

      let sellingPrice = (4 / 100) * netPrice + netPrice;
      return sellingPrice.toFixed(2);
    },

    lowestPrice(item) {
      let groundPrice =
        (Math.min.apply(Math, this.ground.child.map(a => a.price)) +
          Number(this.package.tipping)) *
        Number(this.package.days);

      let netPrice =
        Number(item.allInTicketFare) +
        groundPrice +
        Number(this.tourLeader.price) +
        Number(this.bagAndInsurance.price);

      let sellingPrice = (4 / 100) * netPrice + netPrice;
      return sellingPrice.toFixed(2);
    },

    lowestPriceAllIn(item) {
      let groundPrice =
        (Math.min.apply(Math, this.ground.child.map(a => a.price)) +
          Number(this.package.tipping)) *
        Number(this.package.days);

      let netPrice =
        Number(item.allInTicketFare) +
        Number(item.allInFlightTax) +
        groundPrice +
        Number(this.tourLeader.price) +
        Number(this.bagAndInsurance.price);

      let sellingPrice = (4 / 100) * netPrice + netPrice;
      return sellingPrice.toFixed(2);
    },

    close() {
      this.dialog = false;

      setTimeout(() => {
        this.selectedTour = {};
      }, 300);
    }
  }
};
</script>