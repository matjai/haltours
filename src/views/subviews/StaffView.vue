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
                <v-img :src="staff.avatar"></v-img>
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
              <v-text-field disabled label="Name" v-model="staff.name" placeholder="Name" filled></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field
                disabled
                label="Mobile"
                v-model="staff.mobile"
                placeholder="Mobile"
                filled
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field
                disabled
                label="Staff ID"
                v-model="staff.staffId"
                placeholder="Employee ID"
                filled
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-text-field disabled label="Email" v-model="staff.email" placeholder="Email" filled></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-select
                :items="departments"
                item-text="name"
                item-value="name"
                disabled
                label="Department"
                v-model="staff.department"
                filled
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <v-select
                :items="positions"
                item-text="name"
                item-value="name"
                disabled
                label="Position"
                v-model="staff.position"
                filled
              ></v-select>
            </v-col>

            <v-col cols="6" sm="6" md="6">
              <v-select
                :items="roles"
                item-text="name"
                item-value="name"
                disabled
                label="Access Roles"
                v-model="staff.roles"
                filled
              ></v-select>
            </v-col>

            <v-col cols="6" sm="6" md="6">
              <v-select
                :items="companies"
                item-text="name"
                item-value="id"
                disabled
                label="Company"
                placeholder="Company"
                v-model="staff.companyId"
                filled
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
  mounted() {
    const staff = this.$router.currentRoute.params.staff;
    const company = this.$router.currentRoute.params.company;

    this.$store
      .dispatch("fetchStaffByID", staff)
      .then(result => {
        this.staff = result.data();
      })
      .catch(error => {
        console.log(error);
      });

    this.$store
      .dispatch("fetchCompany")
      .then(result => {
        this.companies = result;
      })
      .catch(error => {
        console.log(error);
      });

    this.initialize();
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
      this.roles = [
        {
          name: "Technical"
        },
        {
          name: "Administrator"
        },
        {
          name: "Branch"
        }
      ];
    }
  },
  data: () => ({
    imageIsUploading: false,
    departments: [],
    companies: [],
    positions: [],
    roles: [],
    rules: [
      value =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!"
    ],
    staff: {},
    editedItem: {}
  })
};
</script>