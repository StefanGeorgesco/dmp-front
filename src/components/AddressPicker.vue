<!-- eslint-disable prettier/prettier -->

<template>
    <div class="col-md-4 input-container">
        <input @keyup.esc="clear" v-model="searchString" type="text" @input="findAddresses" class="form-control"
            placeholder="Recherche...">
        <div class="options-list" v-show="foundAddresses.length > 0">
            <div class="option-item" v-for="address in foundAddresses" :key="address.properties.id"
                @click="select(address)">
                {{ address.properties.label }}
            </div>
        </div>
    </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
const baseUrl = "https://api-adresse.data.gouv.fr/search";

export default {
    name: "AddressPicker",
    props: {
        errorMessageService: {
            type: Function,
            default(m) {
                console.log(m);
            },
        },
        setLoaderService: {
            type: Function,
            default() {
            },
        },
        clearLoaderService: {
            type: Function,
            defaut(id) {
                console.log(id);
            }
        }
    },
    emits: ["newSelection"],
    data() {
        return {
            longitude: "2.349",     // Notre-Dame de Paris
            latitude: "48.854499",  //
            searchString: "",
            foundAddresses: [],
        }
    },
    created() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.longitude = position.coords.longitude;
                this.latitude = position.coords.latitude;
                console.log(`lon: ${this.longitude}, lat: ${this.latitude}`);
            }, () => console.log("impossible de déterminer la position"), { enableHighAccuracy: true });
        }
    },
    methods: {
        clear() {
            this.searchString = "";
            this.foundAddresses = [];
        },
        findAddresses() {
            if (this.searchString) {
                let url = encodeURI(`${baseUrl}?type=housenumber&lon=${this.longitude}&lat=${this.latitude}&limit=15&q=${this.searchString}`);
                let id = this.setLoaderService();
                fetch(url)
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            this.errorMessageService(`Le service d'adresse est injoignable (erreur ${response.status} '${response.statusText}').`);
                        }
                    })
                    .then(data => {
                        this.foundAddresses = data.features;
                    })
                    .catch(error => {
                        this.errorMessageService(`Le service d'adresse est injoignable ('${error.message}').`);
                    })
                    .finally(
                        () => { this.clearLoaderService(id); }
                    );
            } else {
                this.clear();
            }
        },
        select(a) {
            this.clear();
            this.$emit("newSelection", {
                street1: a.properties.name,
                street2: "",
                city: a.properties.city,
                state: a.properties.context,
                zipcode: a.properties.postcode,
                country: "France",
            });
        },
    },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped>
.input-container {
    position: relative;
}

.options-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 99;
    background-color: #ffffff;
    border: 1px solid #ced4da;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
    padding: 0.25em 0 0.5em 0;
}

.option-item {
    padding-left: 1em;
}

.option-item:hover {
    cursor: pointer;
    background-color: #eeeeee;
}
</style>