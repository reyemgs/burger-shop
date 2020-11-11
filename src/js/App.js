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
            sizes: '1x',
            breads: 'white-italian',
            vegetables: [],
            sauces: [],
            fillings: [],
        };

        this.standardComponents = {
            size: '1x',
            bread: 'white-italian',
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
        const inBasketButton = document.querySelectorAll('.in-basket-button');
        const increaseButton = document.querySelectorAll('.increase-button');
        const decreaseButton = document.querySelectorAll('.decrease-button');
        const totalPrice = document.querySelector('.basket-total-price');
        const modalContent = document.querySelector('.modal-content');
        const modalFooter = document.querySelector('.modal-footer');
        const closeModal = document.querySelector('.close-modal');

        // IN BASKET BUTTON
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
                    console.log(product);
                    this.activateSelectedComponents(product);
                    this.renderIngridientCards(ingridientCategory);
                    this.ingridientSelectionEvent(product);
                    return;
                }
                this.sidebar.basket.addProduct(this.getProductItem(id));
            });
        }

        // CLOSE MODAL
        closeModal.addEventListener('click', () => {
            this.modal.close();
            // this.clearModalData(this.modal.currentProduct);
        });

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

                    console.log(ingridientItem.key, ingridientItem.price);
                    console.log('product price', product.price);
                } else {
                    console.log(false);
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

    activateSelectedComponents(product) {
        // set false all components
        this.setFalseAllComponents();

        for (const item of this.ingridientCards) {
            // set true if components exist
            if (product.components[item.category] === item.key) {
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
        if (!this.sidebar.basket.isAdded(product)) return;
        this.sidebar.basket.updateTotalPrice(totalPrice, this.sidebar.basket.addedProducts);
        this.sidebar.basket.updateProducts();
    }

    // TODO !!! очистка модалки от выделения и очистка всех ингридиентов !!!
    // ingridientChoiceEvent(product) {
    //     const ingridients = document.querySelectorAll('.ingridient-wrapper');
    //     const basketTotalPrice = document.querySelector('.basket-total-price');

    //     for (const ingridient of ingridients) {
    //         const id = ingridient.getAttribute('data-ingridient-id');

    //         ingridient.addEventListener('click', () => {
    //             const item = this.getIngridientItem(id);
    //             if (item.category == 'sizes' || item.category == 'breads') {
    //                 this.selectSingle(item, product, id);
    //             } else if (
    //                 item.category == 'vegetables' ||
    //                 item.category == 'sauces' ||
    //                 item.category == 'fillings'
    //             ) {
    //                 if (this.sidebar.basket.isAdded(product)) {
    //                     this.sidebar.basket.updateTotalPrice(
    //                         basketTotalPrice,
    //                         this.sidebar.basket.addedProducts
    //                     );
    //                 }
    //                 this.selectMultiple(item, product, id);
    //             } else if (this.modal.currentPage === 6) {
    //                 product.components[item.category.slice(0, -1)] = this.components[item.category];
    //             }
    //         });
    //     }
    // }

    // selectSingle(item, product, id) {
    //     if (item.selected) return;

    //     this.components[item.category] = item.key;

    //     product.components[item.category.slice(0, -1)] = this.components[item.category];
    //     product.price += item.price;
    //     console.log(product.price);

    //     item.selected = true;
    //     this.deleteSingleIngridient(id, item.category, product);
    //     item.active(id);
    // }

    // selectMultiple(item, product, id) {
    //     if (this.components[item.category].includes(item.key) || item.selected) {
    //         this.deleteMultipleIngridient(product.components[item.category.slice(0, -1)], item.key);
    //         item.selected = false;
    //         item.active(id);
    //         return;
    //     }

    //     this.components[item.category].push(item.key);
    //     product.components[item.category.slice(0, -1)] = this.components[item.category];
    //     product.price += item.price;

    //     item.selected = true;
    //     item.active(id);
    // }

    // * PAGINATION
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

                const button = document.querySelector('.modal-in-basket');

                if (this.sidebar.basket.isAdded(product)) {
                    this.changeModalButton(button);
                } else {
                    button.addEventListener('click', () => {
                        this.addInBasketModal(product);
                        this.modal.close();
                    });
                }
                return;
            }

            this.renderIngridientCards(this.modal.getCategoryItem(this.modal.currentPage));
            this.ingridientSelectionEvent(this.modal.currentProduct);
        });

        prevButton.addEventListener('click', () => {
            const modalFooter = document.querySelector('.modal-footer');
            // const product = this.modal.currentProduct;

            if (this.modal.currentPage === 1) return;

            modalContent.innerHTML = '';
            modalFooter.innerHTML = '';

            this.modal.previousPage();
            this.renderIngridientCards(this.modal.getCategoryItem(this.modal.currentPage));
            this.ingridientSelectionEvent(this.modal.currentProduct);
        });
    }

    changeModalButton(elem) {
        elem.textContent = 'ДОБАВЛЕН';
        elem.style['background'] = 'grey';
        elem.style['color'] = 'white';
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

    addInBasketModal(product) {
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

    clearModalData(product) {
        for (let ingridient of this.ingridientCards) {
            ingridient.selected = false;
        }
        let sourceProduct = this.response.menu.find(item => item.name == product.name);
        product.price = sourceProduct.price;
        for (let item in product.components) {
            product.components[item] = this.standardComponents[item];
        }
        this.components = {
            sizes: '1x',
            breads: 'white-italian',
            vegetables: [],
            sauces: [],
            fillings: [],
        };
    }

    firstRenderIngridientsCards() {
        for (const item of this.ingridientCards) {
            if (item.key == '1x' || item.key == 'white-italian') {
                item.active(item.id);
                item.selected = true;
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

    // deleteMultipleIngridient(ingridients, category, product) {
    //     const index = ingridients.findIndex(item => item == category);
    //     ingridients.splice(index, 1);
    // }
}

const app = new App();
app.init();
