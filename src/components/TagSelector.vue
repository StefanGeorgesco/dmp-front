<!-- eslint-disable prettier/prettier -->
<template>
    <div class="tag-input" style="margin: 0;">
        <div class="tag" v-for="o in selectedOptions" :key="o.id">
            {{ o.id }} - {{ o.description }}
            <span @click="remove(o)"></span>
        </div>
        <input @keyup.esc="clear" @blur="delayedClear" ref="input" v-model="searchString" type="text">
        <div class="options-list" v-show="filteredOptions.length > 0">
            <div class="tag-option" v-for="o in filteredOptions" :key="o.id" @click="add(o)">
                {{ o.id }} - {{ o.description }}
            </div>
        </div>
    </div>
</template>

<!-- eslint-disable prettier/prettier -->
<script>
export default {
    name: "TagSelector",
    emits: ["newSelection"],
    props: {
        options: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            searchString: "",
            selectedOptions: [],
        };
    },
    computed: {
        filteredOptions() {
            return this.searchString === "" ? [] : this.options.filter(o =>
                o.description.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1
                && !this.selectedOptions.map(so => so.id).includes(o.id)
            );
        }
    },
    methods: {
        clear() {
            this.searchString = "";
        },
        delayedClear() {
            setTimeout(this.clear, 200);
        },
        add(o) {
            this.selectedOptions.push(o);
            this.searchString = "";
            this.$emit("newSelection", this.selectedOptions);
            this.$refs.input.focus();
        },
        remove(o) {
            this.selectedOptions = this.selectedOptions.filter(option => option.id !== o.id);
            this.$emit("newSelection", this.selectedOptions);
        }
    }
};
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
    background-color: #0d6efd;
    padding: 0.25em 1em;
    margin: 0.25em;
    color: white;
}

.tag-input>.tag>span:after {
    display: inline-block;
    content: "\00d7";
    margin: 0 0 0 1em;
    font-size: large;
    font-weight: bold;
}

.tag-input>.tag>span:hover {
    cursor: pointer;
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

.options-list .tag-option:hover {
    cursor: pointer;
    background-color: #eeeeee;
}
</style>
