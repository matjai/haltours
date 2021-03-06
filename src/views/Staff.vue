<template>
  <v-container fluid class="pa-2 mt-10">
    <!-- <h2 class="font-weight-bold">Staffs Management</h2> -->
    <v-data-table
      :headers="headers"
      :items="staffs"
      sort-by="calories"
      class="elevation-1"
      :loading="staffs == null"
    >
      <template v-slot:item.avatar="{ item }">
        <div style="padding:1em;">
          <v-avatar size="62">
            <img alt="Avatar" :src="item.avatar" />
          </v-avatar>
        </div>
      </template>

      <template v-slot:item.name="{ item }">
        <router-link
          :to="{name:'staff',params:{company:item.companyId,staff:item.id}}"
        >{{ item.name }}</router-link>
      </template>

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Staffs Management</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>

          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="800px">
            <template v-slot:activator="{ on }">
              <v-fab-transition>
                <v-btn color="pink" v-on="on" dark absolute top right fab>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-fab-transition>
              <!-- <v-btn color="primary" dark class="mb-2" New Staff</v-btn> -->
            </template>
            <v-card>
              <v-card-title>
                <span class="headline"></span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12 d-flex justify-center">
                      <v-avatar class="profile" color="grey" size="164">
                        <v-img :src="editedItem.avatar"></v-img>
                      </v-avatar>
                    </v-col>
                    <v-col cols="12">
                      <v-file-input
                        :rules="rules"
                        accept="image/png, image/jpeg, image/bmp"
                        placeholder="Pick an avatar"
                        prepend-icon="mdi-camera"
                        :loading="imageIsUploading"
                        @change="onImageUpload($event)"
                        label="Avatar"
                      ></v-file-input>
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
                        item-value="name"
                        label="Department"
                        v-model="editedItem.department"
                        outlined
                      ></v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        :items="positions"
                        item-text="name"
                        item-value="name"
                        label="Position"
                        v-model="editedItem.position"
                        outlined
                      ></v-select>
                    </v-col>

                    <v-col cols="6" sm="6" md="6">
                      <v-select
                        :items="roles"
                        item-text="name"
                        item-value="name"
                        label="Access Roles"
                        v-model="editedItem.roles"
                        outlined
                      ></v-select>
                    </v-col>

                    <v-col cols="6" sm="6" md="6">
                      <v-select
                        :items="companies"
                        item-text="name"
                        item-value="id"
                        label="Company"
                        placeholder="Company"
                        v-model="editedItem.companyId"
                        outlined
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

      <template v-slot:item.roles="{ item }">
        <v-chip class="ma-2 text-center justify-center" color="primary" pill>{{ item.roles }}</v-chip>
      </template>

      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
        <v-icon small @click="deleteItem(item)">delete</v-icon>
      </template>
    </v-data-table>

    <!--
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar" top="top" right="right">
        {{ text }}
        <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
    -->
  </v-container>
</template>

<script>
import firebase from "firebase/firebase";
import CreateDestination from "./CreateDestination";

export default {
  components: {
    destination: CreateDestination
  },
  data: () => ({
    dialog: false,
    rules: [
      value =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!"
    ],
    headers: [
      {
        value: "avatar",
        align: "left",
        sortable: false
      },
      { text: "Name", value: "name" },
      { text: "Staff ID", value: "staffId" },
      { text: "Mobile", value: "mobile" },
      { text: "Position", value: "position" },
      { text: "Department", value: "department" },
      { text: "Roles", value: "roles" },
      { text: "Actions", value: "action", sortable: false }
    ],
    search: "",
    snackbar: false,
    top: true,
    right: true,
    imageIsUploading: false,
    imageData: null,
    positions: [],
    departments: [],
    staffs: [],
    roles: [],
    companies: [],
    editedIndex: -1,
    selectedIndex: [],
    editedItem: {
      name: "",
      mobile: "",
      email: "",
      position: null,
      department: null,
      companyId: null,
      roles: null,
      company: null
    },
    text: "This is notification!.",
    defaultItem: {
      name: "",
      mobile: "",
      email: "",
      position: null,
      department: null,
      roles: null,
      companyId: null,
      company: null
    }
  }),

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  mounted() {
    this.initialize();

    this.$store
      .dispatch("fetchStaff")
      .then(result => {
        console.log(result);

        this.staffs = result;
      })
      .catch(err => {
        console.log(err);
      });

    this.$store
      .dispatch("fetchCompany")
      .then(result => {
        this.companies = result;
      })
      .catch(err => {
        console.log(err);
      });
  },

  methods: {
    initialize() {
      this.departments = [
        {
          name: "Executive"
        },
        {
          name: "Management"
        }
      ];

      this.positions = [
        {
          name: "Engineer"
        },
        {
          name: "Manager"
        }
      ];

      this.roles = [
        {
          name: "Staff"
        },
        {
          name: "Technical"
        },
        {
          name: "Branch"
        }
      ];
    },
    getCompany(id) {
      return this.$store.dispatch("fetchCompanyByID", id);
    },

    indexSelected(item) {
      this.selectedIndex.push(item.id);
    },

    onImageUpload($event) {
      if (event.target.files[0] != undefined) {
        this.imageIsUploading = true;
        this.imageData = event.target.files[0];
        const storageRef = firebase
          .storage()
          .ref(`${this.imageData.name}`)
          .put(this.imageData);

        storageRef.on(
          `state_changed`,
          snapshot => {},
          error => {
            this.imageIsUploading = false;
          },
          () => {
            storageRef.snapshot.ref.getDownloadURL().then(url => {
              this.editedItem.avatar = url;
              this.imageIsUploading = false;
            });
          }
        );
      }
    },

    editItem(item) {
      this.editedIndex = this.staffs.indexOf(item);
      this.editedItem = this.staffs[this.editedIndex];
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.staffs.indexOf(item);
      const x = confirm("Are you sure you want to delete this item?");
      if (x) {
        this.$store.dispatch("deleteStaff", item);
        this.snackbar = true;
      }
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
        this.$store.dispatch("updateStaff", this.editedItem);
      } else {
        this.$store.dispatch("storeStaff", this.editedItem);
      }

      this.close();
    }
  }
};
</script>