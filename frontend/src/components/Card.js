import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({_id,link,name,likes,owner,onCardClick, onCardDelete, onCardLike}) {
  const currentUser = React.useContext(CurrentUserContext);

  const card = {
    _id: _id,
    link: link,
    name: name,
    owner: owner,
    likes: likes,
  };

  const isOwn = owner === currentUser._id;
  const isLiked = likes.some((i) => i === currentUser._id);
  
  const cardLikeButtonClassName = `photo-grid__btn photo-grid__btn_action_like ${
    isLiked ? "photo-grid__btn_active" : ""
  }`;

  function handleClick() {
    onCardClick({
      link: link,
      name: name,
    });
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  return (
    <li className="photo-grid__item">
      <img src={link} alt={`Фотография: ${name}`} className="photo-grid__image" onClick={handleClick}/>
      {isOwn ? <button type="button" onClick={handleDeleteClick} className="photo-grid__delete-button" aria-label="Удалить карточку"></button> : ""}
      <div className="photo-grid__info">
        <h2 className="photo-grid__title">{name}</h2>
        <div className="photo-grid__like-container">
          <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
          <p className="photo-grid__like-amount">{likes.length}</p>
        </div>
      </div>
    </li>
  );
}

export default Card;