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
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6" xs="6">
                <v-text-field
                  label="Return From"
                  prepend-inner-icon="mdi-airplane-takeoff"
                  placeholder="Return From"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-dialog
                  ref="dialog"
                  v-model="departureModal"
                  :return-value.sync="departureDate"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="departureDate"
                      label="Departure Date"
                      placeholder="Departure Date"
                      prepend-inner-icon="event"
                      outlined
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="departureDate" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="departureModal = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-dialog
                  ref="dialog"
                  v-model="returnModal"
                  :return-value.sync="returnDate"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="returnDate"
                      label="Return Date"
                      placeholder="Return Date"
                      prepend-inner-icon="event"
                      outlined
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="returnDate" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="returnModal = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>

              <v-col cols="12" sm="6" md="6" xs="6">
                <v-text-field
                  label="Number of Pax"
                  prepend-inner-icon="mdi-account-group-outline"
                  placeholder="Number of Pax"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6" xs="6">
                <v-text-field label="Number of Night" placeholder="Number of Nights" outlined></v-text-field>
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
                <v-text-field label="Meal Remarks" placeholder="Meal Remarks" outlined></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6" xs="6">
                <v-text-field label="Destinations" placeholder="Destinations" outlined></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6" xs="6">
                <v-text-field label="Tour Options" placeholder="Tour Options" outlined></v-text-field>
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
                  :return-value.sync="dueDate"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="dueDate"
                      label="Due Date"
                      placeholder="Due Date"
                      prepend-inner-icon="event"
                      outlined
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="dueDate" scrollable>
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
            <v-btn color="primary" @click="submit">Submit</v-btn>
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
  data() {
    return {
      departureModal: false,
      returnModal: false,
      departureDate: null,
      returnDate: null,
      dueDateModal: false,
      dueDate: null,
      items: ["foo", "bar", "fizz", "buzz"],
      values: ["foo", "bar"],
      value: null
    };
  },
  methods: {
    submit() {
      this.showToast("submit complex form");
    }
  }
};
</script>