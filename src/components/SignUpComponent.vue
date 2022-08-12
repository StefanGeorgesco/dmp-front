<!-- eslint-disable prettier/prettier -->
<template>
    <div class="container">
        <form @submit.prevent="submitSignUp" @input="checkForm" class="row g-3 needs-validation" novalidate>
            <div class="col-md-4">
                <label for="id" class="form-label">* Identifiant</label>
                <input v-model.trim="user.id" type="text" class="form-control" id="id" required>
                <div class="error" :class="{ fieldError: idError }">
                    L'identifiant est obligatoire.
                </div>
            </div>
            <div class="col-md-4">
                <label for="nom-utilisateur" class="form-label">* Nom d'utilisateur</label>
                <input v-model.trim="user.username" type="text" class="form-control" id="nom-utlisateur" required>
                <div class="error" :class="{ fieldError: userNameError }">
                    Le nom d'utilisateur est obligatoire.
                </div>
            </div>
            <div></div>
            <div class="col-md-4">
                <label for="password" class="form-label">* Mot de passe</label>
                <input @input="passwordRepeatError = false" v-model.trim="user.password" type="password"
                    class="form-control" id="password" required>
                <div class="error" :class="{ fieldError: passwordPresentError }">
                    Le mot de passe est obligatoire.
                </div>
                <div class="error" :class="{ fieldError: passwordLengthError }">
                    Le mot de passe doit comporter au moins 4 caractères.
                </div>
            </div>
            <div class="col-md-4">
                <label for="passwordRepeat" class="form-label">* Veuillez ressaisir le mot de passe</label>
                <input @input="passwordRepeatError = false" v-model="passwordRepeat" type="password"
                    class="form-control" id="passwordRepeat" required>
                <div class="error" :class="{ fieldError: passwordRepeatError }">
                    Le mot de passe est différent.
                </div>
            </div>
            <div></div>
            <div class="col-md-4">
                <label for="security-code" class="form-label">* Code de sécurité</label>
                <input v-model.trim="user.securityCode" type="text" class="form-control" id="security-code" required>
                <div class="error" :class="{ fieldError: securityCodeError }">
                    Le code de sécurité est obligatoire.
                </div>
            </div>
            <div class="col-12">
                <button class="btn btn-primary" type="submit">Entrer</button>
            </div>
        </form>
    </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { Service } from "../services/services.js";
import { useMessagesStore } from "../stores/messagesStore";
import { mapWritableState } from "pinia";

export default {
  name: "SignUpComponent",
  data() {
    return {
      user: {
        id: "",
        username: "",
        password: "",
        securityCode: "",
      },
      passwordRepeat: "",
      mustCheck: false,
      idError: false,
      userNameError: false,
      passwordPresentError: false,
      passwordLengthError: false,
      passwordRepeatError: false,
      securityCodeError: false,
    };
  },
  methods: {
    checkForm() {
      this.user.id = this.user.id.toUpperCase();
      if (this.mustCheck) {
        this.idError = !this.user.id;
        this.userNameError = !this.user.username;
        this.passwordPresentError = !this.user.password;
        this.passwordLengthError = this.user.password
          ? this.user.password.length < 4
          : false;
        this.securityCodeError = !this.user.securityCode;

        return (
          !this.IdError &&
          !this.userNameError &&
          !this.passwordPresentError &&
          !this.passwordLengthError &&
          !this.securityCodeError
        );
      }
    },
    async submitSignUp() {
      this.mustCheck = true;
      let passwordsEqual = this.passwordRepeat == this.user.password;
      if (!passwordsEqual) {
        this.passwordRepeatError = true;
      }
      if (this.checkForm() && passwordsEqual) {
        try {
          await Service.signUp(this.user);
          this.successMessage =
            "Le compte a bien été créé. Veuillez vous connecter.";
          this.$router.push("/");
        } catch (error) {
          console.error(error);
          if (error.response.status === 406) {
            this.errorMessage = Object.values(error.response.data).join(", ");
          } else {
            this.errorMessage = error.response.data.message;
          }
        }
      }
    },
  },
  computed: {
    ...mapWritableState(useMessagesStore, ["successMessage", "errorMessage"]),
  },
};
</script>

<style scoped>
.error {
  visibility: hidden;
}

.error.fieldError {
  visibility: visible;
  color: red;
}
</style>
