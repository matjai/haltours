<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <h2 v-if="editMode">Manage Flight</h2>
        <h2 v-else>Create Flight</h2>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-select
          :items="packages"
          item-text="name"
          item-value="id"
          label="Package ID"
          v-model="flight.packageID"
          outlined
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          label="Tour Code"
          v-model="flight.tourCode"
          placeholder="Tour Code"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          label="Description"
          v-model="flight.description"
          placeholder="Description"
          outlined
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <v-text-field
          label="All In Ticket Fare"
          v-model="flight.allInTicketFare"
          placeholder="0.00"
          prefix="RM"
          outlined
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <v-text-field
          label="All In flight Tax"
          v-model="flight.allInFlightTax"
          placeholder="0.00"
          prefix="RM"
          outlined
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <v-text-field
          label="Available Seats"
          v-model="flight.availableSeats"
          placeholder="Available Seats"
          type="number"
          outlined
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="flight.expiryDate"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="flight.expiryDate"
              label="Expiry"
              readonly
              placeholder="Expiry"
              outlined
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-select
          :items="status"
          item-text="name"
          item-value="name"
          label="Status"
          v-model="flight.status"
          outlined
        ></v-select>
      </v-col>

      <v-col cols="12" md="12" sm="12" class="pa-4">
        <v-btn color="pink" @click="dialog = true" dark right>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn color="pink" style="margin-left: 1rem;" @click="save" dark right>Save</v-btn>
        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="save()" :disabled="isSubmit">
            <v-progress-circular size="20" indeterminate flat v-if="isSubmit"></v-progress-circular>Submit
          </v-btn>
        </v-card-actions>-->

        <!-- <v-btn color="primary" dark class="mb-2" New Staff</v-btn> -->

        <v-simple-table>
          <template v-slot:default>
            <v-dialog v-model="dialog" max-width="800px">
              <v-card>
                <v-card-title>
                  <span class="headline"></span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <h2 v-if="editedIndex > -1">{{flightItem.number}}</h2>
                        <h2 v-else>Create New Flight</h2>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          :items="flightType"
                          item-text="name"
                          item-value="name"
                          label="Direction"
                          v-model="flightItem.type"
                          outlined
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          :items="airline"
                          item-text="name"
                          item-value="name"
                          label="Airline"
                          v-model="flightItem.airline"
                          outlined
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="flightItem.number"
                          label="Flight Number"
                          placeholder="Flight Number"
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-menu
                          ref="menu2"
                          v-model="menu2"
                          :close-on-content-click="false"
                          :return-value.sync="flightItem.date"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="flightItem.date"
                              label="Date"
                              readonly
                              placeholder="Date"
                              outlined
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="date" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="menu2 = false">Cancel</v-btn>
                            <v-btn text color="primary" @click="$refs.menu2.save(date)">OK</v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-text-field label="Time" v-model="flightItem.time" placeholder="Time" outlined></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-text-field label="From" v-model="flightItem.from" placeholder="From" outlined></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-text-field label="To" v-model="flightItem.to" placeholder="To" outlined></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="saveChild">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <thead>
              <tr>
                <th class="text-left">Direction</th>
                <th class="text-left">Airline</th>
                <th class="text-left">Flight No</th>
                <th class="text-left">Date</th>
                <th class="text-left">Time</th>
                <th class="text-left">From</th>
                <th class="text-left">To</th>
                <th class="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              
              <tr v-for="item in flightChild" :key="item.id">
                <td>{{ item.type }}</td>
                <td>{{ item.airline }}</td>
                <td>{{ item.number }}</td>
                <td>{{ item.date }}</td>
                <td>{{ item.time }}</td>
                <td>{{ item.from }}</td>
                <td>{{ item.to }}</td>
                <td>
                  <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
                  <v-icon small @click="deleteItem(item)">delete</v-icon>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" top="top" absolute right="right" :type="type">
      {{ message }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import firebase from "firebase/firebase";
import NotificationMixin from "../mixins/NotificationMixin";
import ValidationMixin from "../mixins/NotificationMixin";
import { isError } from 'util';

export default {
  mixins: [ValidationMixin, NotificationMixin],
  data: () => ({
    dialog: false,
    headers: [
      { text: "Airline", value: "airline" },
      { text: "Flight Number", value: "number" },
      { text: "Date", value: "date" },
      { text: "Time", value: "Time" },
      { text: "From", value: "from" },
      { text: "To", value: "to" },
      { text: "Actions", value: "action", sortable: false }
    ],
    dessets: [],
    menu: false,
    modal: false,
    menu2: false,
    date: new Date().toISOString().substr(0, 10),
    isSubmit: false,
    airline: [],
    flightType: [],
    search: "",
    companyID: null,
    snackbar: false,
    top: true,
    right: true,
    status:[],
    flight: {},
    flightChild: [],
    flights: [],
    editedIndex: -1,
    packages: [],
    selectedIndex: [],
    flightItem: {
      airline: null,
      number: null,
      date: null,
      time: null,
      from: null,
      type: null,
      to: null
    },
    text: "This is notification!.",
    defaultItem: {
      airline: null,
      number: null,
      date: null,
      time: null,
      from: null,
      type: null,
      to: null
    }
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },

    flightObject: function () {
      this.flight= this.flightObject;
      this.flightChild = this.flightObject.child;
    },
    editMode: function(){
      console.log(this.editMode)
    }
  },
  props: {
    flightObject: Object,
    editMode: Boolean
  },
  mounted() {
    this.initialize();
    this.$store.dispatch('fetchPackage')
      .then(result => {
        this.packages = result;
        
      })
      .catch(err => console.log(err));
    // this.flightId = this.$router.currentRoute.params.flightId;
    // console.log(this.flightId);
    this.companyID = this.$router.currentRoute.params.companyID;
  },
  methods: {
    initialize() {
      if(this.editMode){
        this.flight = this.flightObject;
        this.flightChild = this.flight.child;
      }
      console.log(this.editMode)
      this.flightType = [{ name: "Departure" }, { name: "Arrival" }];
      this.airline = [{ name: "MAS" }, { name: "AIR ASIA" }];
      this.status = [{ name: "Active", code: "AV" }, { name: "Confirm Departure", code: "CF" }];
    },

    editItem(item) {
      this.editedIndex = this.flightChild.indexOf(item);
      this.flightItem = item;
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

      setTimeout(() => {
        this.flightItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.snackbar = true;
      }, 300);
    },

    saveChild() {
      if (this.editedIndex > -1) {
        Object.assign(this.flightChild[this.editedIndex], this.flightItem);
      } else {
        this.flightChild.push(this.flightItem);
      }

      this.close();
    },

    save() {
      
      this.flight.packageName = this.packages.find(element => element.id == this.flight.packageID).name;
      this.flight.child = this.flightChild.sort(function(a, b) {
          var dateA = new Date(a.date), dateB = new Date(b.date);
          return dateA - dateB;
      });

      if(this.editMode){
        this.$store.dispatch("updateFlight", this.flight);
      }
      else{
        this.flight.companyID= this.companyID;
        this.flight.totalSeat = this.flight.availableSeat;
        this.$store.dispatch("storeFlight", this.flight);
      }
      this.$emit("closeModal", false);
    }
  }
};
</script>