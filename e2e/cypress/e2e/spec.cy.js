describe("empty spec", () => {
  it("passes", () => {
    const ipServer = "164.68.122.24";
    cy.visit("https://pieraksts.mfa.gov.lv/ru/uzbekistan/step3");
    cy.server();
    cy.route("GET", "/ru/calendar/last-available-date").as("lastAvailableDate");
    cy.route("GET", "/ru/calendar/available-month-dates?year=2022&month=7").as("availableMonthDates");
    cy.get('input[name="Persons[0][first_name]"]')
      .type("Sachin")
      .should("have.value", "Sachin")
      .get('input[name="Persons[0][last_name]"]')
      .type("Joshi")
      .should("have.value", "Joshi")
      .get('input[name="e_mail"]')
      .type("email@mail.com")
      .should("have.value", "email@mail.com")
      .get('input[id="phone"]')
      .click({ force: true })
      .type("+998998887766")
      .should("have.value", "+998998887766")
      .get("form#mfa-form1")
      .submit()
      .get(".form-services--title.js-services")
      .click({ force: true })
      .get('label[for="Persons-0-227"]')
      .click({ force: true })
      .get('label[for="active-confirmation"]')
      .click({ force: true })
      .get("button.js-addService.description-button.text--submit[data-serviceid='Persons-0-227']")
      .click({ force: true })
      .get("form#mfa-form2")
      .submit();
    cy.wait("@lastAvailableDate").wait("@lastAvailableDate").wait("@availableMonthDates");
    cy.get("@lastAvailableDate.all").then(async xhrs => {
      // xhrs is an array of network call objects
      // await axios.post(`http://${ipServer}:8001/123456`, { data: xhrs[1].response.body });
    });
    cy.get("@availableMonthDates.all").then(async xhrs => {
      // xhrs is an array of network call objects
      if (xhrs[0].response.body === "Šobrīd visi pieejamie laiki ir aizņemti") {
        await fetch(`http://${ipServer}:8001/123456`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({ data: xhrs[0].response.body }),
        });
        // await axios.post(`http://${ipServer}:8001/123456`, { data: xhrs[0].response.body });
      }
    });
  });
});
