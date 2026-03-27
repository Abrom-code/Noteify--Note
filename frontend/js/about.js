document.addEventListener("DOMContentLoaded", function () {
  setupTeamSection();
  updateFooterYear();
});

function setupTeamSection() {
  const teamGrid = document.getElementById("teamGrid");
  if (!teamGrid) return;

  const teamMembers = [
    {
      id: 1,
      image: "../Static/image/dani.jpg",
      name: "Daniel Gashaw",
      github: "https://github.com/Maxd646",
    },
    {
      id: 2,
      image: "../Static/image/profile.png",
      name: "Liyuneh Rstey",
      github: "https://github.com/liyuneh",
    },
    {
      id: 3,
      image: "../Static/image/profile.png",
      name: "Addis Shiferaw",
      github: "https://github.com/adda-19",
    },
    {
      id: 4,
      image: "../Static/image/profile.png",
      name: "Amir Yimam",
      github: "https://github.com/miro129",
    },
    {
      id: 5,
      image: "../Static/image/profile.png",
      name: "Abrham Teramed",
      github: "https://github.com/Abrom-code",
    },
  ];

  teamMembers.forEach((member) => {
    const teamCard = document.createElement("div");
    teamCard.className = "team-card";
    teamCard.innerHTML = `
            <img src="${member.image}" alt="${member.name}" onerror="this.style.display='none'">
            <div class="team-info">
                <h3>${member.name}</h3>
                 <p>
        <a href="${member.github}" target="_blank">GitHub 🡽</a>
      </p>
            </div>
        `;
    teamGrid.appendChild(teamCard);
  });
}

function updateFooterYear() {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = "© " + new Date().getFullYear();
  }
}
