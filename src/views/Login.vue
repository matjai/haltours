<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login form</v-toolbar-title>
            <div class="flex-grow-1"></div>
          </v-toolbar>
          <v-card-text>
            <div>Current user:     {{ $store.state.user.currentUser }}</div>
            <v-form>
              <v-text-field
                label="Email"
                prepend-icon="person"
                type="text"
                v-model="email"
              ></v-text-field>
              <v-text-field
                label="Password"
                prepend-icon="lock"
                type="password"
                v-model="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn @click="login" color="primary">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    login(){
      this.$store.dispatch('login', { email: this.email, password: this.password})
      .then(result => {
        //console.log(result)
      })
      .catch(err => console.log(err));
    }
  }
};
</script>
