<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <h2 v-if="editMode">Manage Tour Leader</h2>
        <h2 v-else>Create Tour Leader</h2>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-select
          :items="packages"
          item-text="name"
          item-value="id"
          label="Package ID"
          v-model="tourLeader.packageID"
          outlined
        ></v-select>
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <v-text-field
          label="Description"
          v-model="tourLeader.description"
          placeholder="Description"
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          label="Price"
          v-model="tourLeader.price"
          placeholder="Price"
          outlined
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="12" sm="12" class="pa-4">
        <v-btn color="pink" style="margin-left: 1rem;" @click="save" dark right>Save</v-btn>
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
    dessets: [],
    companyID: null,
    snackbar: false,
    top: true,
    right: true,
    tourLeader: {},
    editedIndex: -1,
    packages: [],
    selectedIndex: [],
    text: "This is notification!.",

  }),

  watch: {
    dialog(val) {
      val || this.close();
    },

    tourLeaderObject: function () {
      this.tourLeader= this.tourLeaderObject;
    },
    editMode: function(){
      console.log(this.editMode)
    }
  },
  props: {
    tourLeaderObject: Object,
    editMode: Boolean
  },
  mounted() {
    this.initialize();
    this.$store.dispatch('fetchPackage')
      .then(result => {
        this.packages = result;
        
      })
      .catch(err => console.log(err));
    this.companyID = this.$router.currentRoute.params.companyID;
  },
  methods: {
    initialize() {
      
        this.tourLeader = this.tourLeaderObject;
      
    },

    save() {
      this.tourLeader.packageName = this.packages.find(element => element.id == this.tourLeader.packageID).name;
      
      if(this.editMode){
        this.$store.dispatch("updateTourLeader", this.tourLeader);
      }
      else{
        this.tourLeader.companyID= this.companyID;
        this.$store.dispatch("storeTourLeader", this.tourLeader);
      }
      this.$emit("closeModal", false);
    }
  }
};
</script>