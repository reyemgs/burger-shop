import SideBar from './components/SideBar.js';
import ProductCard from './components/ProductCard.js';
import Fetch from './Fetch.js';

class App {
    constructor() {
        this.productItems = [];
        this.response = null;
        this.sidebar = new SideBar();
        this.init();
    }

    init() {
        (async () => {
            await this.request();
            await this.sidebar.render();
            await this.renderProductCards();
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
        for (let button of this.inBasketButton) {
            const id = button.dataset.productCardId;
            button.addEventListener('click', () => {
                this.sidebar.basket.addProduct(this.getProductItem(id));
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
