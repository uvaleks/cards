import Popup from './Popup.js';

export default class PopupWithForm extends Popup {
    constructor({popupSelector, submitter, refresher}) {
        super(popupSelector);
        this._form = this._popup.querySelector('.popup__form');
        this._inputList = Array.from(this._form.querySelectorAll('.popup__input'));
        this._submitter = submitter;
        this._refresher = refresher;
    }

    open() {
        super.open();
        this._refresher();
    }

    close() {
        super.close();
        this._form.reset();
    }
  
    _getInputValues() {
        const values = {};
        this._inputList.forEach(input => {
            values[input.name] = input.value;
        });
        return values;
    }
  
    setEventListeners() {
        super.setEventListeners();
        this._form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this._submitter(this._getInputValues())
        });
    }
  }
  