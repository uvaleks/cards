export class FormValidator {
    constructor (settings, formSelector) {
        this._formSelector = formSelector;
        this._form = document.querySelector(this._formSelector);
        this._inputSelector = settings.inputSelector;
        this._inputs = this._form.querySelectorAll(this._inputSelector);
        this._inputsList = Array.from(this._inputs);
        this._submitButtonSelector = settings.submitButtonSelector;
        this._submitButton = this._form.querySelector(this._submitButtonSelector);
        this._inactiveButtonClass = settings.inactiveButtonClass;
        this._inputErrorClass = settings.inputErrorClass;
        this._errorClass = settings.errorClass;
    }
  
    _setInputValidityState(input, errorElement) {
        if (input.validity.valid) {
            input.classList.remove(this._inputErrorClass);
            if (errorElement !== undefined) {
                errorElement.textContent = '';
                errorElement.classList.remove(this._errorClass);
            };
        } else {
            input.classList.add(this._inputErrorClass);
            errorElement.textContent = input.validationMessage;
            errorElement.classList.add(this._errorClass);
        };
    }

    refreshValidityState() {
        this._inputsList.forEach((input) => {
                const errorElement = this._form.querySelector(`.${input.name}-error`);
                input.classList.remove(this._inputErrorClass);
                errorElement.textContent = '';
                errorElement.classList.remove(this._errorClass);
            });
    };
    
    _enableSubmitButton() {
        this._submitButton.removeAttribute('disabled');
        this._submitButton.classList.remove(this._inactiveButtonClass);
    }
    
    _disableSubmitButton() {
        this._submitButton.setAttribute('disabled', '');
        this._submitButton.classList.add(this._inactiveButtonClass);
    }
    
    _hasInvalidInput() {    
        return this._inputsList.some((inputElement) => { 
          return !inputElement.validity.valid;
        })
    }

    _toggleSubmitButtonActivity() {
        if (!this._hasInvalidInput()) {
            this._enableSubmitButton();
        } else {
            this._disableSubmitButton();
        };
    }

    _setListenters() {
            this._toggleSubmitButtonActivity();
    
            this._inputsList.forEach((input) => {
                input.addEventListener('input', () => {
                    const errorElement = this._form.querySelector(`.${input.name}-error`);
                    this._setInputValidityState(input, errorElement);
                    this._toggleSubmitButtonActivity();
                });
            });
    }

    enableValidation() {
        this._setListenters();
    }
}

