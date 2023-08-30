export default class Section {
    constructor({userId, renderer, rendererForOwn}, containerSelector) {
        this._renderer = renderer;
        this._rendererForOwn = rendererForOwn;
        this._container = document.querySelector(containerSelector);
        this._userId = userId;
    }
    
    renderItems(items) {
        items.forEach(item => {
            let card = '';
            if (item.owner._id === this._userId) {  
                card = this._rendererForOwn(item)
            } else {
                card = this._renderer(item)
            }
            this._addItem(card);
        });
    }

    renderItem(item) {
        const card = this._rendererForOwn(item);
        this._container.prepend(card)
    }

    _addItem(card) {
        this._container.append(card)
    }
}
    