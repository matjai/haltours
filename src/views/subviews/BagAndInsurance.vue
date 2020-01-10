<template>

  <v-container fluid class="pa-2 mt-10">
      
    <v-data-table
      :headers="headers"
      :items="bagAndInsurances"
      sort-by="calories"
      class="elevation-1"
      :loading="bagAndInsurances == null"
      :search="search"
    >

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Bag And Insurances Management</v-toolbar-title>
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
                <bagAndInsuranceView :bagAndInsuranceObject="editedItem" :editMode="editMode" @closeModal="updateMessage"/>
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
import bagAndInsuranceView from "./BagAndInsuranceView";
export default {
    components:{
        bagAndInsuranceView: bagAndInsuranceView
    },
  data: () => ({
    dialog: false,
    dialog2: false,
    editMode: false,
    headers: [
      { text: "Package ID", value: "packageID" },
      { text: "Description", value: "description" },
      { text: "Price", value: "price" },
      { text: "Actions", value: "action", sortable: false }
    ],
    search: "",
    companyId:null,
    snackbar: false,
    top: true,
    right: true,
    bagAndInsurances: [],
    editedIndex: -1,
    packages: [],
    selectedIndex: [],
    editedItem: {
      packageID: null,
      description: null,
      companyID: null,
      price: 0
    },
    text: "This is notification!.",
    defaultItem: {
      packageID: null,
      description: null,
      companyID: null,
      price: 0
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
      .dispatch("fetchBagAndInsuranceByCompanyID",this.companyId)
      .then(result => {
        console.log(result);

        this.bagAndInsurances = result;
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
      this.editedIndex = this.bagAndInsurances.indexOf(item);
      this.editedItem = item;
      this.editMode = true;
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.bagAndInsurances.indexOf(item);
      const x = confirm("Are you sure you want to delete this item?");
      if (x) {
        this.$store.dispatch("deleteBagAndInsurance", item);
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
        Object.assign(this.bagAndInsurances[this.editedIndex], this.editedItem);
        this.$store.dispatch("updateBagAndInsurance", this.editedItem);
      } else {
        this.editedItem.companyID = this.companyId;
        this.$store.dispatch("storeBagAndInsurance", this.editedItem);
      }

      this.close();
    },
    updateMessage(variable) {
      this.dialog= variable;
    }
  }
};
</script>