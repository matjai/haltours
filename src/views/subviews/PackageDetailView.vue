<template>
  <v-container fluid class="pa-2 mt-10">
    <!-- {{flights}}
        {{ground}}
        {{meal}}
        {{bagAndInsurance}}
    {{tourLeader}}-->
    <v-card>
      <v-row class="pl-6 pr-6">
        <v-col cols="12" sm="6" md="6">
          <v-carousel>
            <v-carousel-item
              v-for="(item,i) in attractions"
              :key="i"
              :src="item.heroURL? item.heroURL : emptyImageUrl"
              reverse-transition="fade-transition"
              transition="fade-transition"
            ></v-carousel-item>
          </v-carousel>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <p>Displaying Travel Date For:</p>
          <v-select
            :items="flights"
            item-text="date"
            item-value="id"
            label="Departure Date"
            @change="changeFlightSelection"
            v-model="flight"
            return-object
            outlined
          ></v-select>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr style="text-transform: uppercase;">
                  <th class="text-center">
                    <span >Type</span>
                  </th>
                  <th class="text-center">
                    <span >Airline</span>
                  </th>
                  <th class="text-center">
                    <span >Flight Number</span>
                  </th>
                  <th class="text-center">
                    <span >From</span>
                  </th>
                  <th class="text-center">
                    <span >To</span>
                  </th>
                  <th class="text-center">
                    <span >Date</span>
                  </th>
                  <th class="text-center">
                    <span >Time</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="flight.child == null">
                  <td colspan="10" class="text-center" style="background: #eee;">No Data available</td>
                </tr>

                <tr v-for="item in flight.child" :key="item.name">
                  <td class="text-center">
                    <v-chip :color="item.type == 'Departure' ? 'primary' : 'error' ">
                      <v-icon>{{ item.type == 'Departure'? 'mdi-airplane-takeoff' : 'mdi-airplane-landing' }}</v-icon>
                      &nbsp;{{ item.type }}
                    </v-chip>
                  </td>
                  <td>{{ item.airline }}</td>
                  <td>{{ item.number }}</td>
                  <td>{{ item.from }}</td>
                  <td>{{ item.to }}</td>
                  <td>{{ item.date }}</td>
                  <td>{{ item.time}}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-row class="pl-6 pr-6">
        <v-col cols="12" sm="6" md="6">
          <h5>Trip Highlight</h5>
        </v-col>
      </v-row>
      <v-row class="pl-6 pr-6">
        <v-col cols="12" sm="6" md="6">
          <p>{{this.package.highlight}}</p>
        </v-col>
      </v-row>
      <v-row class="pl-6 pr-6">
        <v-col cols="12" sm="6" md="12">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr style="text-transform: uppercase;">
                  <th class="text-left">
                    <span >Departure Date</span>
                  </th>
                  <th class="text-left">
                    <span >Return Date</span>
                  </th>
                  <th class="text-left">
                    <span >Tour Code</span>
                  </th>
                  <th class="text-left">
                    <span >All-in Ticket Fare</span>
                  </th>
                  <th class="text-left">
                    <span >All-in Flight Tax</span>
                  </th>
                  <th class="text-left">
                    <span >Status</span>
                  </th>
                  <th class="text-left">
                    <span >Ground Options</span>
                  </th>
                  <th class="text-left">
                    <span >Starting From</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in flights" :key="item.name">
                  <td>{{ item.child[0].date }}</td>
                  <td>{{ item.child[item.child.length-1].date }}</td>
                  <td>
                    <v-chip color="warning">{{ item.tourCode }}</v-chip>
                  </td>

                  <td>RM {{ item.allInTicketFare }}</td>

                  <td>RM {{ item.allInFlightTax }}</td>
                  <td>
                    <v-chip :color="item.status == 'Active' ? 'success': 'error'">{{ item.status}}</v-chip>
                  </td>
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
                                  <td>RM {{ calculateFare(gr.price)}}</td>
                                  <td>RM {{ calculateAllIn(gr.price)}}</td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </td>
                  <td>
                    <span style="font-weight: 400;">RM {{ lowestPrice(item) }}</span>
                    <br />
                    <v-chip color="yellow"> All-In</v-chip><span style="font-weight: bold;">RM {{ lowestPriceAllIn(item) }}</span>
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
    emptyImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/cikgumurnitravel-1c58c.appspot.com/o/image-not-available.jpg?alt=media&token=2ed2e48e-87c1-48c4-ba68-4889be8370b2",
    dialog: false,
    companyID: null,
    top: true,
    right: true,
    package: {},
    flights: [],
    flight: {},
    selectedTour: {},
    attractions: [],
    ground: {
      packageID: null,
      packageName: null,
      description: null,
      companyID: null,
      child: [
        { type: "Single", price: 0.0 },
        { type: "Adult Twin", price: 0.0 },
        { type: "Child Twin", price: 0.0 },
        { type: "Child With Bed", price: 0.0 },
        { type: "Child Without Bed", price: 0.0 }
      ]
    },
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

        this.$store
          .dispatch("fetchAttractionByDestinationID", this.package.destination)
          .then(result => {
            this.attractions = result;
          })
          .catch(err => console.log(err));
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

        this.flight = this.flights[0];

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