import React from "react";

function ImagePopup({ card, isOpen, onClose }) {
  return (
    <div className={`popup popup_photo-view ${isOpen && "popup_opened"}`}>
      <div className="popup__photo-info">
        <img className="popup__img" src={card.link} alt={`Фотография: ${card.title}`}/>
        <p className="popup__img-info">{card.title}</p>
        <button type="button" className="popup__btn popup__btn_action_close" onClick={onClose}></button>
      </div>
    </div>
  );
}

export default ImagePopup;