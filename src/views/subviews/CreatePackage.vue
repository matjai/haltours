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

                    placeholder="Package Name"
                    outlined
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row align="center">
            
            <v-col class="d-flex" cols="12" sm="6">
                <v-select
                :items="destList"
                label="Country"
                item-text="destination"
                outlined
                @change="changeDestinationList"
                return-object
                ></v-select>
            </v-col>
            <v-col class="d-flex" cols="12" sm="6">
                <v-select
                    :items="choosenDest"
                    item-text="name"
                    label="Destination"
                    multiple
                    outlined
                    return-object
                ></v-select>
            </v-col>
            </v-row>

            <v-btn
            color="primary"
            @click="e1 = 2"
            >
            Continue
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
      e1: 0,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      datetime: new Date(),
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

            console.log("list",this.destList)
        })
        .catch(err => console.log(err));
    },
    methods: {
        changeDestinationList(item){
            this.choosenDest = item.data;
        },
    
    }
  }
</script>