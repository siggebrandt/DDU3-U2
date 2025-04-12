const cities = [
  { id: 2, name: "Lille", country: "France" },
  { id: 3, name: "Nantes", country: "France" },
  { id: 5, name: "Bremen", country: "Germany" },
  { id: 10, name: "Dresden", country: "Germany" },
  { id: 11, name: "Heidelberg", country: "Germany" },
  { id: 12, name: "Venice", country: "Italy" },
  { id: 13, name: "Rome", country: "Italy" },
  { id: 16, name: "Graz", country: "Austria" },
  { id: 20, name: "Basel", country: "Switzerland" },
  { id: 21, name: "Lucerne", country: "Switzerland" },
  { id: 22, name: "Kraków", country: "Poland" },
  { id: 23, name: "Warsaw", country: "Poland" },
  { id: 24, name: "Poznań", country: "Poland" },
  { id: 28, name: "Ghent", country: "Belgium" },
  { id: 31, name: "Maastricht", country: "Netherlands" },
  { id: 38, name: "Maribor", country: "Slovenia" },
  { id: 42, name: "Strasbourg", country: "France" },
];

import { serveFile, serveDir } from "jsr:@std/http";

function findHighestID(array) {
  let highestID = 0;
  for (const element of array) {
    if (element.id > highestID) {
      highestID = element.id;
    }
  }
  return highestID;
}

function handler(request) {
  const url = new URL(request.url);

  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Content-Type", "application/json");

  if (request.method == "GET") {
    if (url.pathname == "/cities") {
      return new Response(JSON.stringify(cities, null, 2), {
        status: 200,
        headers: headers,
      });
    }

    const cityIDRoute = new URLPattern({ pathname: "/cities/:id" });
    const citiesIDPage = cityIDRoute.exec(request.url);
    if (citiesIDPage) {
      if (url.pathname != "/cities/search") {
        const idOfCity = citiesIDPage.pathname.groups.id;

        const foundCity = cities.find((element) => element.id == idOfCity);

        if (foundCity != undefined) {
          return new Response(JSON.stringify(foundCity, null, 2), {
            status: 200,
            headers: headers,
          });
        } else {
          return new Response("no city with such ID exists", {
            status: 404,
            headers: headers,
          });
        }
      } else if (url.pathname == "/cities/search") {
        if (url.searchParams.has("text")) {
          const textFromParam = url.searchParams.get("text");

          let matchingCities = cities.filter((element) =>
            element.name.toLowerCase().includes(textFromParam.toLowerCase())
          );

          if (url.searchParams.has("country")) {
            const countryFromParam = url.searchParams.get("country");

            matchingCities = matchingCities.filter(
              (element) =>
                element.country.toLowerCase() == countryFromParam.toLowerCase()
            );
          }

          return new Response(JSON.stringify(matchingCities, null, 2), {
            headers: headers,
          });
        } else {
          return new Response('SearchParam "Text" is missig', {
            status: 400,
            headers: headers,
          });
        }
      }
    }
  }
  if (request.method == "POST") {
    if (url.pathname == "/cities") {
      request.json().then((requestBody) => {
        if (requestBody.name && requestBody.country) {
          console.log(requestBody);
          // kontrollera om stad med "name" finns,
          const foundCity = cities.find(
            (element) =>
              element.name.toLowerCase() == requestBody.name.toLowerCase()
          );
          console.log(foundCity);
          if (foundCity == undefined) {
            return new Response(
              JSON.stringify({
                id: findHighestID(cities) + 1,
                name: requestBody.name,
                country: requestBody.country,
              }),
              {
                status: 200,
                headers: headers,
              }
            );
          } else {
            // här har vi ett fel, iv kommer alldrig hit?
            return new Response("City-name already exists", {
              status: 409,
              headers: headers,
            });
          }
        } else {
          return new Response("Name or Country is missing", {
            status: 400,
            headers: headers,
          });
        }
        console.log(requestBody);
      });
    }
  }

  if (request.method == "DELETE") {
    if (url.pathname == "/cities") {
      //
    }
    //
  }
  if (url.pathname == "/favicon.ico") {
    return serveFile(request, "public/favicon.png");
  }
  return new Response("No Valid request (400)", { status: 400 });
}
Deno.serve(handler);
