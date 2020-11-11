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
            await this.closeModalEvent();
            await this.initProductCards();
            await this.initIngridientCards();
            await this.productCategoryEvents();
            await this.bootCategoryList('pizza');
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
        const modalFooter = document.querySelector('.modal-footer');

        // * IN BASKET BUTTON
        for (const button of inBasketButton) {
            const id = button.dataset.productCardId;

            button.addEventListener('click', () => {
                let product = this.getProductItem(id);
                let currentPage = this.modal.currentPage;
                let ingridientCategory = this.modal.getCategoryItem(currentPage);

                if (product.type === 'multiple') {
                    modalContent.innerHTML = '';
                    modalFooter.innerHTML = '';
                    this.modal.open(product);
                    this.activateSelectedComponents(product);
                    this.renderIngridientCards(ingridientCategory);
                    this.ingridientSelectionEvent(product);
                    return;
                }
                this.addInBasket(this.getProductItem(id));
                this.changeButtonWithoutModal(button);
            });
        }

        // * INCREASE QUANTITY
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

        // * DECREASE QUANTITY
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

    // * CLOSE MODAL EVENT
    closeModalEvent() {
        const closeModal = document.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            this.modal.close();
        });
    }

    ingridientSelectionEvent(product) {
        const ingridients = document.querySelectorAll('.ingridient-wrapper');

        for (const ingridient of ingridients) {
            const id = ingridient.getAttribute('data-ingridient-id');

            ingridient.addEventListener('click', () => {
                const ingridientItem = this.getIngridientItem(id);
                const ingridientCategory = ingridientItem.category;

                // check components is single or multiple
                if (!Array.isArray(product.components[ingridientCategory])) {
                    // if selected = true, then do nothing
                    if (ingridientItem.selected) return;

                    // reset price, set false value for item.selected
                    this.resetPriceForSingles(product, ingridientCategory);
                    this.setFalseForSingles(ingridientCategory);

                    // add component in product, increase price
                    product.components[ingridientCategory] = ingridientItem.key;
                    product.price += ingridientItem.price;

                    // set selected = true, make element active
                    ingridientItem.selected = true;
                    ingridientItem.active(id);

                    // update basket total price
                    this.updateBasket(product);
                }
                // selecting multiple ingridients// if item selected then do item false
                else if (ingridientItem.selected) {
                    // delete element when selected false
                    this.removeMultipleIngridient(
                        product.components[ingridientCategory],
                        ingridientItem.key
                    );

                    // decrease price
                    product.price -= ingridientItem.price;

                    // set false value
                    ingridientItem.selected = false;
                    ingridientItem.active(id);

                    // update basket total price
                    this.updateBasket(product);
                    return;
                }
                // add component in array, increase price
                else {
                    // push ingridients in array
                    product.components[ingridientCategory].push(ingridientItem.key);
                    product.price += ingridientItem.price;

                    // set selected = true, make element active
                    ingridientItem.selected = true;
                    ingridientItem.active(id);

                    // update basket total price
                    this.updateBasket(product);
                }
            });
        }
    }

    setFalseForSingles(category) {
        // filter ingridients by category
        const filteredIngridients = this.ingridientCards.filter(
            ingridient => ingridient.category === category
        );

        // set selected false
        for (const item of filteredIngridients) {
            item.selected = false;
        }
    }

    resetPriceForSingles(product, category) {
        // filter ingridients by category
        const filteredIngridients = this.ingridientCards.filter(
            ingridient => ingridient.category === category
        );

        // selected = true items subtract price value
        for (const item of filteredIngridients) {
            if (item.selected) {
                product.price -= item.price;
            }
        }
    }

    removeMultipleIngridient(ingridients, category) {
        const index = ingridients.findIndex(item => item === category);
        ingridients.splice(index, 1);
    }

    activateSelectedComponents(product) {
        // set false all components
        this.setFalseAllComponents();

        for (const item of this.ingridientCards) {
            // set true if components exist
            if (Array.isArray(product.components[item.category])) {
                for (const component of product.components[item.category]) {
                    if (component === item.key) {
                        item.selected = true;
                    }
                }
            } else if (product.components[item.category] === item.key) {
                item.selected = true;
            }
        }
    }

    setFalseAllComponents() {
        for (const item of this.ingridientCards) {
            item.selected = false;
        }
    }

    updateBasket(product) {
        const totalPrice = document.querySelector('.basket-total-price');

        // if product is added then do nothing
        if (!this.sidebar.basket.isAdded(product)) return;

        // update total price and products
        this.sidebar.basket.updateTotalPrice(totalPrice, this.sidebar.basket.addedProducts);
        this.sidebar.basket.updateProducts();
    }

    // * PAGINATION
    modalPaginationEvents() {
        const prevButton = document.querySelector('.previous-button');
        const nextButton = document.querySelector('.next-button');
        const modalContent = document.querySelector('.modal-content');
        const modalFooter = document.querySelector('.modal-footer');

        nextButton.addEventListener('click', () => {
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

                const button = document.querySelector('.modal-in-basket');
                const productButton = document.querySelector(
                    `button.in-basket-button[data-product-card-id="${product.id}"]`
                );

                if (this.sidebar.basket.isAdded(product)) {
                    this.changeModalButton(button);
                } else {
                    button.addEventListener('click', () => {
                        this.addInBasket(product);
                        this.changeProductCardButton(productButton);
                        this.modal.close();
                    });
                }
                return;
            }

            this.renderIngridientCards(this.modal.getCategoryItem(this.modal.currentPage));
            this.ingridientSelectionEvent(this.modal.currentProduct);
        });

        prevButton.addEventListener('click', () => {
            const product = this.modal.currentProduct;

            if (this.modal.currentPage === 1) return;

            modalContent.innerHTML = '';
            modalFooter.innerHTML = '';

            this.modal.previousPage();
            this.renderIngridientCards(this.modal.getCategoryItem(this.modal.currentPage));
            this.ingridientSelectionEvent(product);
        });
    }

    changeModalButton(elem) {
        elem.textContent = 'В КОРЗИНЕ';
        elem.style['background'] = '#757575';
        elem.style['color'] = 'white';
    }

    changeButtonWithoutModal(elem) {
        elem.textContent = 'В КОРЗИНЕ';
        elem.style['background'] = '#757575';
        elem.style['color'] = 'white';
    }

    changeProductCardButton(elem) {
        elem.textContent = 'ИЗМЕНИТЬ';
        elem.style['background'] = '#fa6045';
        elem.style['color'] = 'white';
    }

    changeStyleOfAdded(product) {
        const productButton = document.querySelector(
            `button.in-basket-button[data-product-card-id="${product.id}"]`
        );
        if (product.category == 'sandwiches' && product.added) {
            this.changeProductCardButton(productButton);
        } else if (product.added) {
            this.changeButtonWithoutModal(productButton);
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
                filtered.map(item => {
                    item.createProductCard(this.response);
                    this.changeStyleOfAdded(item);
                });
                this.events();
            });
        }
    }

    addInBasket(product) {
        this.sidebar.basket.addProduct(product);
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
