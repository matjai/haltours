
<template>


  <v-container fluid>
    <v-card
    
    class="mx-auto"
    height="250"
    tile
    :loading="companies.loading"
  >
    <v-img
      height="100%"
      :src="getCompany.heroURL"
    >
      <v-row
        align="end"
        class="fill-height"
      >
        <v-col
          align-self="start"
          class="pa-0"
          cols="12"
        >
            <v-hover>
                <template v-slot="{ hover }">
                    <v-card
                    :elevation="hover ? 24 : 6"
                    class="pa-2 ma-6"
                    width="180"
                    height="180"
                    
                    >
                    <v-avatar
                    class="profile mx-auto"
                    color="grey"
                    size="164"
                    tile
                    >
                    <v-img :src="getCompany.logoURL" ></v-img>
                    </v-avatar>
                    </v-card>
                </template>
            </v-hover>
        </v-col>
       
      </v-row>
    </v-img>
  </v-card>
  <v-row class ="pt-6">
   <v-col md="auto">
        <v-list-item
        >
        <v-list-item-content>
            <v-list-item-title>{{getCompany.name}}</v-list-item-title>
            <v-list-item-subtitle>{{getCompany.countryID}} </v-list-item-subtitle>
        </v-list-item-content>
        </v-list-item>
    </v-col>
    <v-col class="py-0">
        <v-card>
            <v-tabs
            background-color="white"
            color="deep-purple accent-4"
            left
            >
                <v-tab>Landscape</v-tab>
                <v-tab>City</v-tab>
                <v-tab>Abstract</v-tab>
                <v-tab-item>{{component}}
                </v-tab-item>
            </v-tabs>
        </v-card>
    </v-col>
  </v-row>
  <v-icon x-large color="blue darken-2" h>mdi-facebook-box</v-icon>
  <v-icon x-large color="red darken-2">mdi-instagram</v-icon>
  </v-container>
</template>
<script>
import firebase from "firebase";
import { v1 as uuid } from 'uuid';
import Company from "./views/Company";

export default {
  data: () => ({
    component: Company,
    dialog: false,
    search: "",
    imageData: null,
    uploadValueOfLogo: 0,
    uploadValueOfHero: 0,
    logoIsUploading: false,
    heroIsUploading: false,

    imageid: null,
    snackbar: false,
    top: true,
    right: true,
    countries: [],
    companyId:null,
    editedIndex: -1,
    selectedIndex: [],
    editedItem: {
      name: null,
      description: "",
      registration_number: null,
      address: null,
      phone_number: null,
      fax_number: null,
      website: null,
      facebook: null,
      instagram: null,
      logoURL: null,
      heroURL: null,
      countryID: null
    },
    text: "This is notification!.",
    defaultItem: {
      name: "",
      description: "",
      registration_number: null,
      address: null,
      phone_number: null,
      fax_number: null,
      website: null,
      facebook: null,
      instagram: null,
      logoURL: null,
      heroURL: null,
      countryID: null,
      
    }
  }),

  computed: {
    getCompanyLabels() {
      return this.$store.getters["companies/getCompany",this.companyId];
    },
    getCompany() {
        return this.companies = this.$store.state.companies.object;
        console.log(this.companies)
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.companyId = this.$router.currentRoute.params.company;
    this.$store.dispatch("companies/getCompanyByID",this.companyId);
    this.companies = this.$store.state.companies;
    this.initialize();
    
  },

  methods: {
    initialize() {
      this.countries = [
        {
          id: 1,
          name: "Malaysia"
        },
        {
          id: 2,
          name: "Indonesia"
        }
      ];
      
    },

    indexSelected(item) {
      this.selectedIndex.push(item.id);
    },

    editItem(item) {
      this.editedIndex = this.companies.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.companies.data.indexOf(item);
      const x = confirm("Are you sure you want to delete this company?");
      if (x) {
        this.$store.dispatch("companies/remove", item);
        this.snackbar = true;
      }
    },

    close() {
      this.dialog = false;
      this.imageData = null;
      this.uploadValueOfLogo = 0;
      this.uploadValueOfHero = 0;
      this.logoIsUploading = false;
      this.heroIsUploading = false;

      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.snackbar = true;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.companies.data[this.editedIndex], this.editedItem);
        this.$store.dispatch("companies/update", this.editedItem);
      } else {
        this.$store.dispatch("companies/store", this.editedItem);
      }

      this.close();
    },

    onUploadLogo($event) {
      this.imageid = uuid();
      this.logoIsUploading = true;
      this.uploadValueOfLogo = 0;
      this.imageData = event.target.files[0];
      const storageRef = firebase
        .storage()
        .ref(`companies/${this.editedItem.id}/${this.imageid}`)
        .put(this.imageData);
      storageRef.on(
        `state_changed`,
        snapshot => {
          this.uploadValueOfLogo =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        error => {
          console.log(error.message);
        },
        () => {
          this.uploadValueOfLogo = 100;
          storageRef.snapshot.ref.getDownloadURL().then(url => {
            this.editedItem.logoURL = url;
            this.logoIsUploading = false;
          });
        }
      );
    },

    onUploadHero($event) {
      this.imageid = uuid();
      this.heroIsUploading = true;
      this.uploadValueOfHero = 0;
      this.imageData = event.target.files[0];
      const storageRef = firebase
        .storage()
        .ref(`companies/${this.editedItem.id}/${this.imageid}`)
        .put(this.imageData);
      storageRef.on(
        `state_changed`,
        snapshot => {
          this.uploadValueOfHero =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        error => {
          console.log(error.message);
        },
        () => {
          this.uploadValueOfHero = 100;
          storageRef.snapshot.ref.getDownloadURL().then(url => {
            this.editedItem.heroURL = url;
            this.heroIsUploading = false;
          });
        }
      );
    }
  }
};
</script>