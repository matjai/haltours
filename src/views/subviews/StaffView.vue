<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <span class="headline"></span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12 d-flex justify-center">
              <v-avatar class="profile" color="grey" size="164">
                <v-img :src="getStaff.avatar"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="12">
              <v-file-input
                :rules="rules"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick an avatar"
                prepend-icon="mdi-camera"
                disabled
                :loading="imageIsUploading"
                @change="onImageUpload($event)"
                label="Avatar"
              ></v-file-input>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field disabled label="Name" v-model="getStaff.name" placeholder="Name" filled></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field
                disabled
                label="Mobile"
                v-model="getStaff.mobile"
                placeholder="Mobile"
                filled
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field
                disabled
                label="Staff ID"
                v-model="getStaff.staffId"
                placeholder="Employee ID"
                filled
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field
                disabled
                label="Email"
                v-model="getStaff.email"
                placeholder="Email"
                filled
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-select
                :items="departments"
                item-text="name"
                disabled
                label="Department"
                v-model="getStaff.department"
                filled
                return-object
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-select
                :items="positions"
                item-text="name"
                disabled
                label="Position"
                v-model="getStaff.position"
                filled
                return-object
              ></v-select>
            </v-col>

            <v-col cols="6" sm="6" md="6">
              <v-select
                :items="getRoles"
                item-text="name"
                disabled
                label="Access Roles"
                v-model="getStaff.roles"
                filled
                return-object
              ></v-select>
            </v-col>

            <v-col cols="6" sm="6" md="6">
              <v-select
                :items="getCompanies"
                item-text="name"
                disabled
                label="Company"
                placeholder="Company"
                v-model="getStaff.company"
                filled
                return-object
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$router.back(-1)">Back</v-btn>
        <!-- <v-btn color="blue darken-1" text @click="save">Save</v-btn> -->
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import firebase from "firebase/firebase";

export default {
  created() {
    const staff = this.$router.currentRoute.params.staff;
    const company = this.$router.currentRoute.params.company;

    this.$store.dispatch("staffs/getById", { id: staff });
    this.$store.dispatch("companies/fetch");
    this.$store.dispatch("roles/fetch");
    this.initialize();
  },
  computed: {
    getStaff() {
      const data = this.$store.getters["staffs/getStaff"];
      return { ...this.defaultItem, ...data };
    },
    getRoles() {
      return this.$store.getters["roles/getAllRoles"];
    },
    getCompanies() {
      return this.$store.getters["companies/companies"];
    }
  },
  methods: {
    save() {},
    close() {},
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
    }
  },
  data: () => ({
    imageIsUploading: false,
    departments: [],
    positions: [],
    rules: [
      value =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!"
    ],
    editedItem: {}
  })
};
</script>