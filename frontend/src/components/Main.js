import React from "react";
import Card from "./Card.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards,  onCardDelete, onCardLike}) {
  const currentUser = React.useContext(CurrentUserContext);
  return (
    <main className="content contaner-inner">
      <section className="profile">
        <div className="profile__avatar" style={{ backgroundImage: `url(${currentUser.avatar})` }} onClick={onEditAvatar}></div>
        <div className="profile__info">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button type="button" className="profile__btn profile__btn_action_edit" onClick={onEditProfile}></button>
            <p className="profile__status">{currentUser.about}</p>
        </div>
        <button type="button" className="profile__btn profile__btn_action_add" onClick={onAddPlace}></button>
      </section>
      <section className="photo-grid">
        <ul className="photo-grid__list">
        {cards.map((props) => (
          <Card
            key={props._id}
            _id={props._id}
            owner={props.owner}
            link={props.link}
            name={props.name}
            likes={props.likes}
            onCardClick={onCardClick}
            onCardDelete={onCardDelete}
            onCardLike={onCardLike}
          />
        ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;