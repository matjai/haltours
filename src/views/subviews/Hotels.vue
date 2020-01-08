<template>
  <v-container fluid class="pa-2 mt-10">
    <!-- <h2 class="font-weight-bold">hotels Management</h2> -->
    <v-data-table
      :headers="headers"
      :items="hotels"
      sort-by="calories"
      class="elevation-1"
      :loading="hotels == null"
    >
      <template v-slot:item.code="{ item }">
        <router-link
          :to="{name:'hotel',params:{company:item.companyId,hotelId:item.id}}"
        >{{ item.code }}</router-link>
      </template>

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Hotels Management</v-toolbar-title>
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
              <!-- <v-btn color="primary" dark class="mb-2" New Staff</v-btn> -->
            </template>
            <v-card>
              <v-card-title>
                <span class="headline"></span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="6" sm="6" md="6">
                      <v-select
                        :items="packages"
                        item-text="name"
                        item-value="id"
                        label="Package ID"
                        placeholder="Package ID"
                        v-model="editedItem.packageId"
                        outlined
                      ></v-select>
                    </v-col>

                    <v-col cols="6" sm="6" md="6">
                      <v-select
                        :items="stars"
                        item-text="name"
                        item-value="value"
                        label="Hotel stars"
                        placeholder="Hotel Stars"
                        v-model="editedItem.stars"
                        outlined
                      ></v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Hotel Name"
                        v-model="editedItem.name"
                        placeholder="Hotel Name"
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Hotel Code"
                        v-model="editedItem.code"
                        placeholder="Hotel Code"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Hotel Location"
                        v-model="editedItem.location"
                        placeholder="Hotel Location"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Available Rooms (0)"
                        v-model="editedItem.availableRooms"
                        placeholder="Available Rooms (0)"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Available Beds (0)"
                        v-model="editedItem.availableBeds"
                        placeholder="Available Beds (0)"
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

      <template v-slot:item.roles="{ item }">
        <v-chip class="ma-2 text-center justify-center" color="primary" pill>{{ item.roles }}</v-chip>
      </template>

      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
        <v-icon small @click="deleteItem(item)">delete</v-icon>
      </template>
    </v-data-table>

    <!--
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar" top="top" right="right">
        {{ text }}
        <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
    -->
  </v-container>
</template>

<script>
export default {
  mounted() {
    this.$store
      .dispatch("fetchHotels")
      .then(result => {
        this.hotels = result;
      })
      .catch(err => {
        console.log(err);
      });

    this.$store
      .dispatch("fetchPackage")
      .then(result => {
        console.log(result);
        this.packages = result;
      })
      .catch(err => {
        console.log(err);
      });
  },

  data: () => ({
    dialog: false,
    rules: [
      value =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!"
    ],
    headers: [
      {
        value: "avatar",
        align: "left",
        sortable: false
      },
      { text: "Package", value: "packageId" },
      { text: "Code", value: "code" },
      { text: "Name", value: "name" },
      { text: "Location", value: "location" },
      { text: "star count", value: "stars" },
      { text: "Available Rooms", value: "availableRooms" },
      { text: "Available Beds", value: "availableBeds" },
      { text: "Actions", value: "action", sortable: false }
    ],
    stars: [
      {
        value: 1,
        name: "1 stars"
      },
      {
        value: 2,
        name: "2 stars"
      },
      {
        value: 3,
        name: "3 stars"
      },
      {
        value: 4,
        name: "4 stars"
      },
      {
        value: 5,
        name: "5 stars"
      }
    ],
    search: "",
    snackbar: false,
    top: true,
    right: true,
    hotels: [],
    packages: [],
    editedIndex: -1,
    selectedIndex: [],
    editedItem: {
      name: "",
      code: null,
      packageId: null,
      location: "",
      stars: "",
      availableRooms: 0,
      availableBeds: 0,
      companyId: null
    },
    text: "Horayy! Everything is working fine.",
    defaultItem: {
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
    indexSelected(item) {
      this.selectedIndex.push(item.id);
    },

    editItem(item) {
      this.editedIndex = this.hotels.indexOf(item);
      this.editedItem = this.hotels[this.editedIndex];
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.hotels.indexOf(item);
      const x = confirm("Are you sure you want to delete this item?");
      if (x) {
        this.$store.dispatch("deleteHotels", item);
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
        this.$store.dispatch("updateHotels", this.editedItem);
      } else {
        this.$store.dispatch("storeHotels", this.editedItem);
      }

      this.close();
    }
  }
};
</script>