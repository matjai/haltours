<template>
  <v-container fluid class="pa-2 mt-10">
    <v-layout>
      <v-flex>
        <div class="about d-block pa-2">
          <v-data-table
            :headers="headers"
            :items="attractions.data"
            sort-by="calories"
            class="elevation-1"
            :loading="attractions.loading"
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
                                :items="companies.data"
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
                                :items="destination"
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
                            <v-file-input
                              accept="image/*"
                              label="Image"
                              @change="onUploadHero($event)"
                              prepend-icon="mdi-camera"
                            ></v-file-input>
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
                        <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-spacer>
              </v-toolbar>
            </template>

            <template v-slot:item.companyID="{ item }">
              <p>{{companies.loading ? 'loading...' : getCompanyLabels[item.companyID] }}</p>
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
    <v-footer dark padless absolute>
      <v-card flat class="indigo lighten-1 white--text text-center" style="width: 100%;">
        <v-card-text>
          <v-btn v-for="icon in icons" :key="icon" class="mx-4 white--text" icon large>
            <v-icon large>{{ icon }}</v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">3 Tower Jalan Ampang 68000 Selangor Malaysia</v-card-text>
        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} —
          <strong>Haltours</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-container>
</template>


<script>
import firebase from "firebase";

export default {
  data: () => ({
    icons: ["mdi-facebook-box", "mdi-instagram", "mdi-youtube"],
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
    companiesLabel: {},
    destinationLabel: [],
    companies: null,
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
      return this.$store.getters["companies/mapCompanyByCollectionId"];
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.$store.dispatch("companies/fetch");
    this.$store.dispatch("attractions/fetch");
    this.initialize();
  },

  methods: {
    initialize() {
      this.attractions = this.$store.state.attractions;
      this.companies = this.$store.state.companies;

      this.destination = [
        {
          id: 1,
          name: "Terengganu"
        },
        {
          id: 2,
          name: "Kuala Terengganu"
        }
      ];
    },

    indexSelected(item) {
      this.selectedIndex.push(item.id);
    },

    editItem(item) {
      this.editedIndex = this.attractions.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.attractions.data.indexOf(item);
      const x = confirm(
        "Are you sure you want to delete this attraction record?"
      );
      if (x) {
        this.$store.dispatch("attractions/remove", item);
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

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.attractions.data[this.editedIndex], this.editedItem);
        this.$store.dispatch("attractions/update", this.editedItem);
      } else {
        this.$store.dispatch("attractions/store", this.editedItem);
      }

      this.close();
    },

    onUploadHero($event) {
      this.heroIsUploading = true;
      this.uploadValueOfHero = 0;
      this.imageData = event.target.files[0];
      const storageRef = firebase
        .storage()
        .ref(`${this.imageData.name}`)
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