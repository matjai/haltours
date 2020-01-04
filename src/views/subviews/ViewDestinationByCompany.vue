<template>
  <v-container fluid>
    <v-select :items="destList" @change="changeDestinationList" item-text="destination" label="Country" clearable return-object @click:clear="clearSelection"></v-select>
    <v-data-table
      :headers="headers"
      :items="destinationData"
      sort-by="calories"
      class="elevation-1"
      :expanded.sync="expanded"
      single-expand
      @click:row="expandRow"
    >
      <template v-slot:expanded-item="{ headers }">
        <td :colspan="headers.length" style="background: linear-gradient(90deg, rgb(0, 0, 0) 0%, rgba(255, 255, 255, 0.5) 100%);">
          <carousel-3d>
            <slide v-for="(item,i) in attractionList"
              :key="i"
               
              :index="i">
                  <!-- <v-img
                    class="white--text align-end"
                    height="100%"
                    :src="item.heroURL ? item.heroURL : emptyImageUrl"
                    @error="imgUrlAlt"
                  >
                    <v-row align="end" class="lightbox white--text pa-2 fill-height">
                      <v-col>
                        <div class="subheading" ><h2 style="background: linear-gradient(90deg, rgb(0, 0, 0) 0%, rgba(255, 255, 255, 0.5) 100%);">{{item.name}}</h2></div>
                      </v-col>
                    </v-row>
                  </v-img> -->

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