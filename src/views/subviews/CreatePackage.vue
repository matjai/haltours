<template>
    <v-container fluid class="pa-2 mt-10">
    <v-layout>
      <v-flex>
        <v-card>
          <v-card-title></v-card-title>

          <v-card-text>

            <v-row align="center">
                <v-col class="d-flex" cols="12" sm="12">
                    
                    <v-text-field
                    label="Package Name"
                    required
                    placeholder="Package Name"
                    outlined
                    v-model="packageObject.name"
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
                    v-model="packageObject.destination"
                ></v-select>
            </v-col>
            </v-row>

            <v-btn
            color="primary"
            @click="save"
            >
            Save
            </v-btn>   
            </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>      
    </v-container>
</template>
<script>
  export default {
    data: () => ({
      items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
      destList: [],
      choosenDest:[],
      packageObject:{
          name: null,
          country: [],
          destination:[]
      },
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      datetime: new Date(),
      currentJsonFile:[]
    }),
    mounted() {
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
        
    },
    methods: {
        changeDestinationList(item){
            var array=[];
            var country=[]
            item.forEach(element => {
                country = country.concat(element.destination)
                array = array.concat(element.data)
            });
            this.choosenDest = array;
            this.packageObject.destination = (array.filter(element => this.packageObject.destination.includes(element.id))).map(a => a.id);
            this.packageObject.country = country;
            
        },
        save(){
            this.$store.dispatch("storePackage", this.packageObject);
            // console.log(this.packageObject)
        }
    
    }
  }
</script>