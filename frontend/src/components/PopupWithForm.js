import React from "react";

function PopupWithForm({name, title, buttonTitle, children, isOpen, onClose, onSubmit}) {
  return (
    <div className={`popup popup_${name} ${isOpen && "popup_opened"}`} >
      <div className="popup__container">
        <button type="button" className="popup__btn popup__btn_action_close" onClick={onClose}></button>
        <h2 className="popup__title">{title}</h2>
        <form className={`popup__form popup__${name}-from`} name="popup-form" noValidate onSubmit={onSubmit}>
          {children}
          <button type="submit" value="Сохранить" className="popup__btn popup__btn_action_save">{buttonTitle}</button>
        </form>
      </div>
    </div>

  );
}

export default PopupWithForm;
