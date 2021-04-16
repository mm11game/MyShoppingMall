import { f7, Icon } from "framework7-react";
export const showToastBottom = (something) => {
  // Create toast
  let toastBottom;
  if (!toastBottom) {
    toastBottom = f7.toast.create({
      text: something,
      closeTimeout: 2000,
    });
  }
  // Open it
  toastBottom.open();
};
export const showToastIcon = (something) => {
  // Create toast
  let toastIcon;
  if (!toastIcon) {
    toastIcon = f7.toast.create({
      icon: '<i class="f7-icons">checkmark</i>',
      text: something,
      position: "center",
      closeTimeout: 2000,
    });
  }
  // Open it
  toastIcon.open();
};
export const showToastErr = (something) => {
  // Create toast
  let toastErr;
  if (!toastErr) {
    toastErr = f7.toast.create({
      icon: '<i class="f7-icons">multiply</i>',
      text: something,
      position: "center",
      closeTimeout: 2000,
    });
  }
  // Open it
  toastErr.open();
};
