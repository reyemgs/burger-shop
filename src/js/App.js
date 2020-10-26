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
            await this.createProductItemsObj();
            await this.sidebar.render();
            await this.renderProductCard();
        })();
    }

    async request() {
        const fetchApi = new Fetch();
        const data = await fetchApi.loadJSON('../../examples/data.json');
        this.response = data;
    }

    createProductItemsObj() {
        for (let item of this.response.menu) {
            this.productItems.push(item);
        }
    }

    renderProductCard() {
        for (let item of this.productItems) {
            const productCard = new ProductCard(item, this.response);
            productCard.createProductCard(item);
        }
    }
}

const app = new App();
