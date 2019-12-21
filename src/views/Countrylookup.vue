<template>
    <v-card style="margin: 0 100px;">
        <v-card-title>
            Country Lookup
        </v-card-title>
        <v-row class="mb-6 ml-1 mr-1">
            <v-col cols="6">
                <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details>
                </v-text-field>
            </v-col>
            <v-col cols="6" class="text-right">
                <v-btn class="mt-3" color="primary" dark @click.stop="dialog = true">Add / Update</v-btn>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" max-width="500">
            <v-card style="overflow-x: hidden;">
                <v-row class="ml-1" v-if="editMode != true">
                    <v-col cols="6">
                        <v-text-field v-model="countryInput" label="Country Name"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-btn class="mt-3" text @click="findCountry(countryInput)">Find</v-btn>
                    </v-col>
                </v-row>
                <div v-if="(cardRes==true || editMode==true) && (countryPass != null)">
                    <v-list-item three-line>
                        <v-list-item-content>
                            <div class="overline mb-4">{{countryPass.region}} ({{countryPass.subregion}})</div>
                            <v-row>
                                <v-col cols="6">
                                    <v-list-item-title class="headline mb-1">{{countryPass.name}}</v-list-item-title>

                                </v-col>
                                <v-col cols="6">
                                    <v-img :src="countryPass.flag" aspect-ratio="2" class="grey lighten-2 mt-1"
                                        max-width="40" max-height="20"></v-img>

                                </v-col>
                            </v-row>
                            <v-list-item-subtitle>
                                <div class="mt-1">
                                    <v-row>
                                        <v-col cols="4">
                                            <v-text-field v-model="editCapital" label="Capital" outlined clearable>
                                            </v-text-field>

                                        </v-col>
                                        <v-col cols="4">
                                            <v-text-field v-model="editTimezones" label="Timezones" outlined clearable>
                                            </v-text-field>

                                        </v-col>
                                        <v-col cols="4">
                                            <v-text-field v-model="editCurrenciesCode" label="Currencies Code" outlined
                                                clearable></v-text-field>

                                        </v-col>
                                    </v-row>



                                </div>
                            </v-list-item-subtitle>
                        </v-list-item-content>

                    </v-list-item>

                    <v-card-actions>
                        <v-btn text @click="saveToFirestore(countryPass,'add')">{{button}}</v-btn>
                    </v-card-actions>
                </div>
            </v-card>
        </v-dialog>
        <div v-if="listCountry">
            <v-data-table :headers="headers" :items="listCountry" :search="search">
                <template v-slot:item.action="{ item }">
                    <v-icon small class="mr-2" @click="editCountry(item)">
                        edit
                    </v-icon>
                    <v-icon small @click="deleteCountry(item)">
                        delete
                    </v-icon>
                </template>
            </v-data-table>
        </div>
        <v-dialog v-model="deleteDialog" max-width="290">
            <v-card v-if="deleteDialog==true">
                <v-card-title class="headline">Delete confirmation</v-card-title>

                <v-list-item three-line>
                    <v-list-item-content>
                        <div class="overline mb-4">{{countryPass.region}} ({{countryPass.subregion}})</div>
                        <v-row>
                            <v-col cols="6">
                                <v-list-item-title class="headline mb-1">{{countryPass.name}}</v-list-item-title>

                            </v-col>
                            <v-col cols="6">
                                <v-img :src="countryPass.flag" aspect-ratio="2" class="grey lighten-2 mt-1"
                                    max-width="40" max-height="20"></v-img>

                            </v-col>
                        </v-row>
                        <v-list-item-subtitle>
                            <div class="mt-1">
                                <v-row>
                                    <v-col cols="4">
                                        {{countryPass.capital}}
                                    </v-col>
                                    <v-col cols="4">
                                        {{countryPass.timezones}}
                                    </v-col>
                                    <v-col cols="4">
                                        {{countryPass.currencies.code}}
                                    </v-col>
                                </v-row>



                            </div>
                        </v-list-item-subtitle>
                    </v-list-item-content>

                </v-list-item>


                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="green darken-1" text @click="deleteDialog = false">
                        NO
                    </v-btn>

                    <v-btn color="green darken-1" text @click="saveToFirestore(countryPass,'delete')">
                        YES
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-card>
</template>

<script>
    import axios from 'axios';
    import _ from 'lodash';
    export default {
        data() {
            return {
                button: "Save",
                listCountry: [],
                countryInput: "",
                cardRes: false,
                countryPass: null,
                dialog: false,
                editMode: false,
                search: '',
                deleteDialog: false,
                editCapital: '',
                editTimezones: '',
                editCurrenciesCode: '',
                // name,capital,region,subregion,timezones,currencies,flag
                headers: [{
                        text: 'Country',
                        value: 'name',
                    },
                    {
                        text: 'Country Code',
                        value: 'countrycode',
                    },
                    {
                        text: 'Capital',
                        value: 'capital'
                    },
                    {
                        text: 'Region',
                        value: 'region'
                    },
                    {
                        text: 'Subregion',
                        value: 'subregion'
                    },
                    {
                        text: 'Timezones',
                        value: 'timezones'
                    },
                    {
                        text: 'Currencies',
                        value: 'currencies.code'
                    },
                    {
                        text: 'Actions',
                        value: 'action',
                        sortable: false
                    },
                ],
            }
        },
        mounted() {
            this.$store.dispatch('bindCountry')
                .then(result => {
                    this.listCountry = result.country
                })
                .catch(err => console.log(err));
        },
        methods: {
            findCountry(Input) {
                if (this.editMode == false) {
                    let uri = `https://restcountries.eu/rest/v2/name/${Input}`
                    this.axios.get(uri).then((response) => {
                        if (response.data.length > 0) {

                            this.cardRes = true
                            console.log("find ", response.data[0])
                            this.countryPass = {
                                name: response.data[0].name,
                                countrycode: response.data[0].alpha2Code,
                                capital: response.data[0].capital,
                                region: response.data[0].region,
                                subregion: response.data[0].subregion,
                                timezones: response.data[0].timezones[0],
                                currencies: response.data[0].currencies[0],
                                flag: response.data[0].flag,
                            }
                            this.editCapital = response.data[0].capital
                            this.editTimezones = response.data[0].timezones[0]
                            this.editCurrenciesCode = response.data[0].currencies[0].code
                            // name,capital,region,subregion,timezones,currencies,flag
                            let vm = this;

                            _.find(this.listCountry, function (o) {

                                if (o.name == vm.countryPass.name) {
                                    vm.button = "Update"
                                    vm.countryPass = o
                                    console.log(o)
                                }
                            })
                        }

                    });
                } else {
                    console.log("True")
                    this.editCapital = this.countryPass.capital
                    this.editTimezones = this.countryPass.timezones
                    this.editCurrenciesCode = this.countryPass.currencies.code
                }

            },
            saveToFirestore(data, action) {
                if (data) {
                    if (action == "add") {

                        // this.editCapital = response.data[0].capital
                        // this.editTimezones = response.data[0].timezones[0]
                        // this.editCurrenciesCode = response.data[0].currencies[0].code

                        this.countryPass.capital = this.editCapital
                        this.countryPass.timezones = this.editTimezones
                        this.countryPass.currencies.code = this.editCurrenciesCode

                        this.listCountry.push(this.countryPass)
                        this.listCountry = _.uniqBy(this.listCountry, 'name');
                        this.listCountry = _.filter(this.listCountry, _.size);
                        this.dialog = false
                        this.countryInput = ''
                        this.countryPass = null

                    } else if (action == "delete") {

                        let vm = this
                        _.remove(this.listCountry, function (n) {
                            return n.name == vm.countryPass.name;
                        });
                        this.listCountry = _.filter(this.listCountry, _.size);
                        this.deleteDialog = false
                    }

                    this.$store.dispatch('actiontoListCountry', {
                            "country": this.listCountry
                        })
                        .then(result => {
                            this.editMode = false
                        })
                        .catch(err => console.log(err));
                }

            },
            editCountry(country) {
                this.dialog = true
                this.editMode = true

                this.countryPass = country
                this.findCountry(this.countryPass)
              
                
            },
            deleteCountry(item) {
                this.deleteDialog = true
                this.countryPass = item
            }
        }
    };
</script>