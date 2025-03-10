import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/ny-student": {};
  "/tilbakemelding": {};
  "/arrangementer": {};
  "/arrangementer/registrering/:id": {
    "id": string;
  };
  "/arrangementer/:id/:urlTitle?": {
    "id": string;
    "urlTitle"?: string;
  };
  "/bedrifter": {};
  "/toddel": {};
  "/sporreskjema/admin/:id": {
    "id": string;
  };
  "/sporreskjema/:id": {
    "id": string;
  };
  "/grupper": {};
  "/grupper/:slug": {
    "slug": string;
  };
  "/grupper/:slug/arrangementer": {
    "slug": string;
  };
  "/grupper/:slug/boter": {
    "slug": string;
  };
  "/grupper/:slug/lovverk": {
    "slug": string;
  };
  "/grupper/:slug/sporreskjemaer": {
    "slug": string;
  };
  "/badges": {};
  "/badges/kategorier": {};
  "/badges/alle": {};
  "/badges/erverv/:badgeId?": {
    "badgeId"?: string;
  };
  "/badges/kategorier/:categoryId": {
    "categoryId": string;
  };
  "/badges/kategorier/:categoryId/badges": {
    "categoryId": string;
  };
  "/badges/:badgeId": {
    "badgeId": string;
  };
  "/karriere": {};
  "/karriere/:id/:urlTitle?": {
    "id": string;
    "urlTitle"?: string;
  };
  "/galleri": {};
  "/galleri/:id/:urlTitle?": {
    "id": string;
    "urlTitle"?: string;
  };
  "/wiki/*": {
    "*": string;
  };
  "/wiki-old/*": {
    "*": string;
  };
  "/nyheter": {};
  "/nyheter/:id/:urtlTitle?": {
    "id": string;
    "urtlTitle"?: string;
  };
  "/profil/:userId?": {
    "userId"?: string;
  };
  "/kokebok/:studyId?/:classId?": {
    "studyId"?: string;
    "classId"?: string;
  };
  "/linker": {};
  "/qr-koder": {};
  "/opptak": {};
  "/admin/bannere": {};
  "/admin/ny-gruppe": {};
  "/admin/karriere/:jobPostId?": {
    "jobPostId"?: string;
  };
  "/admin/arrangementer/:eventId?": {
    "eventId"?: string;
  };
  "/admin/nyheter/:newsId?": {
    "newsId"?: string;
  };
  "/admin/brukere": {};
  "/admin/prikker": {};
  "/logg-inn": {};
  "/glemt-passord": {};
  "/ny-bruker/skjema": {};
  "/ny-bruker": {};
  "/ny-bruker/feide": {};
  "/endringslogg": {};
  "/*": {
    "*": string;
  };
};