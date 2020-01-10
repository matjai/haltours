<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <h2 v-if="editMode">Manage Ground</h2>
        <h2 v-else>Create Ground</h2>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-select
          :items="packages"
          item-text="name"
          item-value="name"
          label="Package ID"
          v-model="ground.packageID"
          outlined
        ></v-select>
      </v-col>

      <v-col cols="12" sm="6" md="6">
        <v-text-field
          label="Description"
          v-model="ground.description"
          placeholder="Description"
          outlined
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="12" sm="12" class="pa-4">
        <v-btn color="pink" @click="dialog = true" dark right>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn color="pink" style="margin-left: 1rem;" @click="save" dark right>Save</v-btn>

        <v-simple-table>
          <template v-slot:default>
            <v-dialog v-model="dialog" max-width="800px">
              <v-card>
                <v-card-title>
                  <span class="headline"></span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <h2 v-if="editedIndex > -1">{{groundItem.name}}</h2>
                        <h2 v-else>Create New Ground</h2>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="groundItem.type"
                          label="Ground Type"
                          placeholder="Ground Type"
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="groundItem.price"
                          label="Price in Original Currency"
                          placeholder="Price in Original Currency"
                          outlined
                        ></v-text-field>
                      </v-col>
                      
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="saveChild">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <thead>
              <tr>
                <th class="text-left">Type</th>
                <th class="text-left">Price <small>(In local currency)</small></th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              
              <tr v-for="item in groundChild" :key="item.id">
                <td>{{ item.type }}</td>
                <td>{{ item.price }}</td>
                <td>
                  <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
                  <v-icon small @click="deleteItem(item)">delete</v-icon>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" top="top" absolute right="right" :type="type">
      {{ message }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import firebase from "firebase/firebase";
import NotificationMixin from "../mixins/NotificationMixin";
import ValidationMixin from "../mixins/NotificationMixin";
import { isError } from 'util';

export default {
  mixins: [ValidationMixin, NotificationMixin],
  data: () => ({
    dialog: false,
    dessets: [],
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    date: new Date().toISOString().substr(0, 10),
    isSubmit: false,
    airline: [],
    search: "",
    companyId: null,
    snackbar: false,
    top: true,
    right: true,
    ground: {},
    groundChild: [],
    grounds: [],
    editedIndex: -1,
    packages: [],
    selectedIndex: [],
    groundItem: {
      airline: null,
      number: null,
      date: null,
      time: null,
      from: null,
      type: null,
      to: null
    },
    text: "This is notification!.",
    defaultItem: {
      airline: null,
      number: null,
      date: null,
      time: null,
      from: null,
      type: null,
      to: null
    }
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },

    groundObject: function () {
      this.ground= this.groundObject;
      this.groundChild = this.groundObject.child;
    },
    editMode: function(){
      console.log(this.editMode)
    }
  },
  props: {
    groundObject: Object,
    editMode: Boolean
  },
  mounted() {
    this.initialize();
    this.$store.dispatch('fetchPackage')
      .then(result => {
        this.packages = result;
        
      })
      .catch(err => console.log(err));
    this.companyId = this.$router.currentRoute.params.companyId;
  },
  methods: {
    initialize() {
      
        this.ground = this.groundObject;
        this.groundChild = this.ground.child;
      
    },

    editItem(item) {
      this.editedIndex = this.groundChild.indexOf(item);
      this.groundItem = item;
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.grounds.indexOf(item);
      const x = confirm("Are you sure you want to delete this item?");
      if (x) {
        this.$store.dispatch("deleteGround", item);
        console.log(item);
        this.snackbar = true;
      }
    },

    close() {
      this.dialog = false;

      setTimeout(() => {
        this.groundItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.snackbar = true;
      }, 300);
    },

    saveChild() {
      if (this.editedIndex > -1) {
        Object.assign(this.groundChild[this.editedIndex], this.groundItem);
      } else {
        this.groundChild.push(this.groundItem);
      }

      this.close();
    },

    save() {
      this.ground.child = this.groundChild;
      if(this.editMode){
        this.$store.dispatch("updateGround", this.ground);
      }
      else{
        this.ground.companyID= this.companyId;
        this.$store.dispatch("storeGround", this.ground);
      }
      this.$emit("closeModal", false);
    }
  }
};
</script>