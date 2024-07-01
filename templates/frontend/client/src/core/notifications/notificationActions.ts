import { createAction } from "@reduxjs/toolkit";

export const setNotification = createAction<{
  message: string;
  feature: string;
}>("SET_NOTIFICATION");
