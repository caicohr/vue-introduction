Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
        <li v-for="error in errors"> {{ error }}</li>
    </ul>
    </p>
    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name">
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>
    

    <p>Would you recommend this product?</p>
    <label>
      Yes
      <input type="radio" value="Yes" v-model="recommend"/>
    </label>
    <label>
      No
      <input type="radio" value="No" v-model="recommend"/>
    </label>

    
    <p>
      <input type="submit" value="Submit">  
    </p>    
  
  </form>
  `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors:[],
            recommend:null
        }
    },
    methods: {
        onSubmit() {
            this.errors = []
            if (this.name && this.review && this.rating && this.recommend){
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
                recommend: this.recommend
            }
            this.$emit('review-sumbitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
            this.recommend = null
        } else {
            if(!this.name) this.errors.push("Name required.")
            if(!this.review) this.errors.push("Review required.")
            if(!this.rating) this.errors.push("Rating required.")
            if(!this.recommend) this.error.push("Recommendation required.")
        }
    }
    }
})
Vue.component('product-details', {
    props: {
      details: {
        type: Array,
        required: true
      }
    },
    template: `
      <ul>
        <li v-for="detail in details">{{ detail }}</li>
      </ul>
    `
  })
Vue.component('product', {
    props: {
        premium: {
            type:Boolean,
            required: true
        }
    },
    template:`
    <div class="product">
                <div class="product-image">
                    <img v-bind:src="image">
                </div>
                
                <div
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                class="product-info">
                    <h1>{{ title }}</h1>
                    <p>{{ description }}</p>
                    <p>Here is a <a v-bind:href="url">link</a> to a good site</p>
                    <p v-if="inventory > 10">In Stock</p>
                    <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
                    <p v-else style="text-decoration:line-through;">Out of Stock</p>
                    <p>Shipping: {{ shipping }}</p>
                    <span v-show="inventory>10">On Sale!</span>
                    <p>{{ sale }}</p>
                    
                    <product-details :details="details"></product-details>

                    <div
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    class="color-box"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)">
                    </div>
                    <p>Sizes</p>
                    <ul>
                        <li v-for="size in sizes">{{ size }}</li>
                    </ul>

                    <button
                    v-on:click="addToCart"
                    :disabled="inventory==0"
                    :class="{ disabledButton: inventory==0 }">Add to Cart</button>
                    
                    <button @click="removeFromCart">Remove from Cart</button>

                    <div>
                    <h2>Reviews</h2>
                    <p v-if="!reviews.length">There are no reviews yet.</p>
                    <ul>
                        <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                        </li>
                    </ul>
                    </div>

                    <product-review @review-sumbitted="addReview"></product-review>

                </div>
            </div>`,
            data() {
                return{
                    brand: 'Vue Mastery',
                    product:'Socks',
                    description: 'A pair of warm, fuzzy socks',
                    selectedVariant: 0,
                    url:'https://www.monsterhunterworld.com/',
                    onSale: true,
                    details: ["80 cotton", "20% polyester", "Gender-neutral"],
                    variants:[
                        {
                            variantId: 2234,
                            variantColor: "green",
                            variantImage: './assets/vmSocks-green-onWhite.jpg',
                            variantInventory: 50
                        },
                        {
                            variantId: 2235,
                            variantColor: "blue",
                            variantImage: './assets/vmSocks-blue-onWhite.jpg',
                            variantInventory: 0
                        }
                    ],
                    sizes: ["4", "5", "6", "7", "8", "9"],
                    reviews: []
                }
            },
            methods: {
                addToCart() {
                    this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
                },
                updateProduct(index) {
                    this.selectedVariant = index,
                    console.log(index)
                },
                removeFromCart() {
                    this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
                },
                addReview(productReview) {
                    this.reviews.push(productReview)
                }
            },
    computed: {
        title(){
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inventory() {
            return this.variants[this.selectedVariant].variantInventory
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' are on sale!'
            } 
                return  this.brand + ' ' + this.product + ' are not on sale'
            },
            shipping(){
                if (this.premium) {
                    return "Free"
                }
                return 2.99
            }
    
        },
    
})
var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeFromCart(id) {
            for(var i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                   this.cart.splice(i, 1);
                }
            }
        }
    }
})