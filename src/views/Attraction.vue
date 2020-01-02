<template>
  <v-container fluid class="pa-2 mt-10">
    <v-layout>
      <v-flex>
        <div v-if="attractions" class="about d-block pa-2">
          <v-data-table
            :headers="headers"
            :items="attractions"
            sort-by="calories"
            class="elevation-1"
            :search="search"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>Attraction</v-toolbar-title>
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
                        <span class="headline" v-if="editedItem.name==null">New Attraction</span>
                        <span class="headline" v-if="editedItem.name!=null">{{editedItem.name}}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-text-field
                                color="primary"
                                v-if="attractions.loading"
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
                              <v-text-field
                                label="Alternate Name"
                                v-model="editedItem.alternate_name"
                                placeholder="Alternate Name"
                                outlined
                              ></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                :items="companies"
                                item-text="name"
                                label="Company"
                                item-value="id"
                                v-model="editedItem.companyID"
                                @change="testClick($event)"
                                outlined
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                :items="destinations"
                                item-text="name"
                                label="Destination"
                                item-value="id"
                                v-model="editedItem.destinationID"
                                outlined
                              ></v-select>
                            </v-col>
                          </v-row>

                          <v-row>
                            <div v-if="editedItem.heroURL!=null">
                              <v-img
                                :src="editedItem.heroURL"
                                height="125"
                                class="grey darken-4"
                                contain
                              ></v-img>
                            </div>
                            
                          </v-row>
                          <v-row>
                            <v-file-input
                              accept="image/*"
                              label="Image"
                              @change="onUploadHero($event)"
                              prepend-icon="mdi-camera"
                            ></v-file-input>
                            
                          </v-row>
                          <v-row>
                            <div v-if="heroIsUploading">
                              <p>
                                <progress id="progress" :value="uploadValueOfHero" max="100"></progress>
                                {{uploadValueOfHero.toFixed()+"%"}}
                              </p>
                            </div>
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
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="saveAttraction">Save</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-spacer>
              </v-toolbar>
            </template>

            <!-- <template v-slot:item.companyID="{ item }">
              <p>{{companies.loading ? 'loading...' : getCompanyLabels[item.companyID] }}</p>
            </template> -->
            <template v-if ="companies" v-slot:item.companyID="{ item }">
              {{companiesLabel[item.companyID] }}
            </template>

            <template v-slot:item.destinationID="{ item }">{{destinationLabel[item.destinationID]}}</template>

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
    dialog: false,
    search: "",
    imageData: null,
    uploadValueOfHero: 0,
    heroIsUploading: false,
    headers: [
      {
        align: "left",
        sortable: false
      },
      { text: "Name", value: "name" },
      { text: "Description", value: "description" },
      { text: "Company", value: "companyID" },
      { text: "Destination", value: "destinationID" },
      { text: "Actions", value: "action", sortable: false }
    ],
    imageid: null,
    attractions:[],
    destinations:[],
    companiesLabel: [],
    destinationLabel: [],
    companies: [],
    snackbar: false,
    top: true,
    right: true,
    countries: [],
    editedIndex: -1,
    selectedIndex: [],
    editedItem: {
      name: null,
      alternate_name: null,
      description: "",
      companyID: null,
      destinationID: null,
      heroURL: null
    },
    text: "This is notification!.",
    defaultItem: {
      name: null,
      alternate_name: null,
      description: "",
      companyID: null,
      destinationID: null,
      heroURL: null
    }
  }),

  computed: {
    getCompanyLabels() {
      return this.$store.getters["companiesV2/mapCompanyByCollectionId"];
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  mounted() {
    this.$store.dispatch('fetchCompany')
      .then(result => {
        this.companies = result;
        result.forEach(data => {
          this.companiesLabel[data.id] = data.name;
        });

        console.log("companies",this.companies)
        
      })
      .catch(err => console.log(err));
    
    this.$store.dispatch('fetchAttraction')
      .then(result => {
        this.attractions = result;
      })
      .catch(err => console.log(err));

    this.$store.dispatch('getAllDestinations')
      .then(result => {
        result.forEach(data => {
          for (var value in data) {
            var destination = data[value];
            destination.id = value;
            this.destinations.push(destination);
            this.destinationLabel[value] = data[value].name;
          }
        });
        
      })
      .catch(err => console.log(err));
  },

  methods: {

    indexSelected(item) {
      this.selectedIndex.push(item.id);
    },

    editItem(item) {
      this.editedIndex = this.attractions.indexOf(item);
      this.editedItem =item;
      this.dialog = true;
    },

    deleteItem(item) {
      const x = confirm("Are you sure you want to delete this company?");
      if (x) {
        this.$store.dispatch('deleteAttraction', item.id);
        this.snackbar = true;
      }
    },

    close() {
      this.dialog = false;
      this.imageData = null;
      this.uploadValueOfHero = 0;
      this.heroIsUploading = false;

      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.snackbar = true;
      }, 300);
    },

    saveAttraction(){
      if (this.editedIndex > -1) {
        Object.assign(this.attractions[this.editedIndex], this.editedItem);
        this.$store.dispatch('updateAttraction', [this.editedItem.id, this.editedItem])
        .then(result => {
          console.log("Attraction info updated")
        })
        .catch(err => console.log(err));

      } else {
        this.$store.dispatch('storeAttraction', [this.editedItem.id, this.editedItem])
        .then(result => {
          console.log("New attraction info stored")
        })
        .catch(err => console.log(err));
      }

      this.close();

    },

    onUploadHero($event) {
      this.imageid = uuid();
      this.heroIsUploading = true;
      this.uploadValueOfHero = 0;
      this.imageData = event.target.files[0];
      const storageRef = firebase
        .storage()
        .ref(`attractions/${this.editedItem.id}/${this.imageid}`)
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
    },

    testClick($event) {
      console.log(this.editedItem);
    }
  }
};
</script>