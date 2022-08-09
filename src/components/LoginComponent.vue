<template>
    <div class="container">
        <form @submit.prevent="submitLogin">
            <div class="mb-3">
                <label for="username" class="form-label">identifiant</label>
                <input type="text" class="form-control" v-model="user.username" id="username"
                    aria-describedby="usernameHelp">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">mot de passe</label>
                <input type="password" class="form-control" v-model="user.password" id="password">
            </div>
            <button type="submit" class="btn btn-primary">Entrer</button>
        </form>
        <div>{{ message }}</div>
    </div>
</template>

<script>
import { User } from '../model/user.js';
import { Service } from '../services/services.js';

export default {
    name: "LoginComponent",
    data() {
        return {
            user: new User(),
            message: 'message'
        }
    },
    methods: {
        async submitLogin() {
            console.log(this.user.username + " " + this.user.password + ' from LoginComponent');

            let response = await Service.login(this.user);

            if (response) {
                this.message = response.data.username + " est connecté avec le rôle " + response.data.role;
            };
        }
    }
}
</script>

<style>

</style>