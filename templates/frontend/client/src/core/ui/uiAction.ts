import { createAction } from "@reduxjs/toolkit";

export const setLoader = createAction<{ state: boolean; feature: string }>(
  "SET_LOADER"
);
