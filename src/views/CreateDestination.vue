<template>
    <v-form>
        <v-container>
            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field v-model="name" label="Name " required></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field v-model="otherName" label="Other Name"></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="4">
                    <v-select :items="items" item-text="name" v-model="selectedCountry" label="Destination Country"
                        outlined>
                    </v-select>
                </v-col>

                <!-- <v-col cols="12" md="4">
                    <v-combobox multiple v-model="select" label="Places of Interest" append-icon chips deletable-chips
                        class="tag-input" :search-input.sync="search" @keyup.tab="updateTags" @paste="updateTags">
                    </v-combobox>
                </v-col> -->
            </v-row>

            <v-row>
                <v-col cols="6" md="6">
                    <v-textarea v-model="summary" outlined name="input-7-4" label="Summary"
                        placeholder="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through.">
                    </v-textarea>

                </v-col>
                <v-col cols="3" md="3">
                    
                    <picture-input ref="pictureInput" @change="onChange()" width="250" height="250" margin="16"
                        accept="image/jpeg,image/png" size="10" buttonClass="btn" :customStrings="{
        upload: '<h1>Bummer!</h1>',
        drag: 'Drop Image'
      }">
                    </picture-input>
                </v-col>
                         <v-col v-if="editmode==true" cols="3" md="3">
                               <v-img :src="dbImage" aspect-ratio="1" width="250" height="250" 
                  class="grey lighten-2"></v-img>
                           </v-col>
            </v-row>
            <v-btn class="ma-2" @click="saveBtnAction()" :disabled="btmComplete" tile color="indigo" dark>Save</v-btn>
        </v-container>
    </v-form>
</template>

<script>
    import PictureInput from 'vue-picture-input'
    export default {
        data: () => ({
            name: "",
            otherName: "",
            summary: "",
            items: null,
            selectedCountry: "",


            editmode:false,

            image: "",
            dbImage:"",

            select: [],
            search: "", //sync search

            btmComplete: true,
        }),
        components: {
            PictureInput
        },
        watch: {

            name: function () {
                this.saveNotification()
            },
            selectedCountry: function () {
                this.saveNotification()
            },
            summary: function () {
                this.saveNotification()
            },
            image: function () {
                this.saveNotification()
            },
        },

        mounted() {
            this.$store.dispatch('companyInfo', this.$route.params.companyId)
                .then(result => {
                    if ((this.$route.params.action) == "edit") {
                        this.editmode = true
                        this.destinationInfo();
                    }

                })
                .catch(err => console.log(err));

            this.$store.dispatch("bindCountry")
                .then(result => {
                    this.items = this.$store.state.lookup.countryList.country
                })
                .catch(err => console.log(err));
        },

        methods: {
            destinationInfo() {
                this.$store.dispatch('getDestinationInfo', [this.$route.params.companyId, this.$route.params
                        .destinationId
                    ])
                    .then(result => {
                        let infos = (result.data())[this.$route.params.destinationId]
                        console.log(infos)
                        this.name = infos.name
                        console.log(this.name)
                        this.otherName = infos.otherName
                        this.summary = infos.summary
                        this.dbImage = infos.fileUrl
                        this.selectedCountry = infos.selectedCountry
                    })
                    .catch(err => console.log(err));
            },
            saveNotification() {
             

                if(this.editmode == true){
                    if(this.name != "" && this.selectedCountry != "" && this.summary != "" ){
                         this.btmComplete = false
                    }
                } else if(this.name != "" && this.selectedCountry != "" && this.summary != "" & this.image != ""){
                    this.btmComplete = false
                }
            },
            updateTags() {
                this.$nextTick(() => {
                    this.select.push(...this.search.split(","));
                    this.$nextTick(() => {
                        this.search = "";
                    });
                });
            },
            onChange() {
              
                console.log("event", this.$refs.pictureInput.file)
                this.image = this.$refs.pictureInput.file;

            },
            saveBtnAction() {
                let temp = {
                    "name": this.name,
                    "otherName": this.otherName,
                    "selectedCountry": this.selectedCountry,
                    "summary": this.summary
                }
                    if(this.editmode == true){

                        if(this.image == ""){
                            this.image = this.dbImage
                        }
                     
                    }
                this.$store.dispatch('saveDestinations', [this.$route.params.companyId, temp, this.image,this.editmode,this.$route.params.destinationId])
                    .then(result => {
                        this.$router.push(`/destinations/${this.$route.params.companyId}`)
                    })
                    .catch(err => console.log(err));
            }
        }
    };
</script>