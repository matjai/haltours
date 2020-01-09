<template>
  <v-container fluid class="pa-2 mt-10">
    <!-- <h2 class="font-weight-bold">hotels Management</h2> -->
    <v-data-table
      :headers="headers"
      :items="mealtypes"
      sort-by="calories"
      class="elevation-1"
      :loading="mealtypes == null"
    >
      <template v-slot:item.code="{ item }">
        <router-link
          :to="{name:'hotel',params:{company:item.companyId,hotelId:item.id}}"
        >{{ item.code }}</router-link>
      </template>

      <template v-slot:item.packageId="{ item }">
        <v-chip>{{ item.packageId }}</v-chip>
      </template>

      <template v-slot:item.hotelId="{ item }">
        <v-chip>{{ item.hotelId }}</v-chip>
      </template>

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Meal Management</v-toolbar-title>
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
                        :items="hotels"
                        item-text="name"
                        item-value="id"
                        label="Hotel"
                        placeholder="Hotel"
                        v-model="editedItem.hotelId"
                        outlined
                      ></v-select>
                    </v-col>

                    <v-col cols="6" sm="6" md="6">
                      <v-select
                        :items="types"
                        item-text="name"
                        item-value="name"
                        label="Meal Type"
                        placeholder="Meal Type"
                        v-model="editedItem.type"
                        outlined
                      ></v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Code"
                        v-model="editedItem.code"
                        placeholder="Code"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Available Pax (0)"
                        v-model="editedItem.availablePax"
                        placeholder="Available Pax (0)"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Total Pax (0)"
                        v-model="editedItem.totalPax"
                        placeholder="Total Pax (0)"
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
      .dispatch("fetchMealtype")
      .then(result => {
        this.mealtypes = result;
      })
      .catch(err => {
        console.log(err);
      });

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
      { text: "Package ID", value: "packageId" },
      { text: "Hotel", value: "hotelId" },
      { text: "Meal Type", value: "type" },
      { text: "Meal Code", value: "code" },
      { text: "Available Pax", value: "availablePax" },
      { text: "Total Pax", value: "totalPax" },
      { text: "Actions", value: "action", sortable: false }
    ],
    types: [
      {
        value: 1,
        name: "Breakfast"
      },
      {
        value: 2,
        name: "Lunch"
      },
      {
        value: 3,
        name: "High Tea"
      },
      {
        value: 4,
        name: "Dinner"
      },
      {
        value: 5,
        name: "Supper"
      }
    ],
    search: "",
    snackbar: false,
    top: true,
    right: true,
    mealtypes: [],
    hotels: [],
    packages: [],
    hotel: {},
    package: {},
    editedIndex: -1,
    selectedIndex: [],
    editedItem: {
      packageId: null,
      hotelId: null,
      code: null,
      type: "",
      availablePax: 0,
      totalPax: 0,
      companyId: null
    },
    text: "Horayy! Everything is working fine.",
    defaultItem: {
      packageId: null,
      hotelId: null,
      code: null,
      type: "",
      availablePax: 0,
      totalPax: 0,
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
      this.editedIndex = this.mealtypes.indexOf(item);
      this.editedItem = this.mealtypes[this.editedIndex];
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.mealtypes.indexOf(item);
      const x = confirm("Are you sure you want to delete this item?");
      if (x) {
        this.$store.dispatch("deleteMealtype", item);
        this.snackbar = true;
        this.message = "Mealtye deleted.";
      }
    },

    close() {
      this.dialog = false;

      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.snackbar = true;
        this.message = "Mealtye changes saved.";
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        this.$store.dispatch("updateMealtype", this.editedItem);
      } else {
        this.$store.dispatch("storeMealtype", this.editedItem);
      }

      this.close();
    }
  }
};
</script>