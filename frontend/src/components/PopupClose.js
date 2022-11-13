import React from "react";

function PopupClose(props) {
  const { children, ...rest } = props;

  React.useEffect(() => {
    function closePopupWithEsc(e) {
      if (e.key === "Escape") {
        children.props.onClose();
      }
    }

    function closePopupWithClick(e) {
      if (e.target.classList.contains("popup")) {
        children.props.onClose();
      }
    }

    document.addEventListener("click", closePopupWithClick);
    document.addEventListener("keydown", closePopupWithEsc);

    return () => {
      document.removeEventListener("click", closePopupWithClick);
      document.removeEventListener("keydown", closePopupWithEsc);
    };
  }, [children]);

  return <> {React.cloneElement(children, { ...rest })} </>;
}

export default PopupClose;