import ProductCategoryList from './ProductCategoryList.js';
import Basket from './Basket.js';

export default class SideBar {
    constructor() {
        this.sideBar = document.querySelector('#sidebar-wrapper');
        this.sideBar.className = 'active';
        this.sideBarButton = document.querySelector('.fa-bars');

        this.productCategoryList = new ProductCategoryList();
        this.basket = new Basket();
    }

    createSideBar() {
        this.productCategoryList.render();
        this.basket.render();
    }

    render() {
        this.createSideBar();
        this.sideBarButton.addEventListener('click', () => this.toggleSideBar());
    }

    toggleSideBar() {
        this.sideBar.classList.toggle('active');
    }
}
