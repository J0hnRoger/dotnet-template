import { delay, http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://backend/joboffers", async () => {
    await delay();

    return HttpResponse.json([
      {
        id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d",
        title: "Lead Developer at Microsoft, Redmond",
      },
      {
        id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b6d",
        title: "Software Engineer, Amazon",
      },
      {
        id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b5d",
        title: "Software Engineer, Tesla",
      },
      {
        id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b4d",
        title: "Senior Azure Developer, Walmart",
      },
    ]);
  }),
];
