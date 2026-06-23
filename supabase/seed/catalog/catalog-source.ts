import type { TeamMeta } from "../../../packages/shared/src/index.ts";

/**
 * Hand-curated catalog source. Team display metadata + squads for the demo
 * teams, mirroring the ARG/MEX replay fixture lineups. The 48-team mega-album
 * structure (from openfootball) is a follow-up; this is enough for an accurate
 * match album now. Factual data only — see ticket VIT-5.
 */

export interface SquadPlayer {
  id: string;
  name: string;
  shirtNumber: number;
  position: string;
}

export interface TeamSquad {
  team: TeamMeta;
  players: SquadPlayer[];
}

export const ARGENTINA: TeamSquad = {
  team: { code: "ARG", name: "Argentina", flagEmoji: "🇦🇷", primaryColor: "#75AADB", secondaryColor: "#ffffff" },
  players: [
    { id: "arg-23", name: "Emiliano Martínez", shirtNumber: 23, position: "GK" },
    { id: "arg-26", name: "Nahuel Molina", shirtNumber: 26, position: "RB" },
    { id: "arg-13", name: "Cristian Romero", shirtNumber: 13, position: "CB" },
    { id: "arg-19", name: "Nicolás Otamendi", shirtNumber: 19, position: "CB" },
    { id: "arg-3", name: "Nicolás Tagliafico", shirtNumber: 3, position: "LB" },
    { id: "arg-7", name: "Rodrigo De Paul", shirtNumber: 7, position: "CM" },
    { id: "arg-5", name: "Leandro Paredes", shirtNumber: 5, position: "CM" },
    { id: "arg-20", name: "Alexis Mac Allister", shirtNumber: 20, position: "CM" },
    { id: "arg-11", name: "Ángel Di María", shirtNumber: 11, position: "RW" },
    { id: "arg-10", name: "Lionel Messi", shirtNumber: 10, position: "AM" },
    { id: "arg-9", name: "Julián Álvarez", shirtNumber: 9, position: "ST" },
    { id: "arg-1", name: "Juan Musso", shirtNumber: 1, position: "GK" },
    { id: "arg-12", name: "Gerónimo Rulli", shirtNumber: 12, position: "GK" },
    { id: "arg-2", name: "Germán Pezzella", shirtNumber: 2, position: "CB" },
    { id: "arg-25", name: "Lisandro Martínez", shirtNumber: 25, position: "CB" },
    { id: "arg-4", name: "Gonzalo Montiel", shirtNumber: 4, position: "RB" },
    { id: "arg-8", name: "Marcos Acuña", shirtNumber: 8, position: "LB" },
    { id: "arg-18", name: "Guido Rodríguez", shirtNumber: 18, position: "DM" },
    { id: "arg-24", name: "Enzo Fernández", shirtNumber: 24, position: "CM" },
    { id: "arg-17", name: "Giovani Lo Celso", shirtNumber: 17, position: "CM" },
    { id: "arg-22", name: "Lautaro Martínez", shirtNumber: 22, position: "ST" },
    { id: "arg-21", name: "Paulo Dybala", shirtNumber: 21, position: "AM" },
  ],
};

export const MEXICO: TeamSquad = {
  team: { code: "MEX", name: "Mexico", flagEmoji: "🇲🇽", primaryColor: "#006847", secondaryColor: "#ffffff" },
  players: [
    { id: "mex-1", name: "Guillermo Ochoa", shirtNumber: 1, position: "GK" },
    { id: "mex-3", name: "César Montes", shirtNumber: 3, position: "CB" },
    { id: "mex-15", name: "Johan Vásquez", shirtNumber: 15, position: "CB" },
    { id: "mex-23", name: "Jesús Gallardo", shirtNumber: 23, position: "LB" },
    { id: "mex-19", name: "Jorge Sánchez", shirtNumber: 19, position: "RB" },
    { id: "mex-4", name: "Edson Álvarez", shirtNumber: 4, position: "DM" },
    { id: "mex-16", name: "Héctor Herrera", shirtNumber: 16, position: "CM" },
    { id: "mex-22", name: "Hirving Lozano", shirtNumber: 22, position: "RW" },
    { id: "mex-8", name: "Carlos Rodríguez", shirtNumber: 8, position: "AM" },
    { id: "mex-11", name: "Alexis Vega", shirtNumber: 11, position: "LW" },
    { id: "mex-9", name: "Raúl Jiménez", shirtNumber: 9, position: "ST" },
    { id: "mex-13", name: "Carlos Acevedo", shirtNumber: 13, position: "GK" },
    { id: "mex-12", name: "Luis Malagón", shirtNumber: 12, position: "GK" },
    { id: "mex-2", name: "Néstor Araujo", shirtNumber: 2, position: "CB" },
    { id: "mex-5", name: "Israel Reyes", shirtNumber: 5, position: "CB" },
    { id: "mex-6", name: "Gerardo Arteaga", shirtNumber: 6, position: "LB" },
    { id: "mex-7", name: "Luis Romo", shirtNumber: 7, position: "DM" },
    { id: "mex-14", name: "Erick Sánchez", shirtNumber: 14, position: "CM" },
    { id: "mex-18", name: "Andrés Guardado", shirtNumber: 18, position: "CM" },
    { id: "mex-20", name: "Henry Martín", shirtNumber: 20, position: "ST" },
    { id: "mex-21", name: "Uriel Antuna", shirtNumber: 21, position: "RW" },
    { id: "mex-24", name: "Roberto Alvarado", shirtNumber: 24, position: "LW" },
  ],
};

/** Star players who roll at higher rarity (the rest are common). */
export const RARE_PLAYER_IDS = new Set<string>([
  "arg-10", // Messi
  "arg-9", // Julián Álvarez
  "arg-11", // Di María
  "arg-23", // E. Martínez
  "mex-9", // Jiménez
  "mex-22", // Lozano
  "mex-1", // Ochoa
  "eng-10", // Bellingham
  "eng-9", // Kane
  "eng-7", // Saka
  "fra-10", // Mbappé
  "fra-7", // Griezmann
  "ger-10", // Musiala
  "ger-17", // Wirtz
  "bra-11", // Vinícius Júnior
  "bra-7", // Raphinha
  "bra-9", // Endrick
  "esp-19", // Lamine Yamal
  "esp-26", // Pedri
  "por-7", // Ronaldo
  "por-8", // Bruno Fernandes
  "ned-4", // Van Dijk
  "ned-11", // Gakpo
  // WC2022 new nations
  "mar-2", // Hakimi
  "mar-4", // Amrabat
  "mar-19", // En-Nesyri
  "cro-8", // Kovačić
  "cro-20", // Gvardiol
  "jpn-8", // Doan
  "jpn-25", // Maeda
  "usa-10", // Pulisic
  "ksa-10", // Al Dawsari
  "aus-7", // Leckie
  "can-19", // Davies
  "sen-18", // Sarr
  "sen-3", // Koulibaly
  "uru-11", // Darwin Núñez
  "uru-8", // Valverde
  // Non-WC2022 new nations
  "nor-10", // Ødegaard
  "egy-11", // Salah (in LEGEND too, RARE_PLAYER_IDS just marks "at least rare")
  "col-7", // Luis Díaz
  "col-10", // James Rodríguez
]);

/** True icons — the legend tier. Their cards are legendary (like country badges).
 * Everyone in RARE_PLAYER_IDS but not here is "rare"; everyone else is common. */
export const LEGEND_PLAYER_IDS = new Set<string>([
  "arg-10", // Messi
  "por-7", // Ronaldo
  "fra-10", // Mbappé
  "bra-11", // Vinícius Júnior
  "eng-10", // Bellingham
  "esp-19", // Lamine Yamal
  "ger-10", // Musiala
  "cro-10", // Modrić
  "bel-7", // De Bruyne
  "kor-7", // Son
  "nor-9", // Haaland
  "egy-11", // Salah
]);

/** Player rarity by tier: legend → legendary, standout → rare, else common. */
export function playerRarity(id: string): "common" | "rare" | "legendary" {
  if (LEGEND_PLAYER_IDS.has(id)) return "legendary";
  if (RARE_PLAYER_IDS.has(id)) return "rare";
  return "common";
}

export const ENGLAND: TeamSquad = {
  team: { code: "ENG", name: "England", flagEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", primaryColor: "#ffffff", secondaryColor: "#0a3b8c" },
  players: [
    { id: "eng-1", name: "Jordan Pickford", shirtNumber: 1, position: "GK" },
    { id: "eng-2", name: "Kyle Walker", shirtNumber: 2, position: "RB" },
    { id: "eng-5", name: "John Stones", shirtNumber: 5, position: "CB" },
    { id: "eng-6", name: "Marc Guéhi", shirtNumber: 6, position: "CB" },
    { id: "eng-3", name: "Luke Shaw", shirtNumber: 3, position: "LB" },
    { id: "eng-4", name: "Declan Rice", shirtNumber: 4, position: "DM" },
    { id: "eng-10", name: "Jude Bellingham", shirtNumber: 10, position: "CM" },
    { id: "eng-7", name: "Bukayo Saka", shirtNumber: 7, position: "RW" },
    { id: "eng-11", name: "Phil Foden", shirtNumber: 11, position: "AM" },
    { id: "eng-9", name: "Harry Kane", shirtNumber: 9, position: "ST" },
    { id: "eng-19", name: "Marcus Rashford", shirtNumber: 19, position: "LW" },
    { id: "eng-24", name: "Cole Palmer", shirtNumber: 24, position: "AM" },
    { id: "eng-13", name: "Aaron Ramsdale", shirtNumber: 13, position: "GK" },
    { id: "eng-23", name: "Dean Henderson", shirtNumber: 23, position: "GK" },
    { id: "eng-12", name: "Kieran Trippier", shirtNumber: 12, position: "RB" },
    { id: "eng-14", name: "Ezri Konsa", shirtNumber: 14, position: "CB" },
    { id: "eng-15", name: "Lewis Dunk", shirtNumber: 15, position: "CB" },
    { id: "eng-8", name: "Jordan Henderson", shirtNumber: 8, position: "CM" },
    { id: "eng-16", name: "Conor Gallagher", shirtNumber: 16, position: "CM" },
    { id: "eng-25", name: "Eberechi Eze", shirtNumber: 25, position: "AM" },
    { id: "eng-17", name: "Anthony Gordon", shirtNumber: 17, position: "LW" },
    { id: "eng-18", name: "Ollie Watkins", shirtNumber: 18, position: "ST" },
  ],
};

export const FRANCE: TeamSquad = {
  team: { code: "FRA", name: "France", flagEmoji: "🇫🇷", primaryColor: "#1f3a93", secondaryColor: "#ffffff" },
  players: [
    { id: "fra-16", name: "Mike Maignan", shirtNumber: 16, position: "GK" },
    { id: "fra-5", name: "Jules Koundé", shirtNumber: 5, position: "RB" },
    { id: "fra-17", name: "William Saliba", shirtNumber: 17, position: "CB" },
    { id: "fra-4", name: "Dayot Upamecano", shirtNumber: 4, position: "CB" },
    { id: "fra-22", name: "Theo Hernández", shirtNumber: 22, position: "LB" },
    { id: "fra-8", name: "Aurélien Tchouaméni", shirtNumber: 8, position: "DM" },
    { id: "fra-25", name: "Eduardo Camavinga", shirtNumber: 25, position: "CM" },
    { id: "fra-7", name: "Antoine Griezmann", shirtNumber: 7, position: "AM" },
    { id: "fra-11", name: "Ousmane Dembélé", shirtNumber: 11, position: "RW" },
    { id: "fra-10", name: "Kylian Mbappé", shirtNumber: 10, position: "ST" },
    { id: "fra-20", name: "Bradley Barcola", shirtNumber: 20, position: "LW" },
    { id: "fra-12", name: "Randal Kolo Muani", shirtNumber: 12, position: "ST" },
    { id: "fra-1", name: "Alphonse Areola", shirtNumber: 1, position: "GK" },
    { id: "fra-23", name: "Brice Samba", shirtNumber: 23, position: "GK" },
    { id: "fra-2", name: "Jonathan Clauss", shirtNumber: 2, position: "RB" },
    { id: "fra-3", name: "Lucas Digne", shirtNumber: 3, position: "LB" },
    { id: "fra-6", name: "Manu Koné", shirtNumber: 6, position: "DM" },
    { id: "fra-13", name: "N'Golo Kanté", shirtNumber: 13, position: "DM" },
    { id: "fra-14", name: "Adrien Rabiot", shirtNumber: 14, position: "CM" },
    { id: "fra-9", name: "Olivier Giroud", shirtNumber: 9, position: "ST" },
    { id: "fra-15", name: "Marcus Thuram", shirtNumber: 15, position: "ST" },
    { id: "fra-26", name: "Michael Olise", shirtNumber: 26, position: "RW" },
  ],
};

export const GERMANY: TeamSquad = {
  team: { code: "GER", name: "Germany", flagEmoji: "🇩🇪", primaryColor: "#000000", secondaryColor: "#ffffff" },
  players: [
    { id: "ger-1", name: "Marc-André ter Stegen", shirtNumber: 1, position: "GK" },
    { id: "ger-6", name: "Joshua Kimmich", shirtNumber: 6, position: "RB" },
    { id: "ger-15", name: "Nico Schlotterbeck", shirtNumber: 15, position: "CB" },
    { id: "ger-4", name: "Jonathan Tah", shirtNumber: 4, position: "CB" },
    { id: "ger-18", name: "Maximilian Mittelstädt", shirtNumber: 18, position: "LB" },
    { id: "ger-23", name: "Robert Andrich", shirtNumber: 23, position: "DM" },
    { id: "ger-8", name: "Felix Nmecha", shirtNumber: 8, position: "CM" },
    { id: "ger-10", name: "Jamal Musiala", shirtNumber: 10, position: "AM" },
    { id: "ger-17", name: "Florian Wirtz", shirtNumber: 17, position: "AM" },
    { id: "ger-7", name: "Kai Havertz", shirtNumber: 7, position: "ST" },
    { id: "ger-19", name: "Leroy Sané", shirtNumber: 19, position: "RW" },
    { id: "ger-9", name: "Niclas Füllkrug", shirtNumber: 9, position: "ST" },
    { id: "ger-12", name: "Oliver Baumann", shirtNumber: 12, position: "GK" },
    { id: "ger-22", name: "Alexander Nübel", shirtNumber: 22, position: "GK" },
    { id: "ger-2", name: "Antonio Rüdiger", shirtNumber: 2, position: "CB" },
    { id: "ger-3", name: "David Raum", shirtNumber: 3, position: "LB" },
    { id: "ger-5", name: "Pascal Groß", shirtNumber: 5, position: "CM" },
    { id: "ger-11", name: "Deniz Undav", shirtNumber: 11, position: "ST" },
    { id: "ger-13", name: "Aleksandar Pavlović", shirtNumber: 13, position: "DM" },
    { id: "ger-14", name: "Maximilian Beier", shirtNumber: 14, position: "ST" },
    { id: "ger-16", name: "Waldemar Anton", shirtNumber: 16, position: "CB" },
    { id: "ger-20", name: "Benjamin Henrichs", shirtNumber: 20, position: "RB" },
  ],
};

export const BRAZIL: TeamSquad = {
  team: { code: "BRA", name: "Brazil", flagEmoji: "🇧🇷", primaryColor: "#fcd116", secondaryColor: "#009739" },
  players: [
    { id: "bra-1", name: "Alisson", shirtNumber: 1, position: "GK" },
    { id: "bra-2", name: "Danilo", shirtNumber: 2, position: "RB" },
    { id: "bra-3", name: "Marquinhos", shirtNumber: 3, position: "CB" },
    { id: "bra-4", name: "Gabriel Magalhães", shirtNumber: 4, position: "CB" },
    { id: "bra-6", name: "Wendell", shirtNumber: 6, position: "LB" },
    { id: "bra-5", name: "Bruno Guimarães", shirtNumber: 5, position: "DM" },
    { id: "bra-8", name: "Lucas Paquetá", shirtNumber: 8, position: "CM" },
    { id: "bra-7", name: "Raphinha", shirtNumber: 7, position: "RW" },
    { id: "bra-10", name: "Rodrygo", shirtNumber: 10, position: "AM" },
    { id: "bra-11", name: "Vinícius Júnior", shirtNumber: 11, position: "LW" },
    { id: "bra-9", name: "Endrick", shirtNumber: 9, position: "ST" },
    { id: "bra-12", name: "Bento", shirtNumber: 12, position: "GK" },
    { id: "bra-23", name: "Ederson", shirtNumber: 23, position: "GK" },
    { id: "bra-13", name: "Éder Militão", shirtNumber: 13, position: "CB" },
    { id: "bra-14", name: "Beraldo", shirtNumber: 14, position: "CB" },
    { id: "bra-15", name: "Bremer", shirtNumber: 15, position: "CB" },
    { id: "bra-16", name: "Guilherme Arana", shirtNumber: 16, position: "LB" },
    { id: "bra-17", name: "André", shirtNumber: 17, position: "DM" },
    { id: "bra-18", name: "João Gomes", shirtNumber: 18, position: "CM" },
    { id: "bra-19", name: "Savinho", shirtNumber: 19, position: "RW" },
    { id: "bra-20", name: "Gabriel Martinelli", shirtNumber: 20, position: "LW" },
    { id: "bra-21", name: "Matheus Cunha", shirtNumber: 21, position: "ST" },
  ],
};

export const SPAIN: TeamSquad = {
  team: { code: "ESP", name: "Spain", flagEmoji: "🇪🇸", primaryColor: "#c60b1e", secondaryColor: "#ffc400" },
  players: [
    { id: "esp-23", name: "Unai Simón", shirtNumber: 23, position: "GK" },
    { id: "esp-2", name: "Dani Carvajal", shirtNumber: 2, position: "RB" },
    { id: "esp-14", name: "Aymeric Laporte", shirtNumber: 14, position: "CB" },
    { id: "esp-4", name: "Robin Le Normand", shirtNumber: 4, position: "CB" },
    { id: "esp-24", name: "Marc Cucurella", shirtNumber: 24, position: "LB" },
    { id: "esp-16", name: "Rodri", shirtNumber: 16, position: "DM" },
    { id: "esp-8", name: "Fabián Ruiz", shirtNumber: 8, position: "CM" },
    { id: "esp-26", name: "Pedri", shirtNumber: 26, position: "CM" },
    { id: "esp-19", name: "Lamine Yamal", shirtNumber: 19, position: "RW" },
    { id: "esp-17", name: "Nico Williams", shirtNumber: 17, position: "LW" },
    { id: "esp-9", name: "Álvaro Morata", shirtNumber: 9, position: "ST" },
    { id: "esp-1", name: "Robert Sánchez", shirtNumber: 1, position: "GK" },
    { id: "esp-13", name: "David Raya", shirtNumber: 13, position: "GK" },
    { id: "esp-3", name: "Pau Cubarsí", shirtNumber: 3, position: "CB" },
    { id: "esp-5", name: "Dani Vivian", shirtNumber: 5, position: "CB" },
    { id: "esp-12", name: "Álex Grimaldo", shirtNumber: 12, position: "LB" },
    { id: "esp-6", name: "Mikel Merino", shirtNumber: 6, position: "CM" },
    { id: "esp-10", name: "Dani Olmo", shirtNumber: 10, position: "AM" },
    { id: "esp-21", name: "Mikel Oyarzabal", shirtNumber: 21, position: "ST" },
    { id: "esp-7", name: "Bryan Zaragoza", shirtNumber: 7, position: "LW" },
    { id: "esp-11", name: "Ferran Torres", shirtNumber: 11, position: "LW" },
    { id: "esp-15", name: "Martín Zubimendi", shirtNumber: 15, position: "DM" },
  ],
};

export const PORTUGAL: TeamSquad = {
  team: { code: "POR", name: "Portugal", flagEmoji: "🇵🇹", primaryColor: "#da291c", secondaryColor: "#046a38" },
  players: [
    { id: "por-1", name: "Diogo Costa", shirtNumber: 1, position: "GK" },
    { id: "por-2", name: "Diogo Dalot", shirtNumber: 2, position: "RB" },
    { id: "por-3", name: "Rúben Dias", shirtNumber: 3, position: "CB" },
    { id: "por-4", name: "Gonçalo Inácio", shirtNumber: 4, position: "CB" },
    { id: "por-20", name: "Nuno Mendes", shirtNumber: 20, position: "LB" },
    { id: "por-6", name: "João Palhinha", shirtNumber: 6, position: "DM" },
    { id: "por-8", name: "Bruno Fernandes", shirtNumber: 8, position: "CM" },
    { id: "por-10", name: "Bernardo Silva", shirtNumber: 10, position: "AM" },
    { id: "por-7", name: "Cristiano Ronaldo", shirtNumber: 7, position: "ST" },
    { id: "por-21", name: "Diogo Jota", shirtNumber: 21, position: "ST" },
    { id: "por-11", name: "Rafael Leão", shirtNumber: 11, position: "LW" },
    { id: "por-12", name: "José Sá", shirtNumber: 12, position: "GK" },
    { id: "por-22", name: "Rui Patrício", shirtNumber: 22, position: "GK" },
    { id: "por-5", name: "Raphaël Guerreiro", shirtNumber: 5, position: "LB" },
    { id: "por-13", name: "Danilo Pereira", shirtNumber: 13, position: "CB" },
    { id: "por-14", name: "António Silva", shirtNumber: 14, position: "CB" },
    { id: "por-15", name: "João Neves", shirtNumber: 15, position: "CM" },
    { id: "por-16", name: "Vitinha", shirtNumber: 16, position: "CM" },
    { id: "por-17", name: "Francisco Conceição", shirtNumber: 17, position: "RW" },
    { id: "por-23", name: "João Félix", shirtNumber: 23, position: "AM" },
    { id: "por-9", name: "Gonçalo Ramos", shirtNumber: 9, position: "ST" },
    { id: "por-25", name: "Pedro Neto", shirtNumber: 25, position: "RW" },
  ],
};

export const NETHERLANDS: TeamSquad = {
  team: { code: "NED", name: "Netherlands", flagEmoji: "🇳🇱", primaryColor: "#ff7f00", secondaryColor: "#21468b" },
  players: [
    { id: "ned-1", name: "Bart Verbruggen", shirtNumber: 1, position: "GK" },
    { id: "ned-22", name: "Denzel Dumfries", shirtNumber: 22, position: "RB" },
    { id: "ned-4", name: "Virgil van Dijk", shirtNumber: 4, position: "CB" },
    { id: "ned-3", name: "Stefan de Vrij", shirtNumber: 3, position: "CB" },
    { id: "ned-17", name: "Nathan Aké", shirtNumber: 17, position: "LB" },
    { id: "ned-6", name: "Jerdy Schouten", shirtNumber: 6, position: "DM" },
    { id: "ned-14", name: "Tijjani Reijnders", shirtNumber: 14, position: "CM" },
    { id: "ned-21", name: "Frenkie de Jong", shirtNumber: 21, position: "CM" },
    { id: "ned-11", name: "Cody Gakpo", shirtNumber: 11, position: "LW" },
    { id: "ned-10", name: "Memphis Depay", shirtNumber: 10, position: "ST" },
    { id: "ned-18", name: "Donyell Malen", shirtNumber: 18, position: "RW" },
    { id: "ned-23", name: "Mark Flekken", shirtNumber: 23, position: "GK" },
    { id: "ned-13", name: "Justin Bijlow", shirtNumber: 13, position: "GK" },
    { id: "ned-2", name: "Jurriën Timber", shirtNumber: 2, position: "RB" },
    { id: "ned-5", name: "Matthijs de Ligt", shirtNumber: 5, position: "CB" },
    { id: "ned-15", name: "Micky van de Ven", shirtNumber: 15, position: "CB" },
    { id: "ned-8", name: "Ryan Gravenberch", shirtNumber: 8, position: "CM" },
    { id: "ned-20", name: "Teun Koopmeiners", shirtNumber: 20, position: "CM" },
    { id: "ned-7", name: "Xavi Simons", shirtNumber: 7, position: "AM" },
    { id: "ned-9", name: "Wout Weghorst", shirtNumber: 9, position: "ST" },
    { id: "ned-19", name: "Brian Brobbey", shirtNumber: 19, position: "ST" },
    { id: "ned-16", name: "Joey Veerman", shirtNumber: 16, position: "CM" },
  ],
};

// ── WC2022 squads extracted from StatsBomb Open Data ─────────────────────────

export const CANADA: TeamSquad = {
  team: { code: "CAN", name: "Canada", flagEmoji: "🇨🇦", primaryColor: "#d52b1e", secondaryColor: "#ffffff" },
  players: [
    { id: "can-2", name: "Alistair Johnston", shirtNumber: 2, position: "RB" },
    { id: "can-3", name: "Sam Adekugbe", shirtNumber: 3, position: "LB" },
    { id: "can-4", name: "Kamal Miller", shirtNumber: 4, position: "CB" },
    { id: "can-5", name: "Steven Vitória", shirtNumber: 5, position: "CB" },
    { id: "can-10", name: "David Hoilett", shirtNumber: 10, position: "RW" },
    { id: "can-11", name: "Tajon Buchanan", shirtNumber: 11, position: "LW" },
    { id: "can-14", name: "Mark Kaye", shirtNumber: 14, position: "CM" },
    { id: "can-17", name: "Cyle Larin", shirtNumber: 17, position: "ST" },
    { id: "can-18", name: "Milan Borjan", shirtNumber: 18, position: "GK" },
    { id: "can-19", name: "Alphonso Davies", shirtNumber: 19, position: "LB" },
    { id: "can-21", name: "Jonathan Osorio", shirtNumber: 21, position: "CM" },
    { id: "can-1", name: "Maxime Crépeau", shirtNumber: 1, position: "GK" },
    { id: "can-22", name: "Dayne St. Clair", shirtNumber: 22, position: "GK" },
    { id: "can-6", name: "Moïse Bombito", shirtNumber: 6, position: "CB" },
    { id: "can-15", name: "Derek Cornelius", shirtNumber: 15, position: "CB" },
    { id: "can-12", name: "Richie Laryea", shirtNumber: 12, position: "RB" },
    { id: "can-7", name: "Stephen Eustáquio", shirtNumber: 7, position: "CM" },
    { id: "can-13", name: "Atiba Hutchinson", shirtNumber: 13, position: "DM" },
    { id: "can-20", name: "Jonathan David", shirtNumber: 20, position: "ST" },
    { id: "can-16", name: "Liam Millar", shirtNumber: 16, position: "LW" },
    { id: "can-9", name: "Lucas Cavallini", shirtNumber: 9, position: "ST" },
    { id: "can-8", name: "Ismaël Koné", shirtNumber: 8, position: "CM" },
  ],
};

export const MOROCCO: TeamSquad = {
  team: { code: "MAR", name: "Morocco", flagEmoji: "🇲🇦", primaryColor: "#c1272d", secondaryColor: "#006233" },
  players: [
    { id: "mar-1", name: "Yassine Bounou", shirtNumber: 1, position: "GK" },
    { id: "mar-2", name: "Achraf Hakimi", shirtNumber: 2, position: "RB" },
    { id: "mar-4", name: "Sofyan Amrabat", shirtNumber: 4, position: "DM" },
    { id: "mar-7", name: "Hakim Ziyech", shirtNumber: 7, position: "RW" },
    { id: "mar-11", name: "Abdelhamid Sabiri", shirtNumber: 11, position: "CM" },
    { id: "mar-17", name: "Sofiane Boufal", shirtNumber: 17, position: "LW" },
    { id: "mar-18", name: "Jawad El Yamiq", shirtNumber: 18, position: "CB" },
    { id: "mar-19", name: "Youssef En-Nesyri", shirtNumber: 19, position: "ST" },
    { id: "mar-20", name: "Achraf Dari", shirtNumber: 20, position: "CB" },
    { id: "mar-23", name: "Bilal El Khannous", shirtNumber: 23, position: "AM" },
    { id: "mar-25", name: "Yahia Attiyat Allah", shirtNumber: 25, position: "LB" },
    { id: "mar-12", name: "Munir Mohamedi", shirtNumber: 12, position: "GK" },
    { id: "mar-22", name: "Anas Zniti", shirtNumber: 22, position: "GK" },
    { id: "mar-3", name: "Noussair Mazraoui", shirtNumber: 3, position: "RB" },
    { id: "mar-5", name: "Nayef Aguerd", shirtNumber: 5, position: "CB" },
    { id: "mar-6", name: "Romain Saïss", shirtNumber: 6, position: "CB" },
    { id: "mar-8", name: "Azzedine Ounahi", shirtNumber: 8, position: "CM" },
    { id: "mar-15", name: "Selim Amallah", shirtNumber: 15, position: "CM" },
    { id: "mar-10", name: "Amine Harit", shirtNumber: 10, position: "AM" },
    { id: "mar-9", name: "Soufiane Rahimi", shirtNumber: 9, position: "ST" },
    { id: "mar-13", name: "Abde Ezzalzouli", shirtNumber: 13, position: "LW" },
    { id: "mar-24", name: "Eliesse Ben Seghir", shirtNumber: 24, position: "AM" },
  ],
};

export const IRAN: TeamSquad = {
  team: { code: "IRN", name: "Iran", flagEmoji: "🇮🇷", primaryColor: "#239f40", secondaryColor: "#da0000" },
  players: [
    { id: "irn-1", name: "Alireza Beiranvand", shirtNumber: 1, position: "GK" },
    { id: "irn-3", name: "Ehsan Hajsafi", shirtNumber: 3, position: "LB" },
    { id: "irn-5", name: "Milad Mohammadi", shirtNumber: 5, position: "LB" },
    { id: "irn-6", name: "Saeid Ezatolahi", shirtNumber: 6, position: "DM" },
    { id: "irn-8", name: "Morteza Pouraliganji", shirtNumber: 8, position: "CB" },
    { id: "irn-9", name: "Mehdi Taremi", shirtNumber: 9, position: "ST" },
    { id: "irn-17", name: "Ali Gholizadeh", shirtNumber: 17, position: "RW" },
    { id: "irn-19", name: "Majid Hosseini", shirtNumber: 19, position: "CB" },
    { id: "irn-20", name: "Sardar Azmoun", shirtNumber: 20, position: "ST" },
    { id: "irn-21", name: "Ahmad Nourollahi", shirtNumber: 21, position: "CM" },
    { id: "irn-23", name: "Ramin Rezaeian", shirtNumber: 23, position: "RB" },
    { id: "irn-12", name: "Amir Abedzadeh", shirtNumber: 12, position: "GK" },
    { id: "irn-22", name: "Payam Niazmand", shirtNumber: 22, position: "GK" },
    { id: "irn-2", name: "Sadegh Moharrami", shirtNumber: 2, position: "RB" },
    { id: "irn-4", name: "Shojae Khalilzadeh", shirtNumber: 4, position: "CB" },
    { id: "irn-13", name: "Hossein Kanaanizadegan", shirtNumber: 13, position: "CB" },
    { id: "irn-7", name: "Alireza Jahanbakhsh", shirtNumber: 7, position: "RW" },
    { id: "irn-15", name: "Omid Noorafkan", shirtNumber: 15, position: "DM" },
    { id: "irn-18", name: "Mehdi Ghayedi", shirtNumber: 18, position: "LW" },
    { id: "irn-10", name: "Karim Ansarifard", shirtNumber: 10, position: "ST" },
    { id: "irn-16", name: "Allahyar Sayyadmanesh", shirtNumber: 16, position: "ST" },
    { id: "irn-24", name: "Saman Ghoddos", shirtNumber: 24, position: "AM" },
  ],
};

export const CROATIA: TeamSquad = {
  team: { code: "CRO", name: "Croatia", flagEmoji: "🇭🇷", primaryColor: "#ff0000", secondaryColor: "#ffffff" },
  players: [
    { id: "cro-1", name: "Dominik Livaković", shirtNumber: 1, position: "GK" },
    { id: "cro-2", name: "Josip Stanišić", shirtNumber: 2, position: "RB" },
    { id: "cro-4", name: "Ivan Perišić", shirtNumber: 4, position: "LW" },
    { id: "cro-7", name: "Lovro Majer", shirtNumber: 7, position: "AM" },
    { id: "cro-8", name: "Mateo Kovačić", shirtNumber: 8, position: "CM" },
    { id: "cro-9", name: "Andrej Kramarić", shirtNumber: 9, position: "ST" },
    { id: "cro-10", name: "Luka Modrić", shirtNumber: 10, position: "CM" },
    { id: "cro-14", name: "Marko Livaja", shirtNumber: 14, position: "ST" },
    { id: "cro-18", name: "Mislav Oršić", shirtNumber: 18, position: "RW" },
    { id: "cro-20", name: "Joško Gvardiol", shirtNumber: 20, position: "CB" },
    { id: "cro-24", name: "Josip Šutalo", shirtNumber: 24, position: "CB" },
    { id: "cro-12", name: "Ivica Ivušić", shirtNumber: 12, position: "GK" },
    { id: "cro-23", name: "Nediljko Labrović", shirtNumber: 23, position: "GK" },
    { id: "cro-5", name: "Martin Erlić", shirtNumber: 5, position: "CB" },
    { id: "cro-6", name: "Duje Ćaleta-Car", shirtNumber: 6, position: "CB" },
    { id: "cro-19", name: "Borna Sosa", shirtNumber: 19, position: "LB" },
    { id: "cro-22", name: "Josip Juranović", shirtNumber: 22, position: "RB" },
    { id: "cro-11", name: "Marcelo Brozović", shirtNumber: 11, position: "DM" },
    { id: "cro-15", name: "Mario Pašalić", shirtNumber: 15, position: "CM" },
    { id: "cro-13", name: "Nikola Vlašić", shirtNumber: 13, position: "AM" },
    { id: "cro-16", name: "Ante Budimir", shirtNumber: 16, position: "ST" },
    { id: "cro-17", name: "Bruno Petković", shirtNumber: 17, position: "ST" },
  ],
};

export const BELGIUM: TeamSquad = {
  team: { code: "BEL", name: "Belgium", flagEmoji: "🇧🇪", primaryColor: "#e30613", secondaryColor: "#fdda24" },
  players: [
    { id: "bel-1", name: "Thibaut Courtois", shirtNumber: 1, position: "GK" },
    { id: "bel-2", name: "Toby Alderweireld", shirtNumber: 2, position: "CB" },
    { id: "bel-5", name: "Jan Vertonghen", shirtNumber: 5, position: "CB" },
    { id: "bel-6", name: "Axel Witsel", shirtNumber: 6, position: "DM" },
    { id: "bel-7", name: "Kevin De Bruyne", shirtNumber: 7, position: "AM" },
    { id: "bel-11", name: "Yannick Carrasco", shirtNumber: 11, position: "LW" },
    { id: "bel-14", name: "Dries Mertens", shirtNumber: 14, position: "AM" },
    { id: "bel-15", name: "Thomas Meunier", shirtNumber: 15, position: "RB" },
    { id: "bel-17", name: "Leandro Trossard", shirtNumber: 17, position: "ST" },
    { id: "bel-19", name: "Leander Dendoncker", shirtNumber: 19, position: "CM" },
    { id: "bel-21", name: "Timothy Castagne", shirtNumber: 21, position: "LB" },
    { id: "bel-12", name: "Koen Casteels", shirtNumber: 12, position: "GK" },
    { id: "bel-13", name: "Matz Sels", shirtNumber: 13, position: "GK" },
    { id: "bel-3", name: "Arthur Theate", shirtNumber: 3, position: "CB" },
    { id: "bel-4", name: "Wout Faes", shirtNumber: 4, position: "CB" },
    { id: "bel-24", name: "Zeno Debast", shirtNumber: 24, position: "CB" },
    { id: "bel-8", name: "Youri Tielemans", shirtNumber: 8, position: "CM" },
    { id: "bel-18", name: "Orel Mangala", shirtNumber: 18, position: "DM" },
    { id: "bel-20", name: "Charles De Ketelaere", shirtNumber: 20, position: "AM" },
    { id: "bel-9", name: "Loïs Openda", shirtNumber: 9, position: "ST" },
    { id: "bel-10", name: "Romelu Lukaku", shirtNumber: 10, position: "ST" },
    { id: "bel-22", name: "Jérémy Doku", shirtNumber: 22, position: "RW" },
  ],
};

export const ECUADOR: TeamSquad = {
  team: { code: "ECU", name: "Ecuador", flagEmoji: "🇪🇨", primaryColor: "#ffd100", secondaryColor: "#0072ce" },
  players: [
    { id: "ecu-1", name: "Hernán Galíndez", shirtNumber: 1, position: "GK" },
    { id: "ecu-2", name: "Felix Torres", shirtNumber: 2, position: "CB" },
    { id: "ecu-3", name: "Piero Hincapié", shirtNumber: 3, position: "CB" },
    { id: "ecu-7", name: "Pervis Estupiñán", shirtNumber: 7, position: "LB" },
    { id: "ecu-8", name: "Carlos Gruezo", shirtNumber: 8, position: "DM" },
    { id: "ecu-11", name: "Michael Estrada", shirtNumber: 11, position: "ST" },
    { id: "ecu-13", name: "Enner Valencia", shirtNumber: 13, position: "ST" },
    { id: "ecu-17", name: "Angelo Preciado", shirtNumber: 17, position: "RB" },
    { id: "ecu-19", name: "Gonzalo Plata", shirtNumber: 19, position: "RW" },
    { id: "ecu-21", name: "Alan Franco", shirtNumber: 21, position: "CM" },
    { id: "ecu-23", name: "Moisés Caicedo", shirtNumber: 23, position: "CM" },
    { id: "ecu-12", name: "Moisés Ramírez", shirtNumber: 12, position: "GK" },
    { id: "ecu-22", name: "Alexander Domínguez", shirtNumber: 22, position: "GK" },
    { id: "ecu-4", name: "Robert Arboleda", shirtNumber: 4, position: "CB" },
    { id: "ecu-5", name: "Joel Ordóñez", shirtNumber: 5, position: "CB" },
    { id: "ecu-6", name: "William Pacho", shirtNumber: 6, position: "CB" },
    { id: "ecu-14", name: "Diego Palacios", shirtNumber: 14, position: "LB" },
    { id: "ecu-20", name: "Jhegson Méndez", shirtNumber: 20, position: "DM" },
    { id: "ecu-24", name: "Kendry Páez", shirtNumber: 24, position: "AM" },
    { id: "ecu-16", name: "Jeremy Sarmiento", shirtNumber: 16, position: "LW" },
    { id: "ecu-9", name: "Leonardo Campana", shirtNumber: 9, position: "ST" },
    { id: "ecu-10", name: "Kevin Rodríguez", shirtNumber: 10, position: "ST" },
  ],
};

export const JAPAN: TeamSquad = {
  team: { code: "JPN", name: "Japan", flagEmoji: "🇯🇵", primaryColor: "#000091", secondaryColor: "#bc002d" },
  players: [
    { id: "jpn-3", name: "Shogo Taniguchi", shirtNumber: 3, position: "CB" },
    { id: "jpn-5", name: "Yuto Nagatomo", shirtNumber: 5, position: "LB" },
    { id: "jpn-6", name: "Wataru Endo", shirtNumber: 6, position: "DM" },
    { id: "jpn-8", name: "Ritsu Doan", shirtNumber: 8, position: "RW" },
    { id: "jpn-12", name: "Shuichi Gonda", shirtNumber: 12, position: "GK" },
    { id: "jpn-13", name: "Hidemasa Morita", shirtNumber: 13, position: "CM" },
    { id: "jpn-14", name: "Junya Ito", shirtNumber: 14, position: "RW" },
    { id: "jpn-15", name: "Daichi Kamada", shirtNumber: 15, position: "AM" },
    { id: "jpn-16", name: "Takehiro Tomiyasu", shirtNumber: 16, position: "CB" },
    { id: "jpn-22", name: "Maya Yoshida", shirtNumber: 22, position: "CB" },
    { id: "jpn-25", name: "Daizen Maeda", shirtNumber: 25, position: "ST" },
    { id: "jpn-1", name: "Zion Suzuki", shirtNumber: 1, position: "GK" },
    { id: "jpn-23", name: "Daniel Schmidt", shirtNumber: 23, position: "GK" },
    { id: "jpn-2", name: "Yukinari Sugawara", shirtNumber: 2, position: "RB" },
    { id: "jpn-4", name: "Ko Itakura", shirtNumber: 4, position: "CB" },
    { id: "jpn-26", name: "Hiroki Ito", shirtNumber: 26, position: "CB" },
    { id: "jpn-7", name: "Gaku Shibasaki", shirtNumber: 7, position: "CM" },
    { id: "jpn-17", name: "Ao Tanaka", shirtNumber: 17, position: "CM" },
    { id: "jpn-10", name: "Takumi Minamino", shirtNumber: 10, position: "AM" },
    { id: "jpn-11", name: "Kaoru Mitoma", shirtNumber: 11, position: "LW" },
    { id: "jpn-9", name: "Ayase Ueda", shirtNumber: 9, position: "ST" },
    { id: "jpn-19", name: "Takefusa Kubo", shirtNumber: 19, position: "RW" },
  ],
};

export const USA: TeamSquad = {
  team: { code: "USA", name: "USA", flagEmoji: "🇺🇸", primaryColor: "#0a3161", secondaryColor: "#b31942" },
  players: [
    { id: "usa-1", name: "Matt Turner", shirtNumber: 1, position: "GK" },
    { id: "usa-2", name: "Sergino Dest", shirtNumber: 2, position: "RB" },
    { id: "usa-3", name: "Walker Zimmerman", shirtNumber: 3, position: "CB" },
    { id: "usa-4", name: "Tyler Adams", shirtNumber: 4, position: "DM" },
    { id: "usa-5", name: "Antonee Robinson", shirtNumber: 5, position: "LB" },
    { id: "usa-6", name: "Yunus Musah", shirtNumber: 6, position: "CM" },
    { id: "usa-8", name: "Weston McKennie", shirtNumber: 8, position: "CM" },
    { id: "usa-9", name: "Jesus Ferreira", shirtNumber: 9, position: "ST" },
    { id: "usa-10", name: "Christian Pulisic", shirtNumber: 10, position: "LW" },
    { id: "usa-13", name: "Tim Ream", shirtNumber: 13, position: "CB" },
    { id: "usa-21", name: "Timothy Weah", shirtNumber: 21, position: "RW" },
    { id: "usa-12", name: "Ethan Horvath", shirtNumber: 12, position: "GK" },
    { id: "usa-18", name: "Zack Steffen", shirtNumber: 18, position: "GK" },
    { id: "usa-7", name: "Gio Reyna", shirtNumber: 7, position: "AM" },
    { id: "usa-15", name: "Chris Richards", shirtNumber: 15, position: "CB" },
    { id: "usa-22", name: "Joe Scally", shirtNumber: 22, position: "RB" },
    { id: "usa-11", name: "Brenden Aaronson", shirtNumber: 11, position: "AM" },
    { id: "usa-14", name: "Luca de la Torre", shirtNumber: 14, position: "CM" },
    { id: "usa-17", name: "Malik Tillman", shirtNumber: 17, position: "AM" },
    { id: "usa-19", name: "Haji Wright", shirtNumber: 19, position: "ST" },
    { id: "usa-20", name: "Folarin Balogun", shirtNumber: 20, position: "ST" },
    { id: "usa-16", name: "Ricardo Pepi", shirtNumber: 16, position: "ST" },
  ],
};

export const TUNISIA: TeamSquad = {
  team: { code: "TUN", name: "Tunisia", flagEmoji: "🇹🇳", primaryColor: "#e70013", secondaryColor: "#ffffff" },
  players: [
    { id: "tun-3", name: "Montassar Talbi", shirtNumber: 3, position: "CB" },
    { id: "tun-4", name: "Yassine Meriah", shirtNumber: 4, position: "CB" },
    { id: "tun-5", name: "Nader Ghandri", shirtNumber: 5, position: "CB" },
    { id: "tun-10", name: "Wahbi Khazri", shirtNumber: 10, position: "ST" },
    { id: "tun-12", name: "Ali Maâloul", shirtNumber: 12, position: "LB" },
    { id: "tun-14", name: "Aïssa Laïdouni", shirtNumber: 14, position: "DM" },
    { id: "tun-15", name: "Mohamed Ben Romdhane", shirtNumber: 15, position: "LW" },
    { id: "tun-16", name: "Aymen Dahmen", shirtNumber: 16, position: "GK" },
    { id: "tun-17", name: "Ellyes Skhiri", shirtNumber: 17, position: "CM" },
    { id: "tun-21", name: "Wajdi Kechrida", shirtNumber: 21, position: "RB" },
    { id: "tun-25", name: "Anis Ben Slimane", shirtNumber: 25, position: "RW" },
    { id: "tun-1", name: "Mouez Hassen", shirtNumber: 1, position: "GK" },
    { id: "tun-23", name: "Bechir Ben Saïd", shirtNumber: 23, position: "GK" },
    { id: "tun-2", name: "Mohamed Drager", shirtNumber: 2, position: "RB" },
    { id: "tun-6", name: "Dylan Bronn", shirtNumber: 6, position: "CB" },
    { id: "tun-20", name: "Ali Abdi", shirtNumber: 20, position: "LB" },
    { id: "tun-8", name: "Hannibal Mejbri", shirtNumber: 8, position: "CM" },
    { id: "tun-13", name: "Ferjani Sassi", shirtNumber: 13, position: "DM" },
    { id: "tun-7", name: "Youssef Msakni", shirtNumber: 7, position: "RW" },
    { id: "tun-18", name: "Naïm Sliti", shirtNumber: 18, position: "LW" },
    { id: "tun-9", name: "Issam Jebali", shirtNumber: 9, position: "ST" },
    { id: "tun-11", name: "Elias Achouri", shirtNumber: 11, position: "RW" },
  ],
};

export const SWITZERLAND: TeamSquad = {
  team: { code: "SUI", name: "Switzerland", flagEmoji: "🇨🇭", primaryColor: "#d52b1e", secondaryColor: "#ffffff" },
  players: [
    { id: "sui-1", name: "Yann Sommer", shirtNumber: 1, position: "GK" },
    { id: "sui-2", name: "Edimilson Fernandes", shirtNumber: 2, position: "RB" },
    { id: "sui-5", name: "Manuel Akanji", shirtNumber: 5, position: "CB" },
    { id: "sui-7", name: "Breel Embolo", shirtNumber: 7, position: "ST" },
    { id: "sui-8", name: "Remo Freuler", shirtNumber: 8, position: "CM" },
    { id: "sui-10", name: "Granit Xhaka", shirtNumber: 10, position: "DM" },
    { id: "sui-13", name: "Ricardo Rodríguez", shirtNumber: 13, position: "LB" },
    { id: "sui-15", name: "Djibril Sow", shirtNumber: 15, position: "CM" },
    { id: "sui-17", name: "Ruben Vargas", shirtNumber: 17, position: "LW" },
    { id: "sui-22", name: "Fabian Schär", shirtNumber: 22, position: "CB" },
    { id: "sui-23", name: "Xherdan Shaqiri", shirtNumber: 23, position: "AM" },
    { id: "sui-21", name: "Gregor Kobel", shirtNumber: 21, position: "GK" },
    { id: "sui-3", name: "Silvan Widmer", shirtNumber: 3, position: "RB" },
    { id: "sui-4", name: "Nico Elvedi", shirtNumber: 4, position: "CB" },
    { id: "sui-6", name: "Cédric Zesiger", shirtNumber: 6, position: "CB" },
    { id: "sui-20", name: "Michel Aebischer", shirtNumber: 20, position: "CM" },
    { id: "sui-11", name: "Renato Steffen", shirtNumber: 11, position: "LW" },
    { id: "sui-14", name: "Steven Zuber", shirtNumber: 14, position: "LW" },
    { id: "sui-9", name: "Zeki Amdouni", shirtNumber: 9, position: "ST" },
    { id: "sui-18", name: "Dan Ndoye", shirtNumber: 18, position: "RW" },
    { id: "sui-19", name: "Noah Okafor", shirtNumber: 19, position: "ST" },
    { id: "sui-16", name: "Christian Fassnacht", shirtNumber: 16, position: "AM" },
  ],
};

export const GHANA: TeamSquad = {
  team: { code: "GHA", name: "Ghana", flagEmoji: "🇬🇭", primaryColor: "#006b3f", secondaryColor: "#fcd116" },
  players: [
    { id: "gha-1", name: "Lawrence Ati-Zigi", shirtNumber: 1, position: "GK" },
    { id: "gha-4", name: "Mohamed Salisu", shirtNumber: 4, position: "CB" },
    { id: "gha-5", name: "Thomas Partey", shirtNumber: 5, position: "DM" },
    { id: "gha-9", name: "Jordan Ayew", shirtNumber: 9, position: "LW" },
    { id: "gha-10", name: "André Ayew", shirtNumber: 10, position: "AM" },
    { id: "gha-17", name: "Baba Rahman", shirtNumber: 17, position: "LB" },
    { id: "gha-18", name: "Daniel Amartey", shirtNumber: 18, position: "CB" },
    { id: "gha-19", name: "Iñaki Williams", shirtNumber: 19, position: "RW" },
    { id: "gha-20", name: "Mohammed Kudus", shirtNumber: 20, position: "ST" },
    { id: "gha-21", name: "Salis Samed", shirtNumber: 21, position: "CM" },
    { id: "gha-26", name: "Alidu Seidu", shirtNumber: 26, position: "RB" },
    { id: "gha-12", name: "Joseph Wollacott", shirtNumber: 12, position: "GK" },
    { id: "gha-2", name: "Tariq Lamptey", shirtNumber: 2, position: "RB" },
    { id: "gha-3", name: "Denis Odoi", shirtNumber: 3, position: "RB" },
    { id: "gha-6", name: "Elisha Owusu", shirtNumber: 6, position: "DM" },
    { id: "gha-7", name: "Antoine Semenyo", shirtNumber: 7, position: "RW" },
    { id: "gha-8", name: "Daniel-Kofi Kyereh", shirtNumber: 8, position: "AM" },
    { id: "gha-11", name: "Osman Bukari", shirtNumber: 11, position: "RW" },
    { id: "gha-13", name: "Joseph Aidoo", shirtNumber: 13, position: "CB" },
    { id: "gha-14", name: "Gideon Mensah", shirtNumber: 14, position: "LB" },
    { id: "gha-15", name: "Abdul Fatawu Issahaku", shirtNumber: 15, position: "RW" },
    { id: "gha-22", name: "Kamaldeen Sulemana", shirtNumber: 22, position: "LW" },
  ],
};

export const SENEGAL: TeamSquad = {
  team: { code: "SEN", name: "Senegal", flagEmoji: "🇸🇳", primaryColor: "#00853f", secondaryColor: "#fdef42" },
  players: [
    { id: "sen-3", name: "Kalidou Koulibaly", shirtNumber: 3, position: "CB" },
    { id: "sen-6", name: "Nampalys Mendy", shirtNumber: 6, position: "DM" },
    { id: "sen-9", name: "Boulaye Dia", shirtNumber: 9, position: "ST" },
    { id: "sen-11", name: "Pathé Ciss", shirtNumber: 11, position: "CM" },
    { id: "sen-13", name: "Iliman Ndiaye", shirtNumber: 13, position: "AM" },
    { id: "sen-14", name: "Ismail Jakobs", shirtNumber: 14, position: "LB" },
    { id: "sen-15", name: "Krépin Diatta", shirtNumber: 15, position: "RW" },
    { id: "sen-16", name: "Edouard Mendy", shirtNumber: 16, position: "GK" },
    { id: "sen-18", name: "Ismaïla Sarr", shirtNumber: 18, position: "LW" },
    { id: "sen-21", name: "Youssouf Sabaly", shirtNumber: 21, position: "RB" },
    { id: "sen-22", name: "Abdou Diallo", shirtNumber: 22, position: "CB" },
    { id: "sen-23", name: "Mory Diaw", shirtNumber: 23, position: "GK" },
    { id: "sen-2", name: "Moussa Niakhaté", shirtNumber: 2, position: "CB" },
    { id: "sen-4", name: "Abdoulaye Seck", shirtNumber: 4, position: "CB" },
    { id: "sen-5", name: "Idrissa Gana Gueye", shirtNumber: 5, position: "DM" },
    { id: "sen-8", name: "Cheikhou Kouyaté", shirtNumber: 8, position: "CM" },
    { id: "sen-10", name: "Sadio Mané", shirtNumber: 10, position: "LW" },
    { id: "sen-12", name: "Fodé Ballo-Touré", shirtNumber: 12, position: "LB" },
    { id: "sen-17", name: "Pape Matar Sarr", shirtNumber: 17, position: "CM" },
    { id: "sen-19", name: "Famara Diédhiou", shirtNumber: 19, position: "ST" },
    { id: "sen-20", name: "Nicolas Jackson", shirtNumber: 20, position: "ST" },
    { id: "sen-7", name: "Habib Diarra", shirtNumber: 7, position: "CM" },
  ],
};

export const SAUDI_ARABIA: TeamSquad = {
  team: { code: "KSA", name: "Saudi Arabia", flagEmoji: "🇸🇦", primaryColor: "#006c35", secondaryColor: "#ffffff" },
  players: [
    { id: "ksa-2", name: "Sultan Al Ghannam", shirtNumber: 2, position: "RB" },
    { id: "ksa-4", name: "Abdulelah Al Amri", shirtNumber: 4, position: "CB" },
    { id: "ksa-5", name: "Ali Albulayhi", shirtNumber: 5, position: "LB" },
    { id: "ksa-9", name: "Firas Al Buraikan", shirtNumber: 9, position: "ST" },
    { id: "ksa-10", name: "Salem Al Dawsari", shirtNumber: 10, position: "LW" },
    { id: "ksa-11", name: "Saleh Al Shehri", shirtNumber: 11, position: "ST" },
    { id: "ksa-12", name: "Saud Abdulhamid", shirtNumber: 12, position: "RB" },
    { id: "ksa-15", name: "Ali Al Hassan", shirtNumber: 15, position: "CM" },
    { id: "ksa-17", name: "Hassan Al-Tambakti", shirtNumber: 17, position: "CB" },
    { id: "ksa-21", name: "Mohammed Al Owais", shirtNumber: 21, position: "GK" },
    { id: "ksa-22", name: "Mohammed Kanno", shirtNumber: 22, position: "DM" },
    { id: "ksa-1", name: "Mohammed Al-Owais", shirtNumber: 1, position: "GK" },
    { id: "ksa-3", name: "Abdullah Madu", shirtNumber: 3, position: "CB" },
    { id: "ksa-6", name: "Mohammed Al-Burayk", shirtNumber: 6, position: "RB" },
    { id: "ksa-7", name: "Salman Al-Faraj", shirtNumber: 7, position: "CM" },
    { id: "ksa-8", name: "Abdullah Otayf", shirtNumber: 8, position: "DM" },
    { id: "ksa-13", name: "Yasser Al-Shahrani", shirtNumber: 13, position: "LB" },
    { id: "ksa-14", name: "Abdullah Al-Khaibari", shirtNumber: 14, position: "CM" },
    { id: "ksa-16", name: "Sami Al-Najei", shirtNumber: 16, position: "AM" },
    { id: "ksa-18", name: "Nawaf Al-Abed", shirtNumber: 18, position: "AM" },
    { id: "ksa-20", name: "Abdulrahman Ghareeb", shirtNumber: 20, position: "LW" },
    { id: "ksa-23", name: "Nawaf Al-Aqidi", shirtNumber: 23, position: "GK" },
  ],
};

export const QATAR: TeamSquad = {
  team: { code: "QAT", name: "Qatar", flagEmoji: "🇶🇦", primaryColor: "#8a1538", secondaryColor: "#ffffff" },
  players: [
    { id: "qat-2", name: "Pedro Miguel Correia", shirtNumber: 2, position: "CB" },
    { id: "qat-3", name: "Abdelkarim Hassan", shirtNumber: 3, position: "LB" },
    { id: "qat-6", name: "Abdulaziz Hatem", shirtNumber: 6, position: "CM" },
    { id: "qat-10", name: "Hassan Al Heidos", shirtNumber: 10, position: "AM" },
    { id: "qat-11", name: "Akram Afif", shirtNumber: 11, position: "LW" },
    { id: "qat-14", name: "Homam Ahmed", shirtNumber: 14, position: "RB" },
    { id: "qat-16", name: "Boualem Khoukhi", shirtNumber: 16, position: "CB" },
    { id: "qat-19", name: "Almoez Ali", shirtNumber: 19, position: "ST" },
    { id: "qat-22", name: "Meshaal Barsham", shirtNumber: 22, position: "GK" },
    { id: "qat-23", name: "Assim Madibo", shirtNumber: 23, position: "DM" },
    { id: "qat-25", name: "Ismaeel Mohammad", shirtNumber: 25, position: "RB" },
    { id: "qat-1", name: "Saad Al-Sheeb", shirtNumber: 1, position: "GK" },
    { id: "qat-4", name: "Bassam Al-Rawi", shirtNumber: 4, position: "CB" },
    { id: "qat-5", name: "Tarek Salman", shirtNumber: 5, position: "CB" },
    { id: "qat-12", name: "Karim Boudiaf", shirtNumber: 12, position: "DM" },
    { id: "qat-13", name: "Mohammed Waad", shirtNumber: 13, position: "RB" },
    { id: "qat-15", name: "Tameem Al-Muhaza", shirtNumber: 15, position: "RW" },
    { id: "qat-17", name: "Ahmed Fadel", shirtNumber: 17, position: "LB" },
    { id: "qat-18", name: "Khalid Muneer", shirtNumber: 18, position: "LW" },
    { id: "qat-20", name: "Ahmed Fathy", shirtNumber: 20, position: "AM" },
    { id: "qat-21", name: "Mostafa Tarek", shirtNumber: 21, position: "CM" },
    { id: "qat-7", name: "Ahmed Alaaeldin", shirtNumber: 7, position: "RW" },
  ],
};

export const AUSTRALIA: TeamSquad = {
  team: { code: "AUS", name: "Australia", flagEmoji: "🇦🇺", primaryColor: "#00843d", secondaryColor: "#ffcd00" },
  players: [
    { id: "aus-1", name: "Mat Ryan", shirtNumber: 1, position: "GK" },
    { id: "aus-2", name: "Miloš Degenek", shirtNumber: 2, position: "RB" },
    { id: "aus-4", name: "Kye Rowles", shirtNumber: 4, position: "CB" },
    { id: "aus-7", name: "Mat Leckie", shirtNumber: 7, position: "RW" },
    { id: "aus-13", name: "Aaron Mooy", shirtNumber: 13, position: "CM" },
    { id: "aus-14", name: "Riley McGree", shirtNumber: 14, position: "CM" },
    { id: "aus-15", name: "Mitchell Duke", shirtNumber: 15, position: "ST" },
    { id: "aus-16", name: "Aziz Behich", shirtNumber: 16, position: "LB" },
    { id: "aus-19", name: "Harry Souttar", shirtNumber: 19, position: "CB" },
    { id: "aus-22", name: "Jackson Irvine", shirtNumber: 22, position: "ST" },
    { id: "aus-26", name: "Keanu Baccus", shirtNumber: 26, position: "DM" },
    { id: "aus-18", name: "Joe Gauci", shirtNumber: 18, position: "GK" },
    { id: "aus-3", name: "Nathaniel Atkinson", shirtNumber: 3, position: "RB" },
    { id: "aus-5", name: "Cameron Burgess", shirtNumber: 5, position: "CB" },
    { id: "aus-6", name: "Lewis Miller", shirtNumber: 6, position: "RB" },
    { id: "aus-8", name: "Connor Metcalfe", shirtNumber: 8, position: "CM" },
    { id: "aus-10", name: "Ajdin Hrustic", shirtNumber: 10, position: "AM" },
    { id: "aus-11", name: "Awer Mabil", shirtNumber: 11, position: "RW" },
    { id: "aus-17", name: "Cameron Devlin", shirtNumber: 17, position: "DM" },
    { id: "aus-20", name: "Trent Sainsbury", shirtNumber: 20, position: "CB" },
    { id: "aus-23", name: "Craig Goodwin", shirtNumber: 23, position: "LW" },
    { id: "aus-9", name: "Jamie Maclaren", shirtNumber: 9, position: "ST" },
  ],
};

export const URUGUAY: TeamSquad = {
  team: { code: "URU", name: "Uruguay", flagEmoji: "🇺🇾", primaryColor: "#7b9fd4", secondaryColor: "#001489" },
  players: [
    { id: "uru-2", name: "José María Giménez", shirtNumber: 2, position: "CB" },
    { id: "uru-6", name: "Rodrigo Bentancur", shirtNumber: 6, position: "CM" },
    { id: "uru-8", name: "Facundo Pellistri", shirtNumber: 8, position: "RW" },
    { id: "uru-9", name: "Luis Suárez", shirtNumber: 9, position: "ST" },
    { id: "uru-10", name: "Giorgian De Arrascaeta", shirtNumber: 10, position: "AM" },
    { id: "uru-11", name: "Darwin Núñez", shirtNumber: 11, position: "ST" },
    { id: "uru-13", name: "Guillermo Varela", shirtNumber: 13, position: "RB" },
    { id: "uru-15", name: "Federico Valverde", shirtNumber: 15, position: "CM" },
    { id: "uru-16", name: "Mathías Olivera", shirtNumber: 16, position: "LB" },
    { id: "uru-19", name: "Sebastián Coates", shirtNumber: 19, position: "CB" },
    { id: "uru-23", name: "Sergio Rochet", shirtNumber: 23, position: "GK" },
    { id: "uru-1", name: "Franco Israel", shirtNumber: 1, position: "GK" },
    { id: "uru-12", name: "Santiago Mele", shirtNumber: 12, position: "GK" },
    { id: "uru-4", name: "Ronald Araújo", shirtNumber: 4, position: "CB" },
    { id: "uru-3", name: "Sebastián Cáceres", shirtNumber: 3, position: "CB" },
    { id: "uru-17", name: "Matías Viña", shirtNumber: 17, position: "LB" },
    { id: "uru-22", name: "Nahitan Nández", shirtNumber: 22, position: "RB" },
    { id: "uru-5", name: "Manuel Ugarte", shirtNumber: 5, position: "DM" },
    { id: "uru-7", name: "Nicolás de la Cruz", shirtNumber: 7, position: "AM" },
    { id: "uru-20", name: "Maximiliano Araújo", shirtNumber: 20, position: "LW" },
    { id: "uru-21", name: "Brian Rodríguez", shirtNumber: 21, position: "RW" },
    { id: "uru-18", name: "Maximiliano Gómez", shirtNumber: 18, position: "ST" },
  ],
};

export const SOUTH_KOREA: TeamSquad = {
  team: { code: "KOR", name: "South Korea", flagEmoji: "🇰🇷", primaryColor: "#c8102e", secondaryColor: "#003478" },
  players: [
    { id: "kor-1", name: "Seung-Gyu Kim", shirtNumber: 1, position: "GK" },
    { id: "kor-3", name: "Jin-Su Kim", shirtNumber: 3, position: "LB" },
    { id: "kor-4", name: "Min-Jae Kim", shirtNumber: 4, position: "CB" },
    { id: "kor-5", name: "Woo-Young Jung", shirtNumber: 5, position: "DM" },
    { id: "kor-6", name: "In-Beom Hwang", shirtNumber: 6, position: "CM" },
    { id: "kor-7", name: "Heung-Min Son", shirtNumber: 7, position: "LW" },
    { id: "kor-9", name: "Gue-Sung Cho", shirtNumber: 9, position: "ST" },
    { id: "kor-10", name: "Jae-Sung Lee", shirtNumber: 10, position: "AM" },
    { id: "kor-11", name: "Hee-Chan Hwang", shirtNumber: 11, position: "RW" },
    { id: "kor-15", name: "Moon-Hwan Kim", shirtNumber: 15, position: "RB" },
    { id: "kor-19", name: "Young-Gwon Kim", shirtNumber: 19, position: "CB" },
    { id: "kor-21", name: "Jo Hyeon-woo", shirtNumber: 21, position: "GK" },
    { id: "kor-12", name: "Song Bum-keun", shirtNumber: 12, position: "GK" },
    { id: "kor-20", name: "Kwon Kyung-won", shirtNumber: 20, position: "CB" },
    { id: "kor-2", name: "Lee Myung-jae", shirtNumber: 2, position: "RB" },
    { id: "kor-14", name: "Hong Chul", shirtNumber: 14, position: "LB" },
    { id: "kor-8", name: "Paik Seung-ho", shirtNumber: 8, position: "DM" },
    { id: "kor-13", name: "Park Yong-woo", shirtNumber: 13, position: "DM" },
    { id: "kor-17", name: "Hwang In-beom", shirtNumber: 17, position: "CM" },
    { id: "kor-18", name: "Lee Kang-in", shirtNumber: 18, position: "AM" },
    { id: "kor-16", name: "Hwang Ui-jo", shirtNumber: 16, position: "ST" },
    { id: "kor-22", name: "Oh Hyeon-gyu", shirtNumber: 22, position: "ST" },
  ],
};

// ── WC2026 nations not in WC2022 — manually curated ──────────────────────────

export const NORWAY: TeamSquad = {
  team: { code: "NOR", name: "Norway", flagEmoji: "🇳🇴", primaryColor: "#ba0c2f", secondaryColor: "#00205b" },
  players: [
    { id: "nor-1", name: "Ørjan Nyland", shirtNumber: 1, position: "GK" },
    { id: "nor-2", name: "Julian Ryerson", shirtNumber: 2, position: "RB" },
    { id: "nor-4", name: "Leo Østigård", shirtNumber: 4, position: "CB" },
    { id: "nor-5", name: "Andreas Hanche-Olsen", shirtNumber: 5, position: "CB" },
    { id: "nor-3", name: "Marcus Pedersen", shirtNumber: 3, position: "LB" },
    { id: "nor-8", name: "Sander Berge", shirtNumber: 8, position: "DM" },
    { id: "nor-10", name: "Martin Ødegaard", shirtNumber: 10, position: "AM" },
    { id: "nor-6", name: "Fredrik Aursnes", shirtNumber: 6, position: "CM" },
    { id: "nor-7", name: "Mohamed Elyounoussi", shirtNumber: 7, position: "LW" },
    { id: "nor-11", name: "Alexander Sørloth", shirtNumber: 11, position: "ST" },
    { id: "nor-9", name: "Erling Haaland", shirtNumber: 9, position: "ST" },
    { id: "nor-12", name: "Egil Selvik", shirtNumber: 12, position: "GK" },
    { id: "nor-22", name: "Per Kristian Bråtveit", shirtNumber: 22, position: "GK" },
    { id: "nor-13", name: "Kristoffer Ajer", shirtNumber: 13, position: "CB" },
    { id: "nor-14", name: "David Møller Wolfe", shirtNumber: 14, position: "LB" },
    { id: "nor-15", name: "Stefan Strandberg", shirtNumber: 15, position: "CB" },
    { id: "nor-16", name: "Patrick Berg", shirtNumber: 16, position: "CM" },
    { id: "nor-18", name: "Morten Thorsby", shirtNumber: 18, position: "CM" },
    { id: "nor-20", name: "Antonio Nusa", shirtNumber: 20, position: "LW" },
    { id: "nor-21", name: "Oscar Bobb", shirtNumber: 21, position: "RW" },
    { id: "nor-17", name: "Kristian Thorstvedt", shirtNumber: 17, position: "CM" },
    { id: "nor-19", name: "Jørgen Strand Larsen", shirtNumber: 19, position: "ST" },
  ],
};

export const EGYPT: TeamSquad = {
  team: { code: "EGY", name: "Egypt", flagEmoji: "🇪🇬", primaryColor: "#ce1126", secondaryColor: "#000000" },
  players: [
    { id: "egy-16", name: "Sherif Ekramy", shirtNumber: 16, position: "GK" },
    { id: "egy-2", name: "Akram Tawfik", shirtNumber: 2, position: "RB" },
    { id: "egy-4", name: "Omar Kamal Hamid", shirtNumber: 4, position: "CB" },
    { id: "egy-5", name: "Ahmed Hegazy", shirtNumber: 5, position: "CB" },
    { id: "egy-3", name: "Mohamed Abdelmonem", shirtNumber: 3, position: "LB" },
    { id: "egy-8", name: "Tarek Hamed", shirtNumber: 8, position: "DM" },
    { id: "egy-22", name: "Hamdi Fathi", shirtNumber: 22, position: "CM" },
    { id: "egy-10", name: "Emam Ashour", shirtNumber: 10, position: "AM" },
    { id: "egy-11", name: "Mohamed Salah", shirtNumber: 11, position: "RW" },
    { id: "egy-9", name: "Mostafa Mohamed", shirtNumber: 9, position: "ST" },
    { id: "egy-18", name: "Ramadan Sobhi", shirtNumber: 18, position: "LW" },
    { id: "egy-1", name: "Mohamed El Shenawy", shirtNumber: 1, position: "GK" },
    { id: "egy-23", name: "Mohamed Abou Gabal", shirtNumber: 23, position: "GK" },
    { id: "egy-6", name: "Rami Rabia", shirtNumber: 6, position: "CB" },
    { id: "egy-7", name: "Mahmoud Hamdy", shirtNumber: 7, position: "CB" },
    { id: "egy-12", name: "Ahmed Fattouh", shirtNumber: 12, position: "LB" },
    { id: "egy-13", name: "Mohamed Hany", shirtNumber: 13, position: "RB" },
    { id: "egy-17", name: "Mohamed Elneny", shirtNumber: 17, position: "DM" },
    { id: "egy-19", name: "Mahmoud Trezeguet", shirtNumber: 19, position: "LW" },
    { id: "egy-21", name: "Ahmed Sayed Zizo", shirtNumber: 21, position: "RW" },
    { id: "egy-14", name: "Mohamed Sherif", shirtNumber: 14, position: "ST" },
    { id: "egy-15", name: "Omar Marmoush", shirtNumber: 15, position: "ST" },
  ],
};

export const COLOMBIA: TeamSquad = {
  team: { code: "COL", name: "Colombia", flagEmoji: "🇨🇴", primaryColor: "#ffcd00", secondaryColor: "#003087" },
  players: [
    { id: "col-1", name: "Camilo Vargas", shirtNumber: 1, position: "GK" },
    { id: "col-2", name: "Daniel Muñoz", shirtNumber: 2, position: "RB" },
    { id: "col-3", name: "Dávinson Sánchez", shirtNumber: 3, position: "CB" },
    { id: "col-5", name: "Yerry Mina", shirtNumber: 5, position: "CB" },
    { id: "col-12", name: "Johan Mojica", shirtNumber: 12, position: "LB" },
    { id: "col-6", name: "Wilmar Barrios", shirtNumber: 6, position: "DM" },
    { id: "col-8", name: "Mateus Uribe", shirtNumber: 8, position: "CM" },
    { id: "col-10", name: "James Rodríguez", shirtNumber: 10, position: "AM" },
    { id: "col-7", name: "Luis Díaz", shirtNumber: 7, position: "LW" },
    { id: "col-11", name: "Cucho Hernández", shirtNumber: 11, position: "RW" },
    { id: "col-9", name: "Rafael Santos Borré", shirtNumber: 9, position: "ST" },
    { id: "col-22", name: "Álvaro Montero", shirtNumber: 22, position: "GK" },
    { id: "col-13", name: "Kevin Mier", shirtNumber: 13, position: "GK" },
    { id: "col-4", name: "Santiago Arias", shirtNumber: 4, position: "RB" },
    { id: "col-23", name: "Carlos Cuesta", shirtNumber: 23, position: "CB" },
    { id: "col-14", name: "Jhon Lucumí", shirtNumber: 14, position: "CB" },
    { id: "col-15", name: "Deiver Machado", shirtNumber: 15, position: "LB" },
    { id: "col-16", name: "Jefferson Lerma", shirtNumber: 16, position: "DM" },
    { id: "col-20", name: "Juan Fernando Quintero", shirtNumber: 20, position: "AM" },
    { id: "col-17", name: "Johan Carbonero", shirtNumber: 17, position: "RW" },
    { id: "col-21", name: "Jhon Córdoba", shirtNumber: 21, position: "ST" },
    { id: "col-19", name: "Luis Sinisterra", shirtNumber: 19, position: "LW" },
  ],
};

export const DEMO_MATCH_ID = "wc2026-grp-arg-mex";
export const SQUADS: TeamSquad[] = [ARGENTINA, MEXICO];

/** Squads keyed by the team name as it appears in the openfootball snapshot,
 * for seeding who-scored trivia on real goals. */
export const SQUADS_BY_NAME: Record<string, TeamSquad> = {
  Argentina: ARGENTINA,
  Mexico: MEXICO,
  England: ENGLAND,
  France: FRANCE,
  Germany: GERMANY,
  Brazil: BRAZIL,
  Spain: SPAIN,
  Portugal: PORTUGAL,
  Netherlands: NETHERLANDS,
  // WC2022 StatsBomb squads
  Canada: CANADA,
  Morocco: MOROCCO,
  Iran: IRAN,
  Croatia: CROATIA,
  Belgium: BELGIUM,
  Ecuador: ECUADOR,
  Japan: JAPAN,
  USA: USA,
  Tunisia: TUNISIA,
  Switzerland: SWITZERLAND,
  Ghana: GHANA,
  Senegal: SENEGAL,
  "Saudi Arabia": SAUDI_ARABIA,
  Qatar: QATAR,
  Australia: AUSTRALIA,
  Uruguay: URUGUAY,
  "South Korea": SOUTH_KOREA,
  // WC2026 nations not in WC2022
  Norway: NORWAY,
  Egypt: EGYPT,
  Colombia: COLOMBIA,
};
