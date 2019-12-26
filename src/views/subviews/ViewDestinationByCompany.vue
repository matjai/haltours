<template>
  <v-row>
    <v-col class="mt-3" cols="2">
      <v-card>
        <v-navigation-drawer permanent>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                Destinations
              </v-list-item-title>
              <v-list-item-subtitle>
                {{countryDestination}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list dense nav>
            <v-list-item v-for="item in destList" :key="item.destination">
              <!-- <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon> -->

              <v-list-item-content>
                <v-btn text small @click="loadData(item.data)">{{ item.destination }}</v-btn>

              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </v-card>
    </v-col>
    <v-col cols="10">
      <div v-if="loadDestination != null">
        <v-row>
          <v-col cols="3" v-for="destination in loadDestination" v-bind:key="destination.id">
            <v-card>
              <v-card-text>
                
                <div><v-btn @click="editDestination(destination.id)" class="mb-1" color="primary"  text small>{{destination.name}}</v-btn> <v-menu offset-y>
      <v-list>
 
      </v-list>
    </v-menu></div>
                <v-img :src="destination.fileUrl" aspect-ratio="1" max-height="200" max-width="500"
                  class="grey lighten-2"></v-img>
                <p>{{destination.otherName}}</p>
                <!-- <div class="text--primary">{{destination.value.summary}}</div> -->
                <span>{{destination.summary.slice(0, 120)}} </span>
                <a class="" href="#" @click="moreInfoSummary(destination)">
                  Read more...
                </a>
              </v-card-text>
            </v-card>

          </v-col>
        </v-row>
      </div>
    </v-col>
    <v-dialog v-if="infoForSummary"
      v-model="dialogInfo"
    >
      <v-card>
        <v-card-title class="headline">{{infoForSummary.name}} ({{infoForSummary.otherName}})</v-card-title>

        <v-card-text>
         {{infoForSummary.summary}}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialogInfo = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import _ from 'lodash';
  export default {
    data: () => ({
      destList: null,
      loadDestination: null,
      countryDestination:"",
      dialogInfo:false,
      infoForSummary:null
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
      }
    }
  };
</script>