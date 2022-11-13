import React from "react";

function InfoTooltip({ isOpen, onClose, title, icon }) {
  return (
    <div className={`popup popup_tool ${isOpen && "popup_opened"}`} >
      <div className="popup__container">
        <button type="button" className="popup__btn popup__btn_action_close" onClick={onClose}></button>
        <img src={icon} alt="Статус-лого" className="popup__tool-logo"/>
        <h2 className="popup__title popup__title_small">{title}</h2>
      </div>
    </div>
  );
}

export default InfoTooltip;
