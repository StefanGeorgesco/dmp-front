<!-- eslint-disable prettier/prettier -->
<template>
    <div class="tag-input" style="margin: 0;">
        <div v-if="selectedOject" class="tag">
            {{ objectRepFn(selectedOject) }}
        </div>
        <input @keyup.esc="clear" @blur="delayedClear" v-debounce:300ms="searchObjects" ref="input" v-model="searchString" type="text"
            :disabled="disabled" v-show="!disabled">
        <div class="options-list" v-show="foundObjects.length > 0">
            <div class="tag-option" v-for="o in foundObjects" :key="o.id" @click="select(o)">
                {{ objectRepFn(o) }}
            </div>
        </div>
    </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
import { mapActions } from "pinia";
import { useMessagesStore } from "../stores/messagesStore.js";
import { useLoaderStore } from '../stores/loaderStore';
import { Service } from "../services/services.js";
import { vue3Debounce } from 'vue-debounce';

export default {
    name: "ObjectFinder",
    emits: ["newSelection"],
    directives: {
        debounce: vue3Debounce({ lock: true }),
    },
    props: {
        objectType: {
            type: String,
            required: true,
        },
        objectValue: Object,
        objectRepFn: {
            type: Function,
            default(o) {
                return o.toString();
            },
        },
        objectFilterFn: {
            type: Function,
            default() {
                return true;
            },
        },
        disabled: Boolean,
    },
    data() {
        return {
            searchString: "",
            selectedOject: this.objectValue ? { ...this.objectValue } : null,
            foundObjects: [],
        };
    },
    watch: {
        objectValue: {
            handler() {
                this.clear();
                this.selectedOject = this.objectValue ? { ...this.objectValue } : null;
            },
            deep: true,
        },
    },
    methods: {
        async searchObjects() {
            let id = this.setLoader();
            try {
                let response = await Service.findObjectBySearchString(this.objectType, this.searchString);
                this.foundObjects = response.data.filter(this.objectFilterFn);
            } catch (error) {
                if (error.response.data) {
                    this.setErrorMessage(error.response.data.message);
                }
            } finally {
                this.clearLoader(id);
            }
        },
        clear() {
            this.foundObjects = [];
            this.searchString = "";
        },
        delayedClear() {
            setTimeout(this.clear, 200);
        },
        select(o) {
            this.clear();
            this.selectedOject = o;
            this.$emit("newSelection", o);
        },
        ...mapActions(useMessagesStore, ["setErrorMessage"]),
        ...mapActions(useLoaderStore, ["setLoader", "clearLoader"]),
    },
}
</script>

<!-- eslint-disable prettier/prettier -->
<style scoped>
.tag-input {
    position: relative;
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
}

.tag-input>.tag {
    flex: 0 1 auto;
    border-radius: 0.375rem;
    background-color: cornflowerblue;
    padding: 0.25em 1em;
    margin: 0.25em;
    color: white;
}

.tag-input>input {
    border: none;
    outline: none;
    flex: 1 0 auto;
    margin: 0.25em;
    padding: 0.25em;
}

.tag-input>.options-list {
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

.options-list .tag-option {
    padding-left: 1em;
}

.options-list .tag-option:not(:last-child) {
    border-bottom: 1px dotted lightgray;

}

.options-list .tag-option:hover {
    cursor: pointer;
    background-color: #eeeeee;
}
</style>