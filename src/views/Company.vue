<template>
<v-container fluid="" class="pa-0">
    <v-toolbar flat="">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Haltours Destination Management</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn text>ABOUT US</v-btn>
        <v-btn text>CONTACT</v-btn>
        <v-btn text>SOCIALS</v-btn>
      </v-toolbar-items>
      <v-btn icon to="/login">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-toolbar>
    <v-layout>
      <v-flex>
        <div class="about d-block pa-2">
          <v-data-table
            :headers="headers"
            :items="companies.data"
            sort-by="calories"
            class="elevation-1"
            :loading="companies.loading"
            :search="search"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>Company</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer><v-dialog v-model="dialog" max-width="800px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">Add Company</v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline"></span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field color="primary" v-if="companies.loading" loading disabled></v-text-field>
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
                            <v-select
                              :items="countries"
                              item-text="name"
                              label="Countries"
                              v-model="editedItem.country"
                              outlined
                              return-object
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col >
                            <v-textarea
                              outlined
                              label="Description"
                              v-model="editedItem.description"
                            ></v-textarea>
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
                </v-dialog></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>

                
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
      </v-flex>
    </v-layout>
    <v-footer dark padless absolute="">
      <v-card
        flat
        class="indigo lighten-1 white--text text-center"
        style="width: 100%;"
      >
        <v-card-text>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-4 white--text"
            icon
            large
          >
            <v-icon large>{{ icon }}</v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          3 Tower Jalan Ampang 68000 Selangor Malaysia
        </v-card-text>
        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>Haltours</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-container>
</template>


<script>
export default {
  data: () => ({
    icons: ["mdi-facebook-box", "mdi-instagram", "mdi-youtube"],
    dialog: false,
    search: '',
    headers: [
      {
        align: "left",
        sortable: false
      },
      { text: "Name", value: "name" },
      { text: "Description", value: "description" },
      { text: "Countries", value: "country.name" },
      { text: "Actions", value: "action", sortable: false }
    ],
    snackbar: false,
    top: true,
    right: true,
    countries: [],
    editedIndex: -1,
    selectedIndex: [],
    editedItem: {
      name: "",
      description: "",
      logoURL: null,
      imageURL: null,
      country: null
    },
    text: "This is notification!.",
    defaultItem: {
      name: "",
      description: "",
      logoURL: null,
      imageURL: null,
      country: null
    }
  }),

  computed: {},

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.$store.dispatch("fetch").companies;
    this.initialize();
  },

  methods: {
    initialize() {
      this.companies = this.$store.state.companies;

      console.log(this.companies);

      (this.countries = [
        {
          id: 1,
          name: "Malaysia"
        },
        {
          id: 2,
          name: "Indonesia"
        }
      ])
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
      //this.companies.splice(index, 1);
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
        Object.assign(this.companies[this.editedIndex], this.editedItem);
      } else {
        this.$store.dispatch("store", this.editedItem).companies;
      }

      this.close();
    }
  }
};
</script>