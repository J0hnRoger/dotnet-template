import { delay, http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://backend/transactions", async () => {
    await delay();

    return HttpResponse.json([
      {
        id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d",
        name: "Achat courses hebdomadaires",
      },
      {
        id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b6d",
        title: "Remboursement prêt maison",
      },
      {
        id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b5d",
        title: "Achat bouquins de dev'",
      },
      {
        id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b4d",
        title: "Electricité EDF",
      },
    ]);
  }),
];
