const spotlights = document.querySelector('.spotlights');

async function getResponse() {
  if (!spotlights) return;

  try {
    const response = await fetch('./data/members.json');

    if (!response.ok) {
      throw new Error(`Unable to load members: ${response.status}`);
    }

    const data = await response.json();
    const cardsHome = cardHome(data);

    cardsHome.forEach((member) => {
      const section = document.createElement('section');
      const divHead = document.createElement('div');
      const h2 = document.createElement('h2');
      const img = document.createElement('img');
      const divBody = document.createElement('div');
      const contact = document.createElement('div');
      const address = document.createElement('address');
      const phone = document.createElement('address');
      const website = document.createElement('address');
      const link = document.createElement('a');

      divHead.classList.add('spotlightshead');
      h2.textContent = member.name;

      img.src = `./images/${member.image}`;
      img.alt = member.name;
      img.loading = 'lazy';

      divBody.classList.add('spotlightsbody');
      contact.classList.add('spotlightscontact');

      const membershipLabel = member.membershipLevel === 3 ? 'Gold Member' : 'Silver Member';
      address.textContent = `Address: ${member.address}`;
      phone.textContent = `Phone: ${member.phone}`;
      link.classList.add('spotlightslink');
      link.href = member.website;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = `${membershipLabel} • Visit website`;

      website.append(link);
      contact.append(address, phone, website);
      divBody.append(contact);
      divHead.append(h2, img);
      section.append(divHead, divBody);
      spotlights.append(section);
    });
  } catch (error) {
    console.error(error);
    spotlights.innerHTML = '<p class="spotlight-error">Spotlight businesses are unavailable right now.</p>';
  }
}

function cardHome(data) {
  const silverOrGold = data.filter((card) => card.membershipLevel === 2 || card.membershipLevel === 3);
  const shuffled = [...silverOrGold].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

getResponse();