<template>
  <v-container fluid class="pa-2 mt-10">
    <v-data-table
      :headers="headers"
      :items="destinationData"
      sort-by="calories"
      class="elevation-1"
      :expanded.sync="expanded"
      single-expand
      @click:row="expandRow"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Destination Management</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-select :items="destList" @change="changeDestinationList" item-text="destination" label="Country" clearable return-object @click:clear="clearSelection" 
           single-line></v-select>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:expanded-item="{ headers }">
        <td :colspan="headers.length" style="background: linear-gradient(90deg, rgb(0, 0, 0) 0%, rgba(255, 255, 255, 0.5) 100%);">
          <carousel-3d>
            <slide v-for="(item,i) in attractionList"
              :key="i"
               
              :index="i">
              <figure>
                <v-img
                    height="100%"
                    :src="item.heroURL ? item.heroURL : emptyImageUrl"
                    @error="imgUrlAlt"
                ></v-img>
                <figcaption>
                  {{item.name}}
                </figcaption>
              </figure>
            </slide>
          </carousel-3d>
        </td>
      </template>

    </v-data-table>
  </v-container>
</template>

<script>
  import { Carousel3d, Slide } from 'vue-carousel-3d';
  import _ from 'lodash';
  
  export default {
    components: {
        Carousel3d,
        Slide
      },
    data: () => ({
      emptyImageUrl : "https://firebasestorage.googleapis.com/v0/b/cikgumurnitravel-1c58c.appspot.com/o/image-not-available.jpg?alt=media&token=2ed2e48e-87c1-48c4-ba68-4889be8370b2",
      attractionList:[],
      expanded: [],
      destList: null,
      loadDestination: null,
      countryDestination:"",
      dialogInfo:false,
      infoForSummary:null,
      destinationData:[],
      attractions:[],
      headers: [
      {
        align: "left",
        sortable: false
      },
      { text: "Name", value: "name" },
      { text: "Summary", value: "summary" }
    ],
    }),
    watch: {

      destList: function () {
        this.loadData(this.destList[0].data)
      },
      
    },
    mounted() {
      this.$store.dispatch('getListDestinationByCompany', this.$router.currentRoute.params.company)
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

            console.log("list",this.destList)
        })
        .catch(err => console.log(err));
      this.$store.dispatch('fetchAttractionByCompanyID',this.$router.currentRoute.params.company)
      .then(result => {
        this.attractions = result;
        console.log(this.attractions)
      })
      .catch(err => console.log(err));
    },
    methods: {
       async loadData(data) {
        this.loadDestination = await data
        this.countryDestination = this.loadDestination[0].selectedCountry
        console.log(this.loadDestination)
      },
      async moreInfoSummary(info) {
        console.log(info)
        this.dialogInfo=true
        this.infoForSummary = info
      },
      editDestination(desId){
          // "/destinations/:companyId/:action/:destinationId",
          this.$router.push(`/destinations/${this.$router.currentRoute.params.company}/edit/${desId}`)
      },

      changeDestinationList(item){
        this.destinationData = item.data;
        console.log(this.destinationData)
      },
      clearSelection(){
        this.destinationData = [];
        this.attractionList = [];
        this.expanded = [];
      },

      expandRow(item) {
        this.expanded = item === this.expanded[0] ? [] : [item]
        this.attractionList = this.attractions.filter(attr => {
          return attr.destinationID === item.id
        })
      },
      imgUrlAlt(event) {
        event.target.src = this.emptyImageUrl;
      }
    }
  };
</script>