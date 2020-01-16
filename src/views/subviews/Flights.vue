<template>
  <v-container fluid class="pa-2 mt-10">
    <v-data-table
      :headers="headers"
      :items="flights"
      sort-by="calories"
      class="elevation-1"
      :loading="flights == null"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Flights Management</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>

          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="800px">
            <template v-slot:activator="{ on }">
              <v-fab-transition>
                <v-btn color="pink" v-on="on" dark absolute top right fab>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-fab-transition>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline"></span>
              </v-card-title>

              <v-card-text>
                <flightView
                  :flightObject="editedItem"
                  :editMode="editMode"
                  @closeModal="updateMessage"
                />
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.departureDate="{ item }">
        <div v-if="item.child[0] != null">{{item.child[0].date}}</div>
      </template>
      <template v-slot:item.returnDate="{ item }">
        <div
          v-if="item.child[item.child.length-1] != null && item.child[item.child.length-1].type =='Arrival'"
        >{{item.child[item.child.length-1].date}}</div>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
        <v-icon small @click="deleteItem(item)">delete</v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import firebase from "firebase/firebase";
import flightView from "./FlightView";
export default {
  components: {
    flightView: flightView
  },
  data: () => ({
    dialog: false,
    dialog2: false,
    editMode: false,
    headers: [
      { text: "Package ID", value: "packageName" },
      { text: "Tour Code", value: "tourCode" },
      { text: "Description", value: "description" },
      { text: "All-in Ticket Fare", value: "allInTicketFare" },
      { text: "All-in Flight Tax", value: "allInFlightTax" },
      { text: "Available Seat", value: "availableSeats" },
      { text: "Departure Date", value: "departureDate" },
      { text: "Return Date", value: "returnDate" },
      { text: "Expiry Date", value: "expiryDate" },
      { text: "Actions", value: "action", sortable: false }
    ],
    search: "",
    companyID: null,
    snackbar: false,
    top: true,
    right: true,
    flights: [],
    editedIndex: -1,
    packages: [],
    selectedIndex: [],
    editedItem: {
      packageID: null,
      packageName: null,
      description: null,
      allInTicketFare: null,
      allInFlightTax: null,
      availableSeats: null,
      totalSeat: null,
      companyID: null,
      expiryDate: null,
      child: []
    },
    text: "This is notification!.",
    defaultItem: {
      packageID: null,
      packageName: null,
      description: null,
      allInTicketFare: null,
      allInFlightTax: null,
      availableSeats: null,
      totalSeat: null,
      companyID: null,
      expiryDate: null,
      child: []
    }
  }),

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  mounted() {
    this.initialize();
    this.companyID = this.$router.currentRoute.params.companyID;
    this.$store
      .dispatch("fetchFlightByCompanyID", this.companyID)
      .then(result => {
        console.log(result);

        this.flights = result;
      })
      .catch(err => {
        console.log(err);
      });
  },

  methods: {
    initialize() {},

    indexSelected(item) {
      this.selectedIndex.push(item.id);
    },

    editItem(item) {
      this.editedIndex = this.flights.indexOf(item);
      this.editedItem = item;
      this.editMode = true;
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.flights.indexOf(item);
      const x = confirm("Are you sure you want to delete this item?");
      if (x) {
        this.$store.dispatch("deleteFlight", item);
        console.log(item);
        this.snackbar = true;
      }
    },

    close() {
      this.dialog = false;
      this.editMode = false;

      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.snackbar = true;
      }, 300);
    },

    updateMessage(variable) {
      this.dialog = variable;
    }
  }
};
</script>