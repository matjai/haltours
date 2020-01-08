<template>
  <v-container fluid class="pa-2 mt-10">
    <v-layout>
      <v-flex>
        <v-card>
          <v-card-title></v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <h2>Manage Hotels {{ defaultItem.packageId }}</h2>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select
                  :items="packages"
                  item-text="name"
                  item-value="name"
                  label="Package ID"
                  v-model="defaultItem.packageId"
                  outlined
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Hotel Name"
                  v-model="defaultItem.name"
                  placeholder="Hotel Name"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Hotel Code"
                  v-model="defaultItem.code"
                  placeholder="Hotel Code"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Hotel Location"
                  v-model="defaultItem.location"
                  placeholder="Hotel Location"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Available Rooms"
                  v-model="defaultItem.availableRooms"
                  placeholder="Available Rooms"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Available Beds"
                  v-model="defaultItem.availableBeds"
                  placeholder="Available Beds"
                  outlined
                ></v-text-field>
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
                                <h2 v-if="editedIndex > -1">{{roomItem.roomCode}}</h2>
                                <h2 v-else>Create New Rooms</h2>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-select
                                  :items="roomTypes"
                                  item-text="name"
                                  item-value="name"
                                  label="Room Type"
                                  v-model="roomItem.roomType"
                                  outlined
                                ></v-select>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-select
                                  :items="bedTypes"
                                  item-text="name"
                                  item-value="name"
                                  label="Bed Type"
                                  v-model="roomItem.bedType"
                                  outlined
                                ></v-select>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  v-model="roomItem.name"
                                  label="Room Name"
                                  placeholder="Room Name"
                                  outlined
                                ></v-text-field>
                              </v-col>

                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  label="Room Code"
                                  placeholder="Room Code"
                                  outlined
                                  v-model="roomItem.roomCode"
                                ></v-text-field>
                              </v-col>

                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  v-model="roomItem.availableRooms"
                                  label="Available Rooms"
                                  placeholder="Available Rooms (0)"
                                  outlined
                                ></v-text-field>
                              </v-col>

                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  label="Available Beds"
                                  placeholder="Available Beds (0)"
                                  outlined
                                  v-model="roomItem.availableBeds"
                                ></v-text-field>
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
                        <th class="text-left">Room Code</th>
                        <th class="text-left">Room Type</th>
                        <th class="text-left">Available Rooms</th>
                        <th class="text-left">Bed Type</th>
                        <th class="text-left">Available Beds</th>
                        <th class="text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in rooms" :key="item.id">
                        <td>{{ item.roomCode }}</td>
                        <td>{{ item.roomType }}</td>
                        <td>{{ item.availableRooms }}</td>
                        <td>{{ item.bedType }}</td>
                        <td>{{ item.availableBeds }}</td>
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
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

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

export default {
  mixins: [ValidationMixin, NotificationMixin],
  mounted() {
    this.hotelId = this.$router.currentRoute.params.hotelId;
    this.companyId = this.$router.currentRoute.params.companyId;

    this.$store
      .dispatch("fetchHotelsRooms", this.hotelId)
      .then(result => {
        result == undefined ? [] : result;
        this.rooms = result;

        console.log(this.rooms);
      })
      .catch(err => {
        console.log(err);
      });

    this.$store
      .dispatch("fetchHotelByID", this.hotelId)
      .then(result => {
        this.defaultItem = result.data();
      })
      .catch(err => {
        console.log(err);
      });

    this.initialize();
  },

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
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    date: new Date().toISOString().substr(0, 10),
    isSubmit: false,
    editMode: false,
    roomTypes: [],
    bedTypes: [],
    search: "",
    companyId: null,
    top: true,
    right: true,
    flight: {},
    flightChild: [],
    rooms: [],
    editedIndex: -1,
    packages: [],
    selectedIndex: [],
    roomItem: {
      name: null,
      roomType: null,
      roomCode: null,
      bedType: null,
      availableRooms: null,
      availableBeds: null
    },
    text: "This is notification!.",
    defaultItem: {
      id: null,
      name: "",
      code: null,
      packageId: null,
      location: "",
      stars: "",
      availableRooms: 0,
      availableBeds: 0,
      companyId: null
    }
  }),

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    initialize() {
      this.roomTypes = [
        { name: "Solo" },
        { name: "Family" },
        { name: "Large Room" }
      ];
      this.bedTypes = [
        { name: "Single Bed" },
        { name: "Queen Bed" },
        { name: "King Bed" }
      ];
    },

    editItem(item) {
      this.editedIndex = this.rooms.indexOf(item);
      this.roomItem = item;
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.rooms.indexOf(item);
      const x = confirm("Are you sure you want to delete this item?");
      if (x) {
        this.$store
          .dispatch("deleteHotelRooms", {
            hotelId: this.hotelId,
            data: item
          })
          .then(result => {
            this.message = "Room removed.";
            this.snackbar = true;
          });
      }
    },

    close() {
      this.dialog = false;

      setTimeout(() => {
        //this.roomItem = Object.assign({}, this.roomItem);
        this.editedIndex = -1;
        this.snackbar = true;
      }, 300);
    },

    saveChild() {
      if (this.editedIndex > -1) {
        const data = this.roomItem;

        this.$store
          .dispatch("updateHotelRooms", { hotelId: this.hotelId, data: data })
          .then(result => {
            this.message = "Room Changes saved.";
            this.snackbar = true;
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        const data = this.roomItem;

        this.$store
          .dispatch("storeHotelRooms", { hotelId: this.hotelId, data: data })
          .then(result => {
            this.message = "Room Added.";
            this.snackbar = true;
          })
          .catch(error => {
            console.log(error);
          });
        //this.rooms.push(this.roomItem);
      }

      this.close();
    },

    save() {
      this.$store
        .dispatch("updateHotels", {
          ...this.defaultItem,
          ...{ id: this.hotelId }
        })
        .then(result => {
          this.message = "Hotels record updated.";
          this.snackbar = true;
        });
    }
  }
};
</script>