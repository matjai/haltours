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
            <v-form>
              <v-text-field label="Email" prepend-icon="person" type="text" v-model="email"></v-text-field>
              <v-text-field
                label="Password"
                prepend-icon="lock"
                type="password"
                v-model="password"
                v-on:keyup.enter="login"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn @click="login" color="primary">
              <v-progress-circular v-show="isLoading" size="20" indeterminate color="white"></v-progress-circular>&nbsp;Login
            </v-btn>
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
      password: "",
      isLoading: false
    };
  },
  methods: {
    login() {
      this.isLoading = true;
      this.$store
        .dispatch("login", { email: this.email, password: this.password })
        .then(result => {
          this.isLoading = false;
          //console.log(result)
        })
        .catch(err => {
          this.isLoading = false;
          console.log(err);
        });
    }
  }
};
</script>
