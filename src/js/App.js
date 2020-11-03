import SideBar from './components/SideBar.js';
import ProductCard from './components/ProductCard.js';
import Fetch from './Fetch.js';
import Modal from './components/Modal.js';

class App {
    constructor() {
        this.productItems = [];
        this.response = null;
        this.sidebar = new SideBar();
        this.modal = new Modal();
        this.init();
    }

    init() {
        (async () => {
            await this.request();
            await this.sidebar.render();
            await this.modal.createModal();
            await this.renderProductCards();
            await this.pagination();
            await this.events();
        })();
    }

    async request() {
        const fetchApi = new Fetch();
        const data = await fetchApi.loadJSON('../../examples/data.json');
        this.response = data;
    }

    events() {
        this.inBasketButton = document.querySelectorAll('.in-basket-button');
        this.increaseButton = document.querySelectorAll('.increase-button');
        this.decreaseButton = document.querySelectorAll('.decrease-button');
        this.totalPrice = document.querySelector('.basket-total-price');
        for (let button of this.inBasketButton) {
            const id = button.dataset.productCardId;
            button.addEventListener('click', () => {
                this.sidebar.basket.addProduct(this.getProductItem(id));
            });
        }

        for (let button of this.increaseButton) {
            const id = button.getAttribute('data-increase-id');
            const productQuantity = button.previousElementSibling;
            button.addEventListener('click', () => {
                this.getProductItem(id).increaseQuantity(productQuantity);
                if (!this.sidebar.basket.isAdded(this.getProductItem(id))) return;
                this.sidebar.basket.updateTotalPrice(this.totalPrice, this.sidebar.basket.addedProducts);
                this.sidebar.basket.updateProducts();
            });
        }

        for (let button of this.decreaseButton) {
            const id = button.getAttribute('data-decrease-id');
            const productQuantity = button.nextElementSibling;
            button.addEventListener('click', () => {
                this.getProductItem(id).decreaseQuantity(productQuantity);
                if (!this.sidebar.basket.isAdded(this.getProductItem(id))) return;
                this.sidebar.basket.updateTotalPrice(this.totalPrice, this.sidebar.basket.addedProducts);
                this.sidebar.basket.updateProducts();
            });
        }
    }

    pagination() {
        const rightSideWrapper = document.querySelector('#rightside-wrapper');
        const menuItems = document.querySelectorAll('.menu-item');
        for (const item of menuItems) {
            const category = item.getAttribute('id');
            const filtered = this.productItems.filter(item => item.category === category);
            item.addEventListener('click', () => {
                rightSideWrapper.innerHTML = '';
                filtered.map(item => item.createProductCard(this.response));
                this.events();
            });
        }
    }

    getProductItem(id) {
        return this.productItems.find(productCard => productCard.id == id);
    }

    renderProductCards() {
        let id = 1;
        for (let item of this.response.menu) {
            item.id = id++;
            let productCard = new ProductCard(item);
            this.productItems.push(productCard);
            productCard.createProductCard(this.response);
        }
    }
}

const app = new App();
