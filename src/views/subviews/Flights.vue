<template>
  <v-container fluid class="pa-2 mt-10">
    <v-data-table
      :headers="headers"
      :items="flights"
      sort-by="calories"
      class="elevation-1"
      :loading="flights == null"
    >

      <template v-slot:item.description="{ item }">
        <router-link
          :to="{name:'flight',params:{companyId:item.companyID,flightId:item.id}}"
        >{{ item.description }}</router-link>
      </template>

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
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        :items="packages"
                        item-text="name"
                        item-value="id"
                        label="Package"
                        v-model="editedItem.packageID"
                        outlined
                      ></v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Description"
                        v-model="editedItem.description"
                        placeholder="Description"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="All-In Ticket Fare"
                        v-model="editedItem.allInTicketFare"
                        placeholder="All-In Ticket Fare"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="All-In Flight Tax"
                        v-model="editedItem.allInFlightTax"
                        placeholder="All-In Flight Tax"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Expiry Date"
                        v-model="editedItem.expiryDate"
                        placeholder="Expiry Date"
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Available Seat"
                        v-model="editedItem.availableSeat"
                        placeholder="Available Seat"
                        outlined
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
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

export default {
  data: () => ({
    dialog: false,
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
      console.log(this.editedItem)
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
    }
  }
};
</script>