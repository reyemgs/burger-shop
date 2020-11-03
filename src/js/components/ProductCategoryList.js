export default class ProductCategoryList {
    constructor() {
        this.sideBar = document.querySelector('#sidebar-wrapper');
        this.menuItems = [
            { name: 'Пицца', category: 'pizza' },
            { name: 'Шаурма', category: 'shaurma' },
            { name: 'Сендвичи', category: 'sandwiches' },
            { name: 'Бургеры', category: 'burgers' },
            { name: 'Курица & Картофель', category: 'chicken' },
            { name: 'Тортилья & Салаты', category: 'salads' },
            { name: 'Напитки & Десерты', category: 'drinks' },
        ];
    }

    createProductCategoryList() {
        const menu = document.createElement('ul');
        menu.className = 'category-menu';
        for (let i = 0; i < this.menuItems.length; i++) {
            const li = document.createElement('li');
            li.setAttribute('id', this.menuItems[i].category);
            li.className = 'menu-item';
            li.innerHTML = this.menuItems[i].name;
            menu.append(li);
        }
        this.sideBar.append(menu);
    }

    // pagination(callback, productItems) {
    //     const items = document.querySelectorAll('.menu-item');
    //     for (const item of items) {
    //         const category = item.getAttribute('id');
    //         const filtered = productItems.filter(item => item.category === category);
    //     }
    // }

    render() {
        this.createProductCategoryList();
    }
}
