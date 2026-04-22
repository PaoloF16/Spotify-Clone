///////
const generi = [
  { nome: "Musica", colore: "#e61e32", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop" },
  { nome: "Podcast", colore: "#1e3264", img: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&h=200&fit=crop" },
  { nome: "Eventi in diretto", colore: "#9b4fcb", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop" },
  { nome: "Speciale per te", colore: "#0d73ec", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop" },
  { nome: "Novità", colore: "#608108", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop" },
  { nome: "Hip Hop", colore: "#ba5d07", img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=200&h=200&fit=crop" },
  { nome: "Pop", colore: "#477d95", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=200&fit=crop" },
  { nome: "Indie", colore: "#4b4b4b", img: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=200&h=200&fit=crop" },
  { nome: "Hit del momento", colore: "#7358ff", img: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=200&h=200&fit=crop" },
  { nome: "Rock", colore: "#c0392b", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=200&h=200&fit=crop" },
  { nome: "Dance", colore: "#0d73ec", img: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=200&h=200&fit=crop" },
  { nome: "Elettronica", colore: "#1e8a4c", img: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=200&h=200&fit=crop" },
  { nome: "R&B", colore: "#e91429", img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=200&h=200&fit=crop" },
  { nome: "Jazz", colore: "#ba5d07", img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=200&h=200&fit=crop" },
  { nome: "Classica", colore: "#1e3264", img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=200&h=200&fit=crop" },
  { nome: "Metal", colore: "#4b4b4b", img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&h=200&fit=crop" },
  { nome: "Reggae", colore: "#1e8a4c", img: "https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=200&h=200&fit=crop" },
  { nome: "Soul", colore: "#9b4fcb", img: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=200&h=200&fit=crop" },
  { nome: "Country", colore: "#ba5d07", img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=200&h=200&fit=crop" },
  { nome: "Latin", colore: "#e61e32", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=200&h=200&fit=crop" },
  { nome: "K-Pop", colore: "#e91429", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop" },
  { nome: "Anime", colore: "#9b4fcb", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&h=200&fit=crop" },
  { nome: "Gaming", colore: "#1e3264", img: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=200&h=200&fit=crop" },
  { nome: "Fiesta", colore: "#9b4fcb", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop" },
  { nome: "Relax", colore: "#2e6b6b", img: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=200&h=200&fit=crop" },
  { nome: "Concentrazione", colore: "#477d95", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop" },
  { nome: "Allenamento", colore: "#e61e32", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop" },
  { nome: "In auto", colore: "#1e3264", img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&h=200&fit=crop" },
  { nome: "Amore", colore: "#e91429", img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&h=200&fit=crop" },
  { nome: "Tendenze", colore: "#0d73ec", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&h=200&fit=crop" },
  { nome: "Blues", colore: "#1e5f8a", img: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=200&h=200&fit=crop" },
  { nome: "Folk", colore: "#5c7a29", img: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=200&h=200&fit=crop" },
  { nome: "Funk", colore: "#c27b07", img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&h=200&fit=crop" },
  { nome: "Opera", colore: "#8b1a1a", img: "https://images.unsplash.com/photo-1580809361436-42a7ec204889?w=200&h=200&fit=crop" },
  { nome: "Trap", colore: "#2d2d2d", img: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=200&h=200&fit=crop" },
  { nome: "Ambient", colore: "#2e6b6b", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=200&fit=crop" },
];

generi.forEach((card) => {
  document.getElementById("generi-wrapper").innerHTML += `
        <div class="col">
            <a href="#" class="col text-decoration-none text-white rounded-3 overflow-hidden position-relative d-block" style="background-color: ${card.colore}; height: 160px">
                <h3 class="p-2 fw-bold fs-5">${card.nome}</h3>
                <img src="${card.img}" class="position-absolute" style="width: 80px; transform: rotate(25deg) translate(10px, 10px); bottom: 1em; right:1em;" />
                </a>
        </div>
        `;
});
