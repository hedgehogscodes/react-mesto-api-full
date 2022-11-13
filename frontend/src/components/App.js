import React from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteCardPopup from "./DeleteCardPopup";
import InfoTooltip from "./InfoTooltip";
import PopupClose from "./PopupClose";

import { api } from "../utils/api.js";
import * as authApi from "../utils/authApi.js";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import ProtectedRoute from "./ProtectedRoute";

import Register from "./Register";
import Login from "./Login";

import successLogo from "../images/Success.svg";
import failLogo from "../images/Error.svg";

function App() {
  // ----------------Хуки useState для состояний попапов-------------------------
  const [isPopupEditOpen, setIsPopupEditOpen] = React.useState(false);
  const [isPopupAddOpen, setIsPopupAddOpen] = React.useState(false);
  const [isPopupAvatarOpen, setIsPopupAvatarOpen] = React.useState(false);
  const [isDeleteCardPopupOpen, setDeleteCardPopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  // ----------------------------------------------------------------------------

  //--------Состояния текущего пользователя, карточки и выбранная карточка-------
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [cardDelete, setCardDelete] = React.useState({});
  // ----------------------------------------------------------------------------

  //--------Состояние выполнения запроса ----------------------------------------
  const [isLoading, setLoading] = React.useState(false);
  // ----------------------------------------------------------------------------

  const history = useHistory();

  //--------Состояние авторизации,почта и сообщение попапа-----------------------
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userData, setUserData] = React.useState("");
  const [dataInfoTool, setDataInfoTool] = React.useState({
    title: "",
    icon: "",
  });
  //-----------------------------------------------------------------------------

  //--------Функции обрабатывающие нажатия кнопок -------------------------------
  function handleEditAvatarClick(){
    setIsPopupAvatarOpen(true);
    disableBodyScroll(document.body);
  }

  function handleEditProfileClick(){
    setIsPopupEditOpen(true);
    disableBodyScroll(document.body);
  }

  function handleAddPlaceClick(){
    setIsPopupAddOpen(true);
    disableBodyScroll(document.body);
  }

  function handleDeleteCardClick(card) {
    setDeleteCardPopupOpen(true);
    setCardDelete(card);
    disableBodyScroll(document.body);
  }

  function handleCardClick(card) {
    setSelectedCard({
      isOpen: true,
      link: card.link,
      title: card.name,
    });
    disableBodyScroll(document.body);
  }

  // ----------------------------------------------------------------------------

  //--------Функция для изменения состояния попапа Инфо--------------------------
  function handleInfoTooltipOpen() {
    setIsInfoTooltipOpen(true);
    disableBodyScroll(document.body);
  }
  // ----------------------------------------------------------------------------

  //--------Функция обрабатывающая нажатие кнопки закрытия ----------------------
  function closeAllPopups() {
    setIsPopupAvatarOpen(false);
    setIsPopupEditOpen(false);
    setIsPopupAddOpen(false);
    setDeleteCardPopupOpen(false);
    setSelectedCard({ isOpen: false });
    setLoading(false);
    setIsInfoTooltipOpen(false);
    enableBodyScroll(document.body);
  }
  //-----------------------------------------------------------------------------

  //--------Функции обрабатывающие Сабмиты --------------------------------------
  function handleUpdateUser({ name, status }) {
    setLoading(true);
    api
      .saveUserInfo({ name, status })
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error ${err}`));
  }

  function handleUpdateAvatar({ link }) {
    setLoading(true);
    api
      .editAvatar(link)
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error ${err}`));
  }

  function handleAddPlaceSubmit({ title, link }) {
    setLoading(true);
    api
      .addCard({ title, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error ${err}`));
  }
  //-----------------------------------------------------------------------------


  //--------Функции обрабатывающие лайк и удаление карточки --------------------
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((err) => console.log(`Error ${err}`));
  }

  function handleCardDelete(card) {
    setLoading(true);
    api
      .deleteCard(card._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error ${err}`));
  }
  //-----------------------------------------------------------------------------

  //--------Авторизация,регистрация,аутентификация и выход-----------------------
  function handleRegister(email, password) {
    authApi
      .register(email, password)
      .then((data) => {
        history.push("/sign-in");
        setDataInfoTool({ title: "Вы успешно зарегистрировались!", icon: successLogo });
        handleInfoTooltipOpen();
      })
      .catch((err) => {
        console.error(err);
        setDataInfoTool({ title: "Что-то пошло не так! Попробуйте ещё раз.", icon: failLogo });
        handleInfoTooltipOpen();
      });
  }

  function handleLogin(email, password) {
    authApi
      .authorize(email, password)
      .then((data) => {
        setUserData(email);
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
        history.push("/");
      })
      .catch((err) => {
        setDataInfoTool({ title: "Что-то пошло не так! Попробуйте ещё раз.", icon: failLogo });
        console.error(err);
        handleInfoTooltipOpen();
      });
  }

  function signOut() {
    setLoggedIn(false);
    setUserData("");
    localStorage.removeItem("token");
    history.push("/sign-in");
  }

  function checkToken() {
    const token = localStorage.getItem("token");
    if (token) {
      authApi
        .getContent(token)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setUserData(res.email);
            history.push("/");
          } else {
            setDataInfoTool({ title: "Что-то пошло не так! Попробуйте ещё раз.", icon: failLogo });
            handleInfoTooltipOpen();
          }
        })
        .catch((err) => console.log(err));
    }
  } 
  //-----------------------------------------------------------------------------
  
  React.useEffect(() => {
    checkToken();
    const promises = [api.getUserInfo(), api.getInitialCards()];
    Promise.all(promises)
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((err) => console.log(`Error ${err}`));
  }, [loggedIn]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="container">
          <Header headerMail={userData} signOut={signOut}/>

          <Switch>
            <ProtectedRoute
              exact 
              path="/"
              loggedIn={loggedIn}
              component={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardDelete={handleDeleteCardClick}
              onCardLike={handleCardLike}
            />

            <Route path="/sign-up">
              <Register handleRegister={handleRegister} />
            </Route>

            <Route path="/sign-in">
              <Login handleLogin={handleLogin} />
            </Route>

            <Route path="/">
              {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>

          {loggedIn && <Footer/>}
        </div>

        <EditAvatarPopup
          isOpen={isPopupAvatarOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />

        <EditProfilePopup
          isOpen={isPopupEditOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />
        
        <AddPlacePopup
          isOpen={isPopupAddOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
        />

        <DeleteCardPopup
          card={cardDelete}
          isOpen={isDeleteCardPopupOpen}
          onClose={closeAllPopups}
          onCardDelete={handleCardDelete}
          isLoading={isLoading}
        />
        
        <PopupClose>
          <ImagePopup
            card={selectedCard}
            isOpen={selectedCard.isOpen}
            onClose={closeAllPopups}
          />
        </PopupClose>

        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          title={dataInfoTool.title}
          icon={dataInfoTool.icon}
        />
        
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
