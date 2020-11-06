export default class ProductCategoryList {
    constructor() {
        this.sideBar = document.querySelector('#sidebar-wrapper');
        this.categoryItems = [
            { name: 'Пицца', category: 'pizza' },
            { name: 'Шаурма', category: 'shaurma' },
            { name: 'Сендвичи', category: 'sandwiches' },
            { name: 'Бургеры', category: 'burgers' },
            { name: 'Курица & Картофель', category: 'chicken' },
            { name: 'Тортилья & Салаты', category: 'salads' },
            { name: 'Напитки & Десерты', category: 'drinks' },
        ];
    }

    active(category) {
        const categories = document.querySelectorAll('.menu-item');
        for (const li of categories) {
            li.classList.remove('active');
            if (li.getAttribute('id') === category) {
                li.classList.add('active');
            }
        }
    }

    createProductCategoryList() {
        const menu = document.createElement('ul');
        menu.className = 'category-menu';
        for (let i = 0; i < this.categoryItems.length; i++) {
            const li = document.createElement('li');
            li.setAttribute('id', this.categoryItems[i].category);
            li.className = 'menu-item';
            li.innerHTML = this.categoryItems[i].name;
            menu.append(li);
        }
        this.sideBar.append(menu);
    }

    render() {
        this.createProductCategoryList();
    }
}
