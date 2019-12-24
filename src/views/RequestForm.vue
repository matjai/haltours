<template>
  <v-container fluid class="pa-2 mt-10">
    <v-layout>
      <v-flex>
        <div class="about d-block pa-2">
          <v-data-table
            :headers="headers"
            :items="requestForms.data"
            sort-by="calories"
            class="elevation-1"
            :loading="requestForms.loading"
            :search="search"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>Request Forms</v-toolbar-title>
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
                        <span class="headline" v-if="editedItem.name==null">New Request Form</span>
                        <span class="headline" v-if="editedItem.name!=null">{{editedItem.name}}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-select
                                color="primary"
                                :items="companies.data"
                                :loading="companies.loading"
                                item-text="name"
                                item-value="id"
                                v-model="selectedCompany"
                              ></v-select>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                        <v-btn color="blue darken-1" text @click="createForm">Start</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-spacer>
              </v-toolbar>
            </template>

            <template v-slot:item.action="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
              <v-icon small @click="deleteItem(item)">delete</v-icon>
            </template>
          </v-data-table>

          <div class="text-center ma-2">
            <v-snackbar v-model="snackbar" top="top" right="right" :type="type">
              {{ message }}
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
import NotificationMixin from "./mixins/NotificationMixin";
import CommonStateMixin from "./mixins/CommonStateMixin";

export default {
  mixins: [NotificationMixin, CommonStateMixin],
  created() {
    this.$store.dispatch("companies/fetch");
    this.$store.dispatch("attractions/fetch");
    this.$store.dispatch("requestForms/fetch");
    this.initialize();
  },

  data: () => ({
    dialog: false,
    search: "",
    selectedCompany: null,
    headers: [
      {
        align: "left",
        sortable: false
      },
      { text: "Departure To", value: "departureTo" },
      { text: "Departure Date", value: "departureDate" },
      { text: "Return From", value: "returnFrom" },
      { text: "Return Date", value: "returnDate" },
      { text: "Pax Number", value: "paxNo" },
      { text: "Destination", value: "mealRemark" },
      { text: "No of Night", value: "dateOfNight" },
      { text: "Destination", value: "destination" },
      { text: "Due Date", value: "dueDate" },
      { text: "Date Request", value: "dateRequest" },
      { text: "Date Request", value: "action" }
    ],
    top: true,
    right: true,
    countries: [],
    editedIndex: -1,
    selectedIndex: [],
    editedItem: {
      departureTo: null,
      departureDate: null,
      returnFrom: null,
      returnDate: null,
      paxNo: null,
      mealType: null,
      mealRemark: null,
      destination: null,
      tourOption: null,
      tourOptionRemark: null,
      dueDate: null,
      requestorCompanyId: null,
      requestStaffId: null,
      requesteeCompanyId: null,
      requesteeStaffId: null,
      dateRequest: null
    },
    defaultItem: {
      departureTo: null,
      departureDate: null,
      returnFrom: null,
      returnDate: null,
      paxNo: null,
      mealType: null,
      mealRemark: null,
      destination: null,
      tourOption: null,
      tourOptionRemark: null,
      dueDate: null,
      requestorCompanyId: null,
      requestStaffId: null,
      requesteeCompanyId: null,
      requesteeStaffId: null,
      dateRequest: null
    }
  }),
  methods: {
    initialize() {
      this.attractions = this.$store.state.attractions;
      this.companies = this.$store.state.companies;
      this.requestForms = this.$store.state.requestForms;

      console.log(this.requestForms);
    },
    createForm() {
      return this.$router.push({
        name: "requestFormsNew",
        params: { company: this.selectedCompany }
      });
    },
    indexSelected(item) {
      this.selectedIndex.push(item.id);
    },

    editItem(item) {
      this.editedIndex = this.requestForms.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.requestForms.data.indexOf(item);
      const x = confirm(
        "Are you sure you want to delete this attraction record?"
      );
      if (x) {
        //this.$store.dispatch("attractions/remove", item);
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
        Object.assign(this.requestF.data[this.editedIndex], this.editedItem);
        this.$store.dispatch("requestF/update", this.editedItem);
      } else {
        this.$store.dispatch("requestF/store", this.editedItem);
      }

      this.close();
    }
  },
  computed: {
    getCompanyLabels() {
      return this.$store.getters["companies/mapCompanyByCollectionId"];
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  }
};
</script>