import './index.css';

import Api from '../components/Api.js';
import Section from '../components/Section.js';
import PopupWithImage from '../components/PopupWithImage.js';
import PopupWithForm from '../components/PopupWithForm.js';
import UserInfo from '../components/UserInfo.js';
import Card from '../components/Card.js';
import FormValidator from '../components/FormValidator.js';
import { validationConfig } from '../utils/constants.js';
import PopupDeleteConfirm from '../components/PopupDeleteConfirm';

const editButton = document.querySelector('.profile__edit-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const nameInput = popupEditProfile.querySelector('input[name="name"]');
const descriptionInput = popupEditProfile.querySelector('input[name="about"]');

const addButton = document.querySelector('.profile__add-button');

const editAvatarButton = document.querySelector('.profile__avatar-edit-button');

const api = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-68',
    headers: {
      authorization: 'b14febf0-0b28-4e38-a9e1-9974acb9fa00'
    }
  });

const mestoUserInfo = new UserInfo({ nameSelector: '#profile-name', infoSelector: '#profile-description', avatarSelector: '.profile__avatar' });

let userId = '';
let userName = '';
let userAvatar = '';
let mestoSection = {};

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id
    userName = userData.name;
    userAvatar = userData.avatar;
    mestoSection = new Section({userId, renderer: createCard, rendererForOwn: createOwnCard}, '.elements');
    mestoSection.renderItems(cards);
    mestoUserInfo.setUserInfo({name: userData.name, info: userData.about, avatar: userData.avatar})  
  })
  .catch(err => {
    console.error(err);
  });

const opener = (cardTitle, cardImgSrc) => {
    photoPopup.open(cardTitle, cardImgSrc);
}

const delConfirmOpener = (card) => {
    deleteCardPopup.open(card);
}

const likeRemover = (id) => {
    return api.deleteLike(id)
    .then((info) => {
        return info;
    })
    .catch((err) => {
        console.error(err);
    });
};

const likePutter = (id) => {
    return api.putLike(id)
    .then((info) => {
        return info;
    })
    .catch((err) => {
        console.error(err);
    })
}

const createCard = (card) => {
    return new Card(userId, userName, userAvatar, card, '.card-template', opener, delConfirmOpener, likeRemover, likePutter).generateCard()
};

const createOwnCard = (card) => {
    return new Card(userId, userName, userAvatar, card, '.own-card-template', opener, delConfirmOpener, likeRemover, likePutter).generateCard()
};

const postUserInfo = ({name, about}) => {
    return api.patchUserInfo({name, about})
    .then((res) => {
        return res;
    })
    .catch((err) => {
        console.error(err);
    })
}

editAvatarButton.addEventListener('click', () => {
    editAvatarFormPopup.open();
}); 

function refreshEditForm() {
    api.getUserInfo()
    .then((info) => {
        nameInput.value = info.name;
        descriptionInput.value = info.about;
    })
    .catch((err) => {
        console.error(err);
    });
    editFormValidator.refreshValidityState();
}

editButton.addEventListener('click', () => {
    editFormPopup.open();
}); 

const refreshAddForm = () => {
    addFormValidator.refreshValidityState();
    addFormValidator.toggleSubmitButtonActivity();
};

addButton.addEventListener('click', () => {
    addFormPopup.open();
});

const avatarSubmitButton = document.querySelector('.popup__edit-avatar-form').querySelector(validationConfig["submitButtonSelector"]);
const editProfileSubmitButton = document.querySelector('.popup__edit-form').querySelector(validationConfig["submitButtonSelector"]);
const createCardSubmitButton = document.querySelector('.popup__add-form').querySelector(validationConfig["submitButtonSelector"]);

function handleAvatarFormSubmit (avatar) {
    avatarSubmitButton.textContent = 'Сохранение...';
    api.patchAvatar(avatar["input-avatar-link"])
    .then(res => {
        mestoUserInfo.setUserInfo({name: res["name"], info: res["about"], avatar: res["avatar"]});
        editAvatarFormPopup.close()
    })
    .catch((err) => {
        console.error(err);
    })
    .finally(() => {
        avatarSubmitButton.textContent = 'Сохранить'
    })
}

const refreshAvatarForm = () => {
    avatarFormValidator.refreshValidityState();
    avatarFormValidator.toggleSubmitButtonActivity();
};


const renderPostedCard = ({ 'input-place': name, 'input-link': link }) => {
    createCardSubmitButton.textContent = 'Сохранение...';
    api.postCard({name, link})
    .then((res) => {
        mestoSection.renderItem(res);
        addFormPopup.close();
    })
    .catch((err) => {
        console.error(err);
    })
    .finally(() => {
        createCardSubmitButton.textContent = 'Создать'
    })
}

const handleEditFormSubmit = ({ 'name': name, 'about': about }) => {
    editProfileSubmitButton.textContent = 'Сохранение...';
    postUserInfo({name, about})
    .then(res => {
        mestoUserInfo.setUserInfo({name: res["name"], info: res["about"], avatar: res["avatar"]})
        editFormPopup.close();
    })
    .catch((err) => {
        console.error(err);
    })
    .finally(() => {
        editProfileSubmitButton.textContent = 'Сохранить'
    })
}

function handleDeleteCardFormSubmit(card) {
    api.deleteCard(card.getAttribute("id"))
    .then((res) => {
        if (res.message === 'Пост удалён') {
            const idForDelete = card.getAttribute("id");
            document.querySelector(`[id="${idForDelete}"]`).remove();
            deleteCardPopup.close();
        }
    })
    .catch((err) => {
        console.error(err);
    });
}

const editAvatarFormPopup = new PopupWithForm({popupSelector: '.popup_type_edit-avatar', submitter: handleAvatarFormSubmit, refresher: refreshAvatarForm});
editAvatarFormPopup.setEventListeners();

const editFormPopup = new PopupWithForm({popupSelector: '.popup_type_edit', submitter: handleEditFormSubmit, refresher: refreshEditForm});
editFormPopup.setEventListeners();

const addFormPopup = new PopupWithForm({popupSelector: '.popup_type_add', submitter: renderPostedCard, refresher: refreshAddForm});
addFormPopup.setEventListeners();

const deleteCardPopup = new PopupDeleteConfirm({popupSelector: '.popup_type_confirm-delete', submitter: handleDeleteCardFormSubmit});
deleteCardPopup.setEventListeners();

const avatarFormValidator = new FormValidator(validationConfig, '.popup__edit-avatar-form');
const editFormValidator = new FormValidator(validationConfig, '.popup__edit-form');
const addFormValidator = new FormValidator(validationConfig, '.popup__add-form');

avatarFormValidator.enableValidation();
editFormValidator.enableValidation();
addFormValidator.enableValidation();

const photoPopup = new PopupWithImage('.popup_type_photo');
photoPopup.setEventListeners();

//THEME SWITCHER

const themeSwitcher = document.querySelector('.header__theme-switcher-input');
const themeButton = document.querySelector('.profile__theme-button');

const page = document.querySelector('.page');
if (page.classList.contains('dark-theme')) {
    themeSwitcher.checked = false;
    themeButton.title = 'Светлая тема';
}

themeSwitcher.addEventListener('change', function() {
  if (this.checked) {
    page.classList.add('light-theme');
    page.classList.remove('dark-theme');
    themeButton.title = 'Темная тема';
  } else {
    page.classList.add('dark-theme');
    page.classList.remove('light-theme');
    themeButton.title = 'Светлая тема';
  }
});