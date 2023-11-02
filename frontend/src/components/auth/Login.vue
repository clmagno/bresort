<template>
  <div class="container-fluid login-background">
    <div class="row justify-content-center align-items-center vh-100">
      <div class="col-md-3">
        <div class="card animated-form">
          <div class="card-header text-center">
            <img src="@/assets/pantukan-waterworld-logo.jpg" alt="Pantukan Waterworld Logo" class="img-fluid mx-auto d-block" style="max-width: 200px;">
            <h4 class="text-center mt-3">Login</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="login" class="">
              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" v-model="username" class="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter username">
              </div>
              <div class="form-group mb-2">
                <label for="password">Password</label>
                <input type="password" v-model="password" class="form-control" id="password" placeholder="Password">
              </div>
              <button type="submit" class="btn btn-primary btn-block">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore"; // Import the authStore
import axios from 'axios';
import Swal from 'sweetalert2';

export default {

  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
  const authStore = useAuthStore(); // Access the authStore
  // API call for login authentication
  const apiLink = this.API_URL + "login/"; // replace with your actual API link
  console.log(apiLink)
  axios.post(apiLink, {
    username: this.username,
    password: this.password
  })
    .then((response) => {
      if (response.data.isActive) {
        Swal.fire({
                  title: "Error!",
                  text: "User is already logged in.",
                  icon: "error",
                });
      } else {
        // Set user as active using API call
        const user = {
          username: response.data.username,
          FirstName: response.data.fName,
          LastName: response.data.lName,
          role: response.data.role
        }
        axios.put(`${this.API_URL}users/${response.data.id}/`, {...user, isActive: true })
          .then(() => {
            const role = response.data.role;
            switch (role) {
              case "superuser":
                this.$router.push("/main");
                break;
              case "reservationist":
                this.$router.push("/booking");
                break;
              case "cashier":
                this.$router.push("/cashier");
                break;
              case "inventorymanager":
                this.$router.push("/inventory");
                break;
              default:
                // This shouldn't happen, but just in case
                Swal.fire({
                  title: "Error!",
                  text: "Unknown user role.",
                  icon: "error",
                });
            }
            Swal.fire({
              title: "Success!",
              text: "You have successfully logged in.",
              icon: "success",
            });
            authStore.setUser(response.data);
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: error,
              icon: "error",
            });
            console.log(error); // replace with your own error handling
          });
      }
    })
    .catch((error) => {
      Swal.fire({
        title: "Error!",
        text: "Invalid username or password.",
        icon: "error",
      });
      console.log(error); // replace with your own error handling
    });
},

  },
};
</script>

<style>
/* Add custom styles here */
.login-background {
  background: url("@/assets/beach-resort-background.jpg") no-repeat center center fixed;
  background-size: cover;
  background-position: center;
}
.animated-form {
  animation: fly-in 0.5s ease-out;
  opacity: 1;
  transform: translateY(0);
}

@keyframes fly-in {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}



</style>
