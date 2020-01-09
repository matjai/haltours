<template>

  <v-container fluid class="pa-2 mt-10">
      
    <v-data-table
      :headers="headers"
      :items="flights"
      sort-by="calories"
      class="elevation-1"
      :loading="flights == null"
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
                <viewflight :flightObject="editedItem" :editMode="editMode" @closeModal="updateMessage"/>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar>
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
import viewflight from "./ViewFlight";
export default {
    components:{
        viewflight: viewflight
    },
  data: () => ({
    dialog: false,
    dialog2: false,
    editMode: false,
    headers: [
      { text: "ID", value: "id" },
      { text: "Package ID", value: "packageID" },
      { text: "Description", value: "description" },
      { text: "All-in Ticket Fare", value: "allInTicketFare" },
      { text: "All-in Flight Tax", value: "allInFlightTax" },
      { text: "Available Seat", value: "availableSeat" },
      { text: "Expiry Date", value: "expiryDate" },
      { text: "Actions", value: "action", sortable: false }
    ],
    search: "",
    companyId:null,
    snackbar: false,
    top: true,
    right: true,
    flights: [],
    editedIndex: -1,
    packages: [],
    selectedIndex: [],
    editedItem: {
      packageID: null,
      description: null,
      allInTicketFare: null,
      allInFlightTax: null,
      availableSeat: null,
      companyID: null,
      expiryDate: null,
      child:[]
    },
    text: "This is notification!.",
    defaultItem: {
      packageID: null,
      description: null,
      allInTicketFare: null,
      allInFlightTax: null,
      availableSeat: null,
      companyID: null,
      expiryDate: null,
      child:[]
    }
  }),

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  mounted() {
    this.initialize();
    this.companyId = this.$router.currentRoute.params.companyId;
    this.$store
      .dispatch("fetchFlightByCompanyID",this.companyId)
      .then(result => {
        console.log(result);

        this.flights = result;
      })
      .catch(err => {
        console.log(err);
      });
  },

  methods: {
    initialize() {
    },

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
        console.log(item)
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

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.flights[this.editedIndex], this.editedItem);
        this.$store.dispatch("updateFlight", this.editedItem);
      } else {
        this.editedItem.companyID = this.companyId;
        this.$store.dispatch("storeFlight", this.editedItem);
      }

      this.close();
    },
    updateMessage(variable) {
      this.dialog= variable;
    }
  }
};
</script>