<template>
  <v-container fluid class="pa-0">
    <v-toolbar flat>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Haltours Destination Management</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn text>ABOUT US</v-btn>
        <v-btn text>CONTACT</v-btn>
        <v-btn text>SOCIALS</v-btn>
      </v-toolbar-items>
      <v-btn icon to="/login">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-toolbar>
    <v-layout>
      <v-flex>
        <div class="about d-block pa-2">
          <v-data-table
            :headers="headers"
            :items="companies.data"
            sort-by="calories"
            class="elevation-1"
            :loading="companies.loading"
            :search="search"
          >
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
                                :items="countries"
                                item-text="name"
                                label="Countries"
                                v-model="editedItem.country"
                                outlined
                                return-object
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
                                ></v-file-input>
                                <div v-if="logoIsUploading">
                                  <p>
                                    <progress id="progress" :value="uploadValueOfLogo" max="100"></progress>
                                    {{uploadValueOfLogo.toFixed()+"%"}}
                                  </p>
                                </div>
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
                                ></v-file-input>
                                <div v-if="heroIsUploading">
                                  <p>
                                    <progress id="progress" :value="uploadValueOfHero" max="100"></progress>
                                    {{uploadValueOfHero.toFixed()+"%"}}
                                  </p>
                                </div>
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

            <template v-slot:item.action="{ item }" style="padding:2em;">
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
    uploadValueOfLogo: 0,
    uploadValueOfHero: 0,
    logoIsUploading: false,
    heroIsUploading: false,

    headers: [
      {
        align: "left",
        sortable: false
      },
      { text: "Name", value: "name" },
      { text: "Description", value: "description" },
      { text: "Countries", value: "country.name" },
      { text: "Actions", value: "action", sortable: false }
    ],
    snackbar: false,
    top: true,
    right: true,
    countries: [],
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
      country: null
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
      country: null
    }
  }),

  computed: {},

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.$store.dispatch("fetch").companies;
    this.initialize();
  },

  methods: {
    initialize() {
      this.companies = this.$store.state.companies;

      console.log(this.companies);

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
      console.log(this.editedItem);
    },

    deleteItem(item) {
      const index = this.companies.data.indexOf(item);
      const x = confirm("Are you sure you want to delete this company?");
      if (x) {
        this.$store.dispatch("remove", item).companies;
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
        this.$store.dispatch("update", this.editedItem).companies;
      } else {
        this.$store.dispatch("store", this.editedItem).companies;
      }

      this.close();
    },

    onUploadLogo($event) {
      this.logoIsUploading = true;
      this.uploadValueOfLogo = 0;
      this.imageData = event.target.files[0];
      const storageRef = firebase
        .storage()
        .ref(`${this.imageData.name}`)
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
    }
  }
};
</script>