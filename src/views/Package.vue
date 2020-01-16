<template>
  <v-container fluid class="pa-2 mt-10">
    <v-data-table
      :headers="headers"
      :items="packages"
      sort-by="calories"
      class="elevation-1"
      :loading="destinations == null"
      :search="search"
    >
      <template v-slot:item.name="{ item }">
        <router-link
          :to="{name:'packageDetail',params:{companyID:companyID,packageID:item.id}}"
        >{{ item.name }}</router-link>
      </template>

      <template v-slot:item.destination="{ item }" v-if="destinations != null">
        <span v-for="(d,k) in item.destination" :key="k">
          <v-chip>{{ destinations[d].name }}</v-chip>
        </span>
      </template>

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Package Management</v-toolbar-title>
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
                <packageView
                  :packageObject="editedItem"
                  :editMode="editMode"
                  @closeModal="updateMessage"
                />
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
import packageView from "./subviews/PackageView";
import _ from "lodash";

export default {
  components: {
    packageView: packageView
  },
  data: () => ({
    dialog: false,
    editMode: false,
    headers: [
      { text: "Package Name", value: "name" },
      { text: "Destination", value: "destination" },
      { text: "Total Days", value: "days" },
      { text: "Total Pax", value: "totalPax" },
      { text: "Actions", value: "action", sortable: false }
    ],
    search: "",
    companyID: null,
    snackbar: false,
    top: true,
    right: true,
    packages: [],
    editedIndex: -1,
    selectedIndex: [],
    destinations: null,
    editedItem: {
      name: null,
      companyID: null,
      country: [],
      destination: [],
      days: null,
      tipping: null,
      exchangeRate: null,
      highlight: null,
      totalPax:  null
    },
    text: "This is notification!.",
    defaultItem: {
      name: null,
      country: [],
      destination: [],
      days: null,
      tipping: null,
      exchangeRate: null,
      highlight: null,
      totalPax:  null
    }
  }),

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.companyID = this.$router.currentRoute.params.companyID;
    this.$store
      .dispatch("fetchPackageByCompanyID", this.companyID)
      .then(async result => {
        this.packages = result;
        const _destinationList = {};
        const getDestinations = await this.$store.dispatch(
          "getAllDestinations"
        );

        this.destinations = {};
        getDestinations.forEach(item => {
          const keys = Object.keys(item);
          keys.map(k => (this.destinations[k] = item[k]));
        });
      })
      .catch(err => {
        console.log(err);
      });
  },

  methods: {
    initialize() {},
    editItem(item) {
      this.editedIndex = this.packages.indexOf(item);
      this.editedItem = item;
      this.editMode = true;
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.packages.indexOf(item);
      const x = confirm("Are you sure you want to delete this item?");
      if (x) {
        this.$store.dispatch("deletePackage", item);
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