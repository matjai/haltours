<template>

  <v-container fluid class="pa-2 mt-10">
    <v-layout>
      <v-flex>
        <div v-if="companies" class="about d-block pa-2">
          <v-data-table
            :headers="headers"
            :items="companies"
            sort-by="calories"
            class="elevation-1"
            :search="search"
          >
            <template v-slot:item.name="{ item }">
              <router-link :to="{ name: 'viewCompany',params:{company: item.id}}">{{item.name}}</router-link>

            </template>

            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>Company</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>

                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>

                <v-spacer>
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
                        <span class="headline" v-if="editedItem.name==null">New Company</span>
                        <span class="headline" v-if="editedItem.name!=null">{{editedItem.name}}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-text-field
                                color="primary"
                                v-if="companies.loading"
                                loading
                                disabled
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                label="Name"
                                v-model="editedItem.name"
                                placeholder="Name"
                                outlined
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                :items="listCountry"
                                item-text="name"
                                label="Countries"
                                item-value="id"
                                v-model="editedItem.countryID"
                                outlined
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                label="Registration Number"
                                v-model="editedItem.registration_number"
                                placeholder="Registration Number"
                                outlined
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                label="Phone Number"
                                v-model="editedItem.phone_number"
                                placeholder="Phone Number"
                                outlined
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                label="Fax Number"
                                v-model="editedItem.fax_number"
                                placeholder="Fax Number"
                                outlined
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                label="Website"
                                v-model="editedItem.website"
                                placeholder="Website"
                                outlined
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                label="Facebook"
                                v-model="editedItem.facebook"
                                placeholder="Facebook URL"
                                outlined
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                label="Instagram"
                                v-model="editedItem.instagram"
                                placeholder="Instagram URL"
                                outlined
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-card>
                                <div v-if="editedItem.logoURL!=null">
                                  <v-img
                                    :src="editedItem.logoURL"
                                    height="125"
                                    class="grey darken-4"
                                    contain
                                  ></v-img>
                                </div>
                                <v-file-input
                                  accept="image/*"
                                  label="Logo"
                                  @change="onUploadLogo($event)"
                                  prepend-icon="mdi-camera"
                                  :loading="logoIsUploading"
                                ></v-file-input>
                              </v-card>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-card>
                                <div v-if="editedItem.heroURL!=null">
                                  <v-img
                                    :src="editedItem.heroURL"
                                    height="125"
                                    class="grey darken-4"
                                    contain
                                  ></v-img>
                                </div>
                                <v-file-input
                                  accept="image/*"
                                  label="Image"
                                  @change="onUploadHero($event)"
                                  prepend-icon="mdi-camera"
                                  :loading="heroIsUploading"
                                ></v-file-input>
                              </v-card>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              <v-textarea outlined label="Address" v-model="editedItem.address"></v-textarea>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              <v-textarea
                                outlined
                                label="Description"
                                v-model="editedItem.description"
                              ></v-textarea>
                            </v-col>
                          </v-row>
                          <v-row>
                            <router-link :to="'/destinations/' + editedItem.id">Add Destination</router-link>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="saveCompany">Save</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-spacer>
              </v-toolbar>
            </template>
            <!-- <template v-slot:item.countryID="{ item }">
               {{countriesLabel[item.countryID]}}
            </template> -->

            <template v-slot:item.action="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
              <v-icon small @click="deleteItem(item)">delete</v-icon>
            </template>
            <!-- <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>-->
          </v-data-table>

          <div class="text-center ma-2">
            <v-snackbar v-model="snackbar" top="top" right="right">
              {{ text }}
              <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
            </v-snackbar>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import firebase from "firebase";
import { v1 as uuid } from 'uuid';

export default {
  data: () => ({
    companies:[],
    dialog: false,
    search: "",
    imageData: null,
    uploadValueOfLogo: 0,
    uploadValueOfHero: 0,
    logoIsUploading: false,
    heroIsUploading: false,

    headers: [
      {
        align: "left",
        sortable: false
      },
      { text: "id", value: "id" },
      { text: "Name", value: "name" },
      { text: "Registration Number", value: "registration_number" },
      { text: "Countries", value: "countryID" },
      { text: "Actions", value: "action", sortable: false }
    ],
    imageid: null,
    snackbar: false,
    top: true,
    right: true,
    countries: [],
    listCountry:[],
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
      countryID: null
    }
  }),

  computed: {},

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  mounted() {
    this.$store.dispatch('fetchCompany')
      .then(result => {
        this.companies = result;
        
      })
      .catch(err => console.log(err));

    this.$store.dispatch('bindCountry')
      .then(result => {
        this.listCountry = result.country
        console.log(this.listCountry)
      })
      .catch(err => console.log(err));
  },
  
  methods: {

    indexSelected(item) {
      this.selectedIndex.push(item.id); 
    },

    editItem(item) {
      this.editedIndex = this.companies.indexOf(item);
      this.editedItem = item;
      console.log(this.editedItem)
      this.dialog = true;
    },

    deleteItem(item) {
      const x = confirm("Are you sure you want to delete this company?");
      if (x) {
        this.$store.dispatch('deleteCompany', item.id);
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

    saveCompany(){
      if (this.editedIndex > -1) {
        Object.assign(this.companies[this.editedIndex], this.editedItem);
        this.$store.dispatch('updateCompany', this.editedItem)
        .then(result => {
          console.log("Company info updated")
        })
        .catch(err => console.log(err));

      } else {
        this.$store.dispatch('storeCompany', this.editedItem)
        .then(result => {
          console.log("New company info stored")
        })
        .catch(err => console.log(err));
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