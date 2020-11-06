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

        this.productItems = [];
        this.ingridientCards = [];
        this.ingridientItems = {};
        this.components = {
            size: '',
            bread: '',
            vegetable: [],
            sauce: [],
            filling: [],
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
        this.inBasketButton = document.querySelectorAll('.in-basket-button'); // TODO исправить на const
        this.increaseButton = document.querySelectorAll('.increase-button');
        this.decreaseButton = document.querySelectorAll('.decrease-button');
        this.totalPrice = document.querySelector('.basket-total-price');
        this.modalContent = document.querySelector('.modal-content');

        // IN BASKET BUTTON
        for (const button of this.inBasketButton) {
            const id = button.dataset.productCardId;

            button.addEventListener('click', () => {
                if (this.getProductItem(id).type === 'multiple') {
                    this.modalContent.innerHTML = '';
                    this.modal.open(this.getProductItem(id));
                    this.renderIngridientCards(this.modal.getCategoryItem(this.modal.currentPage));
                    this.ingridientChoiceEvent();
                    return;
                }
                this.sidebar.basket.addProduct(this.getProductItem(id));
            });
        }

        // INCREASE QUANTITY
        for (const button of this.increaseButton) {
            const id = button.getAttribute('data-increase-id');
            const productQuantity = button.previousElementSibling;

            button.addEventListener('click', () => {
                this.getProductItem(id).increaseQuantity(productQuantity);
                if (!this.sidebar.basket.isAdded(this.getProductItem(id))) return;
                this.sidebar.basket.updateTotalPrice(this.totalPrice, this.sidebar.basket.addedProducts);
                this.sidebar.basket.updateProducts();
            });
        }

        // DECREASE QUANTITY
        for (const button of this.decreaseButton) {
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

    ingridientChoiceEvent() {
        this.ingridients = document.querySelectorAll('.ingridient-wrapper');
        for (const ingridient of this.ingridients) {
            const id = ingridient.getAttribute('data-ingridient-id');
            ingridient.addEventListener('click', () => {
                this.getIngridientItem(id).active(id);
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
                const cloneButton = document.importNode(button, true); // TODO удалить клон

                cloneButton.addEventListener('click', () =>
                    this.sidebar.basket.addProduct(this.getProductItem(id))
                ); // TODO пофиксить добавление в корзину

                modalFooter.append(cloneButton);
                return;
            }

            this.renderIngridientCards(this.modal.getCategoryItem(this.modal.currentPage));
            this.ingridientChoiceEvent();
        });

        prevButton.addEventListener('click', () => {
            const modalFooter = document.querySelector('.modal-footer');

            if (this.modal.currentPage === 1) return;

            this.modalContent.innerHTML = '';
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
        this.currentCategory = current;

        const rightSideWrapper = document.querySelector('#rightside-wrapper');
        rightSideWrapper.innerHTML = '';

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
