const spotlights = document.querySelector('.spotlights');

async function getResponse() {
  const response = await fetch('https://nadiagomezp.github.io/wdd230/chamber/json/data.json');
  
  if (response.ok) {
    const data = await response.json();
    const cardsHome = cardHome(data);
    for (let i = 0; i < 3; i++) {
      const section = document.createElement("section");
      const divHead = document.createElement("div");
      const h2 = document.createElement("h2");
      const img = document.createElement("img");
      const divBody = document.createElement("div");
      const contact = document.createElement("div");
      const address = document.createElement("address");
      const phone = document.createElement("address");
      const website = document.createElement("address");
      const link = document.createElement("a");

      divHead.classList.add("spotlightshead");
      h2.textContent = cardsHome[i].name;

      img.src = cardsHome[i].imageurl;
      img.alt = `${cardsHome[i].name}`;

      divBody.classList.add("spotlightsbody");
      contact.classList.add("spotlightscontact");

      address.textContent = `Address: ${cardsHome[i].address}`;
      phone.textContent = `Phone: ${cardsHome[i].phonenumber}`;
      link.classList.add("spotlightslink");
      link.href = cardsHome[i].url;
      link.setAttribute("target", "_blank");
      link.textContent = "Access the company website";

      website.append(link);
      contact.append(address, phone, website);
      divBody.append(contact);
      divHead.append(h2, img);
      section.append(divHead, divBody);
      spotlights.append(section);
    }
  }
}

function cardHome(data) {
  let cardArr = [];
  data.cards.forEach((card) => {
    if (
      card.membership === "Silver" ||
      card.membership === "Gold"
    ) {
      cardArr.push(card);
    }
  });
  const shuffled = [...cardArr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

getResponse();