<template>
  <div class="about d-block pa-2">
    <v-data-table
      :headers="headers"
      :items="staffs.data"
      sort-by="calories"
      class="elevation-1"
      :loading="staffs.loading"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Staff</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="800px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">New Staff</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline"></span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field color="primary" v-if="staffs.loading" loading disabled></v-text-field>
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
                        label="Mobile"
                        v-model="editedItem.mobile"
                        placeholder="Mobile"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Staff ID"
                        v-model="editedItem.staffId"
                        placeholder="Employee ID"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Email"
                        v-model="editedItem.email"
                        placeholder="Email"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        :items="departments"
                        item-text="name"
                        label="Department"
                        v-model="editedItem.department"
                        outlined
                        return-object
                      ></v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        :items="positions"
                        item-text="name"
                        label="Position"
                        v-model="editedItem.position"
                        outlined
                        return-object
                      ></v-select>
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
        </v-toolbar>
      </template>

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
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        align: "left",
        sortable: false
      },
      { text: "Name", value: "name" },
      { text: "Staff ID", value: "staffId" },
      { text: "Mobile", value: "mobile" },
      { text: "Position", value: "position.name" },
      { text: "Department", value: "department.name" },
      { text: "Actions", value: "action", sortable: false }
    ],
    snackbar: false,
    top: true,
    right: true,
    positions: [],
    departments: [],
    staffs: {},
    editedIndex: -1,
    selectedIndex: [],
    editedItem: {
      name: "",
      mobile: "",
      email: "",
      position: null,
      department: null
    },
    text: "This is notification!.",
    defaultItem: {
      name: "",
      mobile: "",
      email: "",
      position: null,
      department: null
    }
  }),

  computed: {},

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.$store.dispatch("fetch").staffs;
    this.initialize();
  },
  methods: {
    initialize() {
      this.staffs = this.$store.state.staffs;
      (this.departments = [
        {
          name: "Executive"
        },
        {
          name: "Management"
        }
      ]),
        (this.positions = [
          {
            name: "Engineer"
          },
          {
            name: "Manager"
          }
        ]);
    },

    indexSelected(item) {
      this.selectedIndex.push(item.id);
    },
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.desserts.indexOf(item);
      //confirm("Are you sure you want to delete this item?") &&
      //this.staffs.splice(index, 1);
    },

    close() {
      this.dialog = false;

      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.snackbar = true;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.staffs[this.editedIndex], this.editedItem);
      } else {
        this.$store.dispatch("store", this.editedItem).staffs;
      }

      this.close();
    }
  }
};
</script>