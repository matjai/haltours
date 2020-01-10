<template>

  <v-container fluid class="pa-2 mt-10">
      
    <v-data-table
      :headers="headers"
      :items="packages"
      sort-by="calories"
      class="elevation-1"
      :loading="packages == null"
      :search="search"
    >

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
                <packageView :packageObject="editedItem" :editMode="editMode" @closeModal="updateMessage"/>
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
export default {
    components:{
        packageView: packageView
    },
  data: () => ({
    dialog: false,
    editMode: false,
    headers: [
      { text: "Package Name", value: "name" },
      { text: "Destination", value: "destination" },
      { text: "Total Days", value: "days" },
      { text: "Actions", value: "action", sortable: false }
    ],
    search: "",
    companyId:null,
    snackbar: false,
    top: true,
    right: true,
    packages: [],
    editedIndex: -1,
    selectedIndex: [],
    editedItem: {
        name: null,
        companyID: null,
        country: [],
        destination:[],
        days: null,
        tipping: null,
        exchangeRate: null
    },
    text: "This is notification!.",
    defaultItem: {
        name: null,
        country: [],
        destination:[],
        days: null,
        tipping: null,
        exchangeRate: null
    }
  }),

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  mounted() {
    this.companyId = this.$router.currentRoute.params.companyId;
    this.$store
      .dispatch("fetchPackageByCompanyID",this.companyId)
      .then(result => {
        console.log(result);

        this.packages = result;
      })
      .catch(err => {
        console.log(err);
      });
  },

  methods: {

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

    updateMessage(variable) {
      this.dialog= variable;
    }
  }
};
</script>