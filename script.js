

Vue.component('product-item',{
    props: {
        data: {
            type: Object,
            required: true
        },
        value: Array
    },
    template: `
        <tr>
            <td>
                <div class="app__table--checkbox">
                    <input type="checkbox" v-model="model" :value="data.id">
                </div>
            </td>
            <td>
                <div class="app__item">
                    <img :src="data?.image" :alt="data.name" class="app__item--img">
                    <div>
                        <h3 class="app__item--title">{{data.name}}</h3>
                        <p class="app__item--id">{{data.id}}</p>
                    </div>
                </div>
            </td>
            <td><div class="app__price">\${{data.price}}</div></td>
        </tr>
        `,
    data(){
        return {
            
        }
    },
    computed: {
        model: {
            get() { return this.value },
            set(newValue) { this.$emit('input', newValue)}
        }
    }
})

Vue.component('btn',{
    props: {
        name: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    template: `
        <button class="btn" @click="clicked" :disabled="disabled">
            <div class="btn--icon-left">
                <slot name="left"></slot>
            </div>
            {{name}}
            <div class="btn--icon-right">
                <slot name="right"></slot>
            </div>
        </button>
    `,
    data(){
        return {

        }
    },
    methods: {
        clicked: function(e){
            this.$emit('clicked',e)
        }
    }
})

Vue.component('search-comp',{
    props: ['value'],
    template: `
        <div class="app__search">
            <div class="app__search--icon">
                <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.8906 13.5742L10.582 10.2656C10.5 10.2109 10.418 10.1562 10.3359 10.1562H9.98047C10.8281 9.17188 11.375 7.85938 11.375 6.4375C11.375 3.32031 8.80469 0.75 5.6875 0.75C2.54297 0.75 0 3.32031 0 6.4375C0 9.58203 2.54297 12.125 5.6875 12.125C7.10938 12.125 8.39453 11.6055 9.40625 10.7578V11.1133C9.40625 11.1953 9.43359 11.2773 9.48828 11.3594L12.7969 14.668C12.9336 14.8047 13.1523 14.8047 13.2617 14.668L13.8906 14.0391C14.0273 13.9297 14.0273 13.7109 13.8906 13.5742ZM5.6875 10.8125C3.25391 10.8125 1.3125 8.87109 1.3125 6.4375C1.3125 4.03125 3.25391 2.0625 5.6875 2.0625C8.09375 2.0625 10.0625 4.03125 10.0625 6.4375C10.0625 8.87109 8.09375 10.8125 5.6875 10.8125Z" fill="#8F90A6"/>
                </svg>
            </div>
            <input type="text" v-model="inputValid"  class="app__search--input" placeholder="Search product by name, tag, id...">
        </div>
    `,
    data(){
        return {

        }
    },
    computed: {
        inputValid: {
            get(){
                return this.value
            },
            set(val){
                this.$emit('input', val)
            }
        }
    }
})


Vue.component('sort-comp',{
    props: ['value'],
    template: `
        <div class="app__sort">
            <span>Sort:</span>
            <select name="sort" class="app__sort--select" v-model="inputValid">
                <option value="asc">Product title A - Z</option>
                <option value="desc">Product title Z - A</option>
            </select>
            <div class="app__sort--icon">
                <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.12109 6.625C0.519531 6.625 0.21875 7.33594 0.65625 7.74609L3.91016 11C4.15625 11.2734 4.56641 11.2734 4.83984 11L8.09375 7.74609C8.50391 7.33594 8.20312 6.625 7.62891 6.625H1.12109ZM8.09375 3.75391L4.83984 0.5C4.56641 0.253906 4.15625 0.253906 3.91016 0.5L0.65625 3.75391C0.21875 4.19141 0.519531 4.875 1.12109 4.875H7.62891C8.20312 4.875 8.50391 4.19141 8.09375 3.75391Z" fill="#8F90A6"/>
                </svg>
            </div>
        </div>
    `,
    computed: {
        inputValid: {
            get(){
                return this.value
            },
            set(val){
                this.$emit('input', val)
            }
        }
    }

})


var app = new Vue ({
    el: '#app',
    data: {
        listProducts: [],
        productsFilter: [],
        checkedProducts: [],
        currentPage: 1,
        limit: 10,
        search: '',
        sort: 'asc'
    },
    created: async function(){
        let apiUrl = 'http://127.0.0.1:5500/products.json'
        try {
            this.listProducts = await this.getProductsFromApi(apiUrl) || []
        } catch (error) {
            console.log(error)
        }
        this.productsFilter = [...this.listProducts]
        this.checkedProducts = this.getProducts()
    },
    computed: {
        isChecked:{
            get(){
                return this.checkedProducts.length > 0 ? true : false
            },
            set(val){
                if(!val){
                    this.checkedProducts = []
                }else{
                    this.checkedProducts = this.getProducts() 
                }
            }
        },
        totalPage: function(){
            return Math.ceil(this.productsFilter.length / this.limit)
        },
        productsInOnePage: function(){
            let products = this.productsFilter.slice((this.currentPage - 1) * this.limit,this.limit * this.currentPage)
            return this.handleSort(this.sort,products)
        }
    },
    watch:{
        'search': function(value){
            this.productsFilter = this.handleChangeSearch(value)
        },
        // 'sort': function(val){
        //     this.productsInOnePage = this.handleSort(val)
        // }
    },
    methods: {
        handleCancle(e){
            console.log(e.target)
        },
        handleNext: function(){
            if(this.currentPage !== this.totalPage){
                ++this.currentPage
            }
        },
        handlePrev: function(){
            if(this.currentPage !== 1){
                --this.currentPage
            }
        },
        handleSort: function(val,prods){
            if(val && val == 'asc'){
                return prods.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
            }else{
                return prods.sort((a,b) => (a.name < b.name) ? 1 : ((b.name < a.name) ? -1 : 0))
            }
        },
        handleChangeSearch: function(val){
            if(val){
                this.currentPage = 1
                let searchVal = val.toLowerCase().trim();
                return this.listProducts.filter(prod => {
                    return prod.name.toLowerCase().includes(searchVal) || prod.id.includes(searchVal)
                })
            }else{
                return this.listProducts
            }
        },
        getProducts: function(){
            return JSON.parse(localStorage.getItem('products')) || []
        },
        setProducts: function(){
            localStorage.setItem('products',JSON.stringify(this.checkedProducts))
        },
        getProductsFromApi: async function(url){
            return (await fetch(url)).json()
        }
    }
})