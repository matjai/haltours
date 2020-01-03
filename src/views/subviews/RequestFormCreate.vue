<template>
  <v-container fluid class="pa-2 mt-10">
    <v-layout>
      <v-flex>
        <v-card>
          <v-card-title></v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="6" xs="6">
                <v-text-field
                  label="Departure To"
                  prepend-inner-icon="mdi-airplane-takeoff"
                  placeholder="Departure To"
                  :readonly="!this.editMode"
                  :filled="!this.editMode"
                  :outlined="this.editMode"
                  v-model="defaultItem.departureTo"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6" xs="6">
                <v-text-field
                  label="Return From"
                  prepend-inner-icon="mdi-airplane-takeoff"
                  placeholder="Return From"
                  v-model="defaultItem.returnFrom"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-dialog
                  ref="dialog"
                  v-model="modal"
                  :return-value.sync="date"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="date"
                      label="Departure Date"
                      placeholder="Departure Date"
                      prepend-inner-icon="event"
                      outlined
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-dialog
                  ref="dialog"
                  v-model="returnModal"
                  :return-value.sync="defaultItem.returnDate"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="defaultItem.returnDate"
                      label="Return Date"
                      placeholder="Return Date"
                      prepend-inner-icon="event"
                      outlined
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="defaultItem.returnDate" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="returnModal = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>

              <v-col cols="12" sm="6" md="6" xs="6">
                <v-text-field
                  label="Number of Pax"
                  v-model="defaultItem.paxNo"
                  prepend-inner-icon="mdi-account-group-outline"
                  placeholder="Number of Pax"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6" xs="6">
                <v-text-field
                  label="Number of Night"
                  v-model="defaultItem.noOfNight"
                  placeholder="Number of Nights"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6" xs="6">
                <v-autocomplete
                  v-model="values"
                  :items="items"
                  outlined
                  chips
                  small-chips
                  label="Meal Types"
                  placeholder="Meal Types"
                  multiple
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6" md="6" xs="6">
                <v-text-field
                  label="Meal Remarks"
                  v-model="defaultItem.mealRemark"
                  placeholder="Meal Remarks"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6" xs="6">
                <v-autocomplete
                  v-model="values"
                  :items="items"
                  outlined
                  chips
                  small-chips
                  label="Destinations"
                  placeholder="Destinations"
                  multiple
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6" md="6" xs="6">
                <v-autocomplete
                  v-model="values"
                  :items="items"
                  outlined
                  chips
                  small-chips
                  label="Tour Options"
                  placeholder="Tour Options"
                  multiple
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="6" xs="6">
                <v-text-field
                  label="Tour Options Remarks"
                  placeholder="Tour Options Remarks"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-dialog
                  ref="dialog"
                  v-model="dueDateModal"
                  :return-value.sync="defaultItem.dueDate"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="defaultItem.dueDate"
                      label="Due Date"
                      placeholder="Due Date"
                      prepend-inner-icon="event"
                      outlined
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="defaultItem.dueDate" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="dueDateModal = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="save()" :disabled="isSubmit">
              <v-progress-circular size="20" indeterminate flat v-if="isSubmit"></v-progress-circular>Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="snackbar" top="top" absolute right="right" :type="type">
      {{ message }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import NotificationMixin from "../mixins/NotificationMixin";
import ValidationMixin from "../mixins/NotificationMixin";
export default {
  mixins: [ValidationMixin, NotificationMixin],
  created() {
    this.editMode = this.$router.currentRoute.query.edit ? true : false;
    this.$store.dispatch("requestForms/fetch");

    this.initialize();
  },
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      modal: false,
      isSubmit: false,
      editMode: false,
      defaultItem: {
        companyId: null,
        departureTo: null,
        departureDate: null,
        returnFrom: null,
        returnDate: null,
        paxNo: null,
        mealType: null,
        noOfNight: null,
        mealRemark: null,
        destination: null,
        tourOption: null,
        tourOptionRemark: null,
        requestorCompanyId: null,
        requestStaffId: null,
        requesteeCompanyId: null,
        requesteeStaffId: null,
        dueDate: null
      },
      departureModal: false,
      returnModal: false,
      dueDateModal: false,
      items: ["Type A", "Type B", "Type C", "Type D"],
      values: ["Type A", "Type B"],
      value: null
    };
  },
  methods: {
    initialize() {
      const companyId = this.$router.currentRoute.params.company;
      const recordId = this.$router.currentRoute.query.id;

      this.defaultItem.companyId = companyId;

      if (this.editMode) {
        //overlap our default item
        const item = this.$store.state.requestForms.data.filter(
          item => item.id == companyId
        );

        if (item[0]) {
          this.defaultItem = { ...this.defaultItem, ...item[0] };
          console.log(this.defaultItem);
        }
      }
    },
    save() {
      this.isSubmit = true;

      if (this.editMode) {
        this.$store
          .dispatch("requestForms/update", {
            id: this.recordId,
            data: this.defaultItem
          })
          .then(result => {
            this.isSubmit = false;
            this.showToast("Request from is saved.");
            setTimeout(() => {
              this.$router.go(-1);
            }, 2000);
          })
          .catch(error => {
            this.isSubmit = false;

            console.log(error);
          });
      } else if (!this.editMode) {
        this.isSubmit = true;

        this.$store
          .dispatch("requestForms/store", {
            company: this.$router.currentRoute.params.company,
            data: this.defaultItem
          })
          .then(result => {
            this.isSubmit = false;

            this.showToast("Request from is submitted.");
            setTimeout(() => {
              this.$router.go(-1);
            }, 2000);
          })
          .catch(error => {
            this.isSubmit = false;
            console.log(error);
          });
      }
    }
  }
};
</script>