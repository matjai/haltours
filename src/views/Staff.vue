<template>
  <div class="about d-block pa-2 container-fluid" style="margin-top:2em;">
    <!-- <h2 class="font-weight-bold">Staffs Management</h2> -->

    <v-data-table
      :headers="headers"
      :items="staffs.data"
      sort-by="calories"
      class="elevation-1"
      :loading="staffs.loading"
    >
      <template v-slot:item.avatar="{ item }">
        <div style="padding:1em;">
          <v-avatar size="62">
            <img alt="Avatar" src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460" />
          </v-avatar>
        </div>
      </template>

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Staffs Management</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
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
    </v-data-table>

    <!-- 
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar" top="top" right="right">
        {{ text }}
        <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
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
    </v-footer>-->
  </div>
</template>

<script>
import firebase from "firebase/firebase";

export default {
  data: () => ({
    icons: ["mdi-facebook-box", "mdi-instagram", "mdi-youtube"],
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
      { text: "Position", value: "position.name" },
      { text: "Department", value: "department.name" },
      { text: "Actions", value: "action", sortable: false }
    ],
    snackbar: false,
    top: true,
    right: true,
    imageIsUploading: false,
    imageData: null,
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

    onImageUpload($event) {
      this.imageIsUploading = true;
      this.imageData = event.target.files[0];

      //refactor this line into vuex
      const storageRef = firebase
        .storage()
        .ref(`${this.imageData.name}`)
        .put(this.imageData);

      storageRef.on(
        `state_changed`,
        snapshot => {},
        error => {
          console.log(error.message);
          this.imageIsUploading = false;
        },
        () => {
          storageRef.snapshot.ref.getDownloadURL().then(url => {
            this.editedItem.avatar = url;
            this.imageIsUploading = false;
          });
        }
      );
    },

    editItem(item) {
      this.editedIndex = this.staffs.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.staffs.data.indexOf(item);
      const x = confirm("Are you sure you want to delete this item?");
      if (x) {
        this.$store.dispatch("remove", item).staffs;
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
        Object.assign(this.staffs.data[this.editedIndex], this.editedItem);
        this.$store.dispatch("update", this.editedItem).staffs;
      } else {
        this.$store.dispatch("store", this.editedItem).staffs;
      }

      this.close();
    }
  }
};
</script>