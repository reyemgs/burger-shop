import ProductCategoryList from './ProductCategoryList.js';
import Basket from './Basket.js';

export default class SideBar {
    constructor() {
        this.sideBar = document.querySelector('#sidebar-wrapper');
        this.rightSide = document.querySelector('#rightside-wrapper');
        this.sideBar.className = 'active';

        this.sideBarButton = document.querySelector('.fa-bars');

        this.productCategoryList = new ProductCategoryList();
        this.basket = new Basket();
    }

    createSideBar() {
        this.productCategoryList.render();
        this.basket.render();
    }

    toggleSideBar() {
        this.sideBar.classList.toggle('active');
        this.rightSide.classList.toggle('active');
    }

    render() {
        this.createSideBar();
        this.sideBarButton.addEventListener('click', () => this.toggleSideBar());
    }
}
