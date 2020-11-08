import SideBar from './components/SideBar.js';
import ProductCard from './components/ProductCard.js';
import Fetch from './Fetch.js';
import Modal from './components/Modal.js';
import IngridientCard from './components/IngridientCard.js';
import ProductCategoryList from './components/ProductCategoryList.js';

class App {
    constructor() {
        this.response = null;
        this.currentCategory = null;
        this.currentPage = null;

        this.productItems = [];
        this.ingridientCards = [];
        this.ingridientItems = {};
        this.components = {
            sizes: '',
            breads: '',
            vegetables: [],
            sauces: [],
            fillings: [],
        };

        this.sidebar = new SideBar();
        this.modal = new Modal();
        this.categoryList = new ProductCategoryList();
    }

    init() {
        (async () => {
            await this.request();
            await this.sidebar.render();
            await this.modal.createModal();
            await this.modalPaginationEvents();
            await this.initProductCards();
            await this.initIngridientCards();
            await this.productCategoryEvents();
            await this.bootCategoryList('sandwiches');
            await this.events();
        })();
    }

    async request() {
        const fetchApi = new Fetch();
        const data = await fetchApi.loadJSON('../../examples/data.json');
        this.response = data;
    }

    events() {
        const inBasketButton = document.querySelectorAll('.in-basket-button');
        const increaseButton = document.querySelectorAll('.increase-button');
        const decreaseButton = document.querySelectorAll('.decrease-button');
        const totalPrice = document.querySelector('.basket-total-price');
        const modalContent = document.querySelector('.modal-content');

        // IN BASKET BUTTON
        for (const button of inBasketButton) {
            const id = button.dataset.productCardId;

            button.addEventListener('click', () => {
                let product = this.getProductItem(id);
                let currentPage = this.modal.currentPage;
                let ingridientCategory = this.modal.getCategoryItem(currentPage);

                if (product.type === 'multiple') {
                    modalContent.innerHTML = '';
                    this.modal.open(product);
                    this.renderIngridientCards(ingridientCategory);
                    this.ingridientChoiceEvent();
                    return;
                }
                this.sidebar.basket.addProduct(this.getProductItem(id));
            });
        }

        // INCREASE QUANTITY
        for (const button of increaseButton) {
            const id = button.getAttribute('data-increase-id');
            const productQuantity = button.previousElementSibling;

            button.addEventListener('click', () => {
                const product = this.getProductItem(id);
                let addedProducts = this.sidebar.basket.addedProducts;

                product.increaseQuantity(productQuantity);
                if (!this.sidebar.basket.isAdded(product)) return;
                this.sidebar.basket.updateTotalPrice(totalPrice, addedProducts);
                this.sidebar.basket.updateProducts();
            });
        }

        // DECREASE QUANTITY
        for (const button of decreaseButton) {
            const id = button.getAttribute('data-decrease-id');
            const productQuantity = button.nextElementSibling;

            button.addEventListener('click', () => {
                const product = this.getProductItem(id);
                let addedProducts = this.sidebar.basket.addedProducts;

                product.decreaseQuantity(productQuantity);
                if (!this.sidebar.basket.isAdded(product)) return;
                this.sidebar.basket.updateTotalPrice(totalPrice, addedProducts);
                this.sidebar.basket.updateProducts();
            });
        }
    }

    productCategoryEvents() {
        const rightSideWrapper = document.querySelector('#rightside-wrapper');
        const menuItems = document.querySelectorAll('.menu-item');

        for (const item of menuItems) {
            const category = item.getAttribute('id');
            const filtered = this.productItems.filter(item => item.category === category);

            item.addEventListener('click', () => {
                this.currentCategory = category;
                this.categoryList.active(this.currentCategory);
                rightSideWrapper.innerHTML = '';
                filtered.map(item => item.createProductCard(this.response));
                this.events();
            });
        }
    }
    // TODO
    ingridientChoiceEvent(product) {
        const ingridients = document.querySelectorAll('.ingridient-wrapper');
        for (const ingridient of ingridients) {
            const id = ingridient.getAttribute('data-ingridient-id');
            ingridient.addEventListener('click', () => {
                const item = this.getIngridientItem(id);

                if (item.category == 'sizes' || item.category == 'breads') {
                    this.components[item.category] = item.key;
                    item.active(id);
                } else if (
                    item.category == 'vegetables' ||
                    item.category == 'sauces' ||
                    item.category == 'fillings'
                ) {
                    this.components[item.category].push(item.key);
                }
                // console.log(item);
                console.log(this.components);
            });
        }
    }

    modalPaginationEvents() {
        const prevButton = document.querySelector('.previous-button');
        const nextButton = document.querySelector('.next-button');
        const modalContent = document.querySelector('.modal-content');
        const modalFooter = document.querySelector('.modal-footer');

        nextButton.addEventListener('click', () => {
            const id = this.modal.currentProduct.id;
            const product = this.modal.currentProduct;

            if (this.modal.currentPage === this.modal.menuItems.length) return;

            modalContent.innerHTML = '';
            modalFooter.innerHTML = '';

            this.modal.nextPage();
            if (this.modal.currentPage === 6) {
                modalContent.append(
                    this.modal.currentProduct.createImage(),
                    this.modal.createDonePage(this.modal.currentProduct, this.response)
                );

                const button = document.querySelector(`button[data-product-card-id="${id}"]`);
                const cloneButton = document.importNode(button, true);

                cloneButton.addEventListener('click', () => this.sidebar.basket.addProduct(product));

                modalFooter.append(cloneButton);
                return;
            }

            this.renderIngridientCards(this.modal.getCategoryItem(this.modal.currentPage));
            this.ingridientChoiceEvent();
        });

        prevButton.addEventListener('click', () => {
            const modalFooter = document.querySelector('.modal-footer');

            if (this.modal.currentPage === 1) return;

            modalContent.innerHTML = '';
            modalFooter.innerHTML = '';

            this.modal.previousPage();
            this.renderIngridientCards(this.modal.getCategoryItem(this.modal.currentPage));
            this.ingridientChoiceEvent();
        });
    }

    initProductCards() {
        let id = 1;
        for (let item of this.response.menu) {
            item.id = id++;
            let productCard = new ProductCard(item);
            this.productItems.push(productCard);
        }
    }

    initIngridientCards() {
        let id = 1;
        for (let key in this.response) {
            if (key === 'menu' || key === 'version' || key == 'markets') continue;
            this.ingridientItems[key] = this.response[key];
            for (let prop in this.ingridientItems[key]) {
                this.ingridientItems[key][prop].id = id++;
                this.ingridientItems[key][prop].key = prop;
                this.ingridientItems[key][prop].category = key;
                const ingridient = new IngridientCard(this.ingridientItems[key][prop]);
                this.ingridientCards.push(ingridient);
            }
        }
    }

    renderIngridientCards(category) {
        const filtered = this.ingridientCards.filter(item => item.category == category);
        for (const item of filtered) {
            item.createIngridientCard();
        }
    }

    bootCategoryList(current) {
        const rightSideWrapper = document.querySelector('#rightside-wrapper');
        rightSideWrapper.innerHTML = '';

        this.currentCategory = current;

        const items = this.productItems.filter(item => item.category === this.currentCategory);
        items.map(item => item.createProductCard(this.response));
        this.categoryList.active(this.currentCategory);
    }

    getProductItem(id) {
        return this.productItems.find(productCard => productCard.id == id);
    }

    getIngridientItem(id) {
        return this.ingridientCards.find(ingridientCard => ingridientCard.id == id);
    }
}

const app = new App();
app.init();
