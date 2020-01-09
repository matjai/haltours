
<template >
  <v-container
    fluid
    :style="{
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundImage: companies.heroURL ? 'url(\'' +   companies.heroURL  + '\')' : 'url(\'' +  emptyImageUrl + '\')',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover'
    }"
  >
    <div v-if="companies" class="ma-10">
      <v-row class="pt-6">
        <v-col>
          <div class="text-center">
            <v-card class="mx-auto" max-width="400">
              <v-img
                class="white--text align-end"
                height="200px"
                :src="companies.logoURL? companies.logoURL : emptyImageUrl"
                @error="imgUrlAlt"
                contain
              >
                <v-card-title
                  style="text-shadow: 0 0 2px #000;
                    -moz-text-shadow: 0 0 2px #000;
                    -webkit-text-shadow: 0 0 2px #000;"
                  class="justify-center"
                >{{companies.name}}</v-card-title>
              </v-img>

              <v-card-subtitle class="pb-0">{{companies.countryID}}</v-card-subtitle>

              <v-card-text class="text--primary">
                <div>{{companies.phone_number}}</div>
              </v-card-text>

              <v-card-actions>
                <v-row align="center" justify="center">
                  <v-btn color="orange" text @click="aboutModal = !aboutModal">About</v-btn>
                </v-row>
              </v-card-actions>
            </v-card>
          </div>

          <v-dialog v-model="aboutModal" max-width="500px">
            <v-card min-width="400">
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text color="primary" @click="aboutModal = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-actions>
              <v-card-text>
                <strong class="title">{{companies.name}}</strong>
                <p>
                  <v-divider></v-divider>
                  {{companies.countryID}}
                </p>
                <p>{{companies.description}}</p>
                <p>
                  <strong>Address</strong>
                  : {{companies.address}}
                </p>
                <p>
                  <strong>Registration Number</strong>
                  : {{companies.registration_number}}
                </p>
                <p>
                  <strong>Phone Number</strong>
                  : {{companies.phone_number}}
                </p>
                <p>
                  <strong>Fax Number</strong>
                  : {{companies.fax_number}}
                </p>
                <p>
                  <strong>Website</strong>
                  : {{companies.website}}
                </p>
                <p>
                  <strong>Facebook</strong>
                  : {{companies.facebook}}
                </p>
                <p>
                  <strong>Instagram</strong>
                  : {{companies.instagram}}
                </p>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card class="pa-10">
            <destination />
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <staff />
      </v-row>
    </div>
  </v-container>
</template>
<script>
import firebase from "firebase";
import { v1 as uuid } from "uuid";
import displayStaff from "./ViewStaffByCompany";
import displayDestination from "./ViewDestinationByCompany";

export default {
  components: {
    staff: displayStaff,
    destination: displayDestination
  },
  data: () => ({
    emptyImageUrl:
      "https://firebasestorage.googleapis.com/v0/b/cikgumurnitravel-1c58c.appspot.com/o/image-not-available.jpg?alt=media&token=2ed2e48e-87c1-48c4-ba68-4889be8370b2",
    dialog: false,
    aboutModal: false,
    search: "",
    imageData: null,
    uploadValueOfLogo: 0,
    uploadValueOfHero: 0,
    logoIsUploading: false,
    heroIsUploading: false,
    staffs: [],
    imageid: null,
    snackbar: false,
    top: true,
    right: true,
    countries: [],
    companies: null,
    companyId: null,
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

  computed: {
    getCompanyLabels() {
      return this.$store.getters[("companies/getCompany", this.companyId)];
    },
    getCompany() {
      return (this.companies = this.$store.state.companies.object);
      console.log(this.companies);
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.companyId = this.$router.currentRoute.params.company;
    // this.$store.dispatch('fetchCompany', this.companyId);
    this.$store.dispatch("fetchStaffByCompanyID", this.companyId);
    // this.companies = this.$store.state.companies;
    this.initialize();
  },
  mounted() {
    this.companyId = this.$router.currentRoute.params.company;
    this.$store
      .dispatch("fetchCompanyByID", this.companyId)
      .then(async result => {
        result = result.data();
        this.companies = result;
        console.log(this.companies);
      })
      .catch(err => console.log(err));
  },

  methods: {
    initialize() {
      this.staffs = this.$store.state.staffs;
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
    },
    imgUrlAlt(event) {
      event.target.src = this.emptyImageUrl;
    }
  }
};
</script>