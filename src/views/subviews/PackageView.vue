<template>
  <v-container fluid>
    <v-row>
        <v-col cols="12" sm="12" md="12">
            <h2 v-if="editMode">Manage Package</h2>
            <h2 v-else>Create Package</h2>
        </v-col>
        <v-row align="center">
            <v-col class="d-flex" cols="12" sm="6">
                
                <v-text-field
                label="Package Name"
                required
                placeholder="Package Name"
                outlined
                v-model="pack.name"
                ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="6">
                
                <v-text-field
                label="Total Days"
                required
                placeholder="Total Days"
                outlined
                v-model="pack.days"
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row align="center">
            <v-col class="d-flex" cols="12" sm="6">
                
                <v-text-field
                label="Tipping"
                required
                placeholder="Tipping"
                outlined
                v-model="pack.tipping"
                ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="6">
                
                <v-text-field
                label="Exchange Rate"
                required
                placeholder="Exchange Rate"
                outlined
                v-model="pack.exchangeRate"
                ></v-text-field>
            </v-col>
        </v-row>

    <v-row align="center">
    
    <v-col class="d-flex" cols="12" sm="6">
        <v-select
        :items="destList"
        label="Country"
        item-text="destination"
        item-value="destination"
        outlined
        multiple
        @change="changeDestinationList"
        return-object
        ></v-select>
    </v-col>
    <v-col class="d-flex" cols="12" sm="6">
        <v-select
            :items="choosenDest"
            item-text="name"
            label="Destination"
            item-value="id"
            multiple
            outlined
            resetOnOptionsChange
            v-model="pack.destination"
        ></v-select>
    </v-col>
    </v-row>

      <v-col cols="12" md="12" sm="12" class="pa-4">
        <v-btn color="pink" style="margin-left: 1rem;" @click="save" dark right>Save</v-btn>
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
    dessets: [],
    companyId: null,
    snackbar: false,
    top: true,
    right: true,
    pack: {},
    editedIndex: -1,
    selectedIndex: [],
    destList: [],
    choosenDest:[],
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    datetime: new Date(),
    text: "This is notification!.",

  }),

  watch: {
    dialog(val) {
      val || this.close();
    },

    packageObject: function () {
      this.pack= this.packageObject;
    },
    editMode: function(){
      console.log(this.editMode)
    }
  },
  props: {
    packageObject: Object,
    editMode: Boolean
  },
  mounted() {
    this.initialize();
    this.$store.dispatch('getListDestinationByCompany', this.$router.currentRoute.params.companyId)
    .then(async result => {
        result= result.data()
        this.destList = await _.chain(Object.keys(result).map(key => (_.assign(result[key], {
            "id": key
        }))))
        .groupBy("selectedCountry")
        .map((value, key) => ({
            destination: key,
            data: value
        }))
        .value()

    })
    .catch(err => console.log(err));
    this.companyId = this.$router.currentRoute.params.companyId;
  },
  methods: {
    initialize() {
      
        this.pack = this.packageObject;
      
    },

    changeDestinationList(item){
            var array=[];
            var country=[]
            item.forEach(element => {
                country = country.concat(element.destination)
                array = array.concat(element.data)
            });
            this.choosenDest = array;
            this.pack.destination = (array.filter(element => this.pack.destination.includes(element.id))).map(a => a.id);
            this.pack.country = country;
            
        },

    save() {
      if(this.editMode){
        this.$store.dispatch("updatePackage", this.pack);
      }
      else{
        this.pack.companyID= this.companyId;
        this.$store.dispatch("storePackage", this.pack);
      }
      this.$emit("closeModal", false);
    }
  }
};
</script>