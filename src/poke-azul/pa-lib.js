// Poke Azul para Nexus — motor (calidad/IV, gimnasios, simulador, hora de Brasil).
// Módulos de Poke Azul empaquetados para el navegador (sin Node).
(function(){'use strict';
const __defs={}, __cache={};
const require=(n)=>{n=String(n).replace(/^\.\//,'').replace(/\.js$/,'');if(n==='fs'||n==='path')return {join:(...a)=>a.join('/'),dirname:(p)=>p};if(__cache[n])return __cache[n].exports;const m={exports:{}};__cache[n]=m;__defs[n](m,m.exports,require);return m.exports;};
__defs['gyms-data']=function(module,exports,require){
// Poke Azul — los 18 gimnasios tal como se ven en la ventana "Gimnasios" del juego (12/10/2026).
// Si el juego manda datos más nuevos al abrir esa ventana, se usan esos en su lugar.
// Formato de cada pokémon: [nombre, shiny, tipos, vida, ATK, DEF, SP.ATK, SP.DEF, VEL, golpes]
// Golpe: [tipo, nombre, F (físico) / E (especial), potencia]
'use strict';

const G = [
  ['Pewter', 'Brock', 'ROCK', 'Kanto', [
    ['Aerodactyl', 0, 'ROCK/FLYING', 12792, 1135, 857, 822, 912, 1437, [['NORMAL', 'Hyper Beam', 'E', 150], ['NORMAL', 'Giga Impact', 'F', 150], ['NORMAL', 'Take Down', 'F', 90], ['STEEL', 'Iron Head', 'F', 80]]],
    ['Sudowoodo', 0, 'ROCK', 11868, 1100, 1205, 613, 843, 665, [['NORMAL', 'Double-Edge', 'F', 120], ['GRASS', 'Wood Hammer', 'F', 120], ['ROCK', 'Stone Edge', 'F', 100], ['FIGHTING', 'Hammer Arm', 'F', 100]]],
    ['Tyranitar', 0, 'ROCK/DARK', 14652, 1337, 1170, 1066, 1086, 904, [['NORMAL', 'Hyper Beam', 'E', 150], ['NORMAL', 'Giga Impact', 'F', 150], ['NORMAL', 'Thrash', 'F', 120], ['ROCK', 'Stone Edge', 'F', 100]]],
    ['Kabutops', 0, 'ROCK/WATER', 10944, 1205, 1135, 857, 878, 1051, [['DARK', 'Night Slash', 'F', 70], ['NORMAL', 'Slash', 'F', 70], ['ROCK', 'Ancient Power', 'E', 60], ['GROUND', 'Mud Shot', 'E', 55]]],
    ['Golem', 1, 'ROCK/GROUND', 12792, 1240, 1309, 787, 843, 780, [['NORMAL', 'Double-Edge', 'F', 120], ['GROUND', 'Earthquake', 'F', 100], ['ROCK', 'Stone Edge', 'F', 100], ['BUG', 'Steamroller', 'F', 65]]],
    ['Onix', 1, 'ROCK/GROUND', 8628, 717, 1518, 613, 703, 974, [['NORMAL', 'Double-Edge', 'F', 120], ['STEEL', 'Iron Tail', 'F', 100], ['ROCK', 'Stone Edge', 'F', 100], ['NORMAL', 'Slam', 'F', 80]]],
  ]],
  ['Cerulean', 'Misty', 'WATER', 'Kanto', [
    ['Blastoise', 1, 'WATER', 12708, 982, 1100, 996, 1121, 1035, [['NORMAL', 'Skull Bash', 'F', 130], ['WATER', 'Hydro Pump', 'E', 110], ['WATER', 'Aqua Tail', 'F', 90], ['STEEL', 'Flash Cannon', 'E', 80]]],
    ['Milotic', 0, 'WATER', 14184, 822, 954, 1100, 1261, 1059, [['WATER', 'Hydro Pump', 'E', 110], ['WATER', 'Aqua Tail', 'F', 90], ['WATER', 'Water Pulse', 'E', 60], ['DRAGON', 'Dragon Tail', 'F', 60]]],
    ['Corsola', 1, 'WATER/ROCK', 10476, 787, 996, 857, 982, 703, [['GROUND', 'Earth Power', 'E', 90], ['ROCK', 'Power Gem', 'E', 80], ['WATER', 'Bubble Beam', 'E', 65], ['WATER', 'Brine', 'E', 65]]],
    ['Lanturn', 1, 'WATER/ELECTRIC', 16968, 808, 808, 933, 919, 950, [['WATER', 'Hydro Pump', 'E', 110], ['NORMAL', 'Take Down', 'F', 90], ['ELECTRIC', 'Discharge', 'E', 80], ['BUG', 'Signal Beam', 'E', 75]]],
    ['Feraligatr', 0, 'WATER', 13260, 1135, 1100, 954, 968, 1035, [['NORMAL', 'Thrash', 'F', 120], ['FIGHTING', 'Superpower', 'F', 120], ['WATER', 'Hydro Pump', 'E', 110], ['WATER', 'Aqua Tail', 'F', 90]]],
    ['Starmie', 1, 'WATER/PSYCHIC', 10944, 926, 996, 1100, 982, 1321, [['WATER', 'Hydro Pump', 'E', 110], ['PSYCHIC', 'Psychic', 'E', 90], ['ROCK', 'Power Gem', 'E', 80], ['WATER', 'Bubble Beam', 'E', 65]]],
  ]],
  ['Vermilion', 'Lt. Surge', 'ELECTRIC', 'Kanto', [
    ['Raichu', 1, 'ELECTRIC', 10944, 1031, 787, 1031, 947, 1283, [['ELECTRIC', 'Thunder', 'E', 110], ['ELECTRIC', 'Thunderbolt', 'E', 90], ['ELECTRIC', 'Wild Charge', 'F', 90], ['ELECTRIC', 'Discharge', 'E', 80]]],
    ['Jolteon', 0, 'ELECTRIC', 11400, 857, 822, 1170, 1052, 1437, [['NORMAL', 'Last Resort', 'F', 140], ['ELECTRIC', 'Thunder', 'E', 110], ['ELECTRIC', 'Discharge', 'E', 80], ['ELECTRIC', 'Thunder Fang', 'F', 65]]],
    ['Manectric', 1, 'ELECTRIC', 11868, 926, 822, 1135, 808, 1244, [['ELECTRIC', 'Thunder', 'E', 110], ['ELECTRIC', 'Wild Charge', 'F', 90], ['ELECTRIC', 'Discharge', 'E', 80], ['ELECTRIC', 'Spark', 'F', 65]]],
    ['Electivire', 0, 'ELECTRIC', 12336, 1261, 871, 1066, 982, 1167, [['NORMAL', 'Giga Impact', 'F', 150], ['ELECTRIC', 'Thunder', 'E', 110], ['ELECTRIC', 'Thunderbolt', 'E', 90], ['ELECTRIC', 'Discharge', 'E', 80]]],
    ['Ampharos', 0, 'ELECTRIC', 13728, 926, 996, 1205, 1017, 858, [['ELECTRIC', 'Zap Cannon', 'E', 120], ['ELECTRIC', 'Thunder', 'E', 110], ['NORMAL', 'Take Down', 'F', 90], ['DRAGON', 'Dragon Pulse', 'E', 85]]],
    ['Electabuzz', 1, 'ELECTRIC', 11400, 982, 801, 1066, 982, 1244, [['ELECTRIC', 'Thunder', 'E', 110], ['ELECTRIC', 'Thunderbolt', 'E', 90], ['ELECTRIC', 'Discharge', 'E', 80], ['ELECTRIC', 'Thunder Punch', 'F', 75]]],
  ]],
  ['Celadon', 'Erika', 'GRASS', 'Kanto', [
    ['Venusaur', 1, 'GRASS/POISON', 12792, 975, 982, 1100, 1086, 1051, [['GRASS', 'Solar Beam', 'E', 120], ['NORMAL', 'Double-Edge', 'F', 120], ['GRASS', 'Petal Dance', 'E', 120], ['GRASS', 'Petal Blizzard', 'F', 90]]],
    ['Exeggutor', 0, 'GRASS/PSYCHIC', 14184, 1066, 996, 1274, 843, 858, [['GRASS', 'Leaf Storm', 'E', 130], ['GRASS', 'Wood Hammer', 'F', 120], ['GRASS', 'Solar Beam', 'E', 120], ['NORMAL', 'Egg Bomb', 'F', 100]]],
    ['Vileplume', 1, 'GRASS/POISON', 12336, 961, 996, 1170, 1017, 819, [['GRASS', 'Petal Dance', 'E', 120], ['GRASS', 'Solar Beam', 'E', 120], ['FAIRY', 'Moonblast', 'E', 95], ['GRASS', 'Petal Blizzard', 'F', 90]]],
    ['Victreebel', 0, 'GRASS/POISON', 12792, 1135, 857, 1100, 878, 974, [['GRASS', 'Leaf Storm', 'E', 130], ['GRASS', 'Leaf Blade', 'F', 90], ['NORMAL', 'Slam', 'F', 80], ['GRASS', 'Leaf Tornado', 'E', 65]]],
    ['Meganium', 1, 'GRASS', 12792, 975, 1100, 982, 1086, 1051, [['GRASS', 'Solar Beam', 'E', 120], ['GRASS', 'Petal Dance', 'E', 120], ['GRASS', 'Petal Blizzard', 'F', 90], ['NORMAL', 'Body Slam', 'F', 85]]],
    ['Tangrowth', 0, 'GRASS', 14652, 1100, 1274, 1170, 738, 819, [['GRASS', 'Power Whip', 'F', 120], ['NORMAL', 'Slam', 'F', 80], ['GRASS', 'Giga Drain', 'E', 75], ['DARK', 'Knock Off', 'F', 65]]],
  ]],
  ['Fuchsia', 'Koga', 'POISON', 'Kanto', [
    ['Venomoth', 1, 'BUG/POISON', 11868, 857, 822, 1031, 912, 1128, [['BUG', 'Bug Buzz', 'E', 90], ['PSYCHIC', 'Psychic', 'E', 90], ['PSYCHIC', 'Zen Headbutt', 'F', 80], ['BUG', 'Signal Beam', 'E', 75]]],
    ['Crobat', 1, 'POISON/FLYING', 13260, 1031, 961, 891, 947, 1437, [['FLYING', 'Air Slash', 'E', 75], ['POISON', 'Cross Poison', 'F', 70], ['POISON', 'Venoshock', 'E', 65], ['DARK', 'Bite', 'F', 60]]],
    ['Nidoqueen', 1, 'POISON/GROUND', 13728, 1045, 1010, 926, 982, 1020, [['FIGHTING', 'Superpower', 'F', 120], ['GROUND', 'Earth Power', 'E', 90], ['NORMAL', 'Body Slam', 'F', 85], ['DARK', 'Crunch', 'F', 80]]],
    ['Nidoking', 0, 'POISON/GROUND', 12888, 1114, 940, 996, 912, 1090, [['BUG', 'Megahorn', 'F', 120], ['NORMAL', 'Thrash', 'F', 120], ['GROUND', 'Earth Power', 'E', 90], ['POISON', 'Poison Jab', 'F', 80]]],
    ['Muk', 1, 'POISON', 15120, 1135, 926, 857, 1086, 819, [['POISON', 'Gunk Shot', 'F', 120], ['POISON', 'Belch', 'E', 120], ['POISON', 'Sludge Wave', 'E', 95], ['POISON', 'Sludge Bomb', 'E', 90]]],
    ['Tentacruel', 1, 'WATER/POISON', 12792, 891, 857, 961, 1226, 1205, [['WATER', 'Hydro Pump', 'E', 110], ['POISON', 'Sludge Wave', 'E', 95], ['POISON', 'Poison Jab', 'F', 80], ['WATER', 'Bubble Beam', 'E', 65]]],
  ]],
  ['Saffron', 'Sabrina', 'PSYCHIC', 'Kanto', [
    ['Kadabra', 0, 'PSYCHIC', 9084, 648, 613, 1240, 878, 1244, [['PSYCHIC', 'Future Sight', 'E', 120], ['PSYCHIC', 'Psychic', 'E', 90], ['PSYCHIC', 'Psycho Cut', 'F', 70], ['PSYCHIC', 'Psybeam', 'E', 65]]],
    ['Mr. Mime', 1, 'PSYCHIC/FAIRY', 9084, 717, 857, 1100, 1226, 1128, [['PSYCHIC', 'Psychic', 'E', 90], ['PSYCHIC', 'Psybeam', 'E', 65], ['GRASS', 'Magical Leaf', 'E', 60], ['PSYCHIC', 'Psywave', 'E', null]]],
    ['Espeon', 1, 'PSYCHIC', 11400, 857, 822, 1309, 1052, 1283, [['NORMAL', 'Last Resort', 'F', 140], ['PSYCHIC', 'Future Sight', 'E', 120], ['PSYCHIC', 'Psychic', 'E', 90], ['PSYCHIC', 'Psybeam', 'E', 65]]],
    ['Slowking', 0, 'WATER/PSYCHIC', 14184, 926, 961, 1100, 1156, 665, [['PSYCHIC', 'Psychic', 'E', 90], ['ROCK', 'Power Gem', 'E', 80], ['PSYCHIC', 'Zen Headbutt', 'F', 80], ['NORMAL', 'Headbutt', 'F', 70]]],
    ['Gardevoir', 1, 'PSYCHIC/FAIRY', 11688, 857, 857, 1274, 1191, 1051, [['PSYCHIC', 'Future Sight', 'E', 120], ['PSYCHIC', 'Dream Eater', 'E', 100], ['FAIRY', 'Moonblast', 'E', 95], ['PSYCHIC', 'Psychic', 'E', 90]]],
    ['Alakazam', 1, 'PSYCHIC', 10476, 752, 717, 1344, 1052, 1380, [['PSYCHIC', 'Future Sight', 'E', 120], ['PSYCHIC', 'Psychic', 'E', 90], ['PSYCHIC', 'Psycho Cut', 'F', 70], ['PSYCHIC', 'Psybeam', 'E', 65]]],
  ]],
  ['Cinnabar', 'Blaine', 'FIRE', 'Kanto', [
    ['Charizard', 1, 'FIRE/FLYING', 12612, 989, 947, 1163, 982, 1205, [['FIRE', 'Flare Blitz', 'F', 120], ['FIRE', 'Inferno', 'E', 100], ['FIRE', 'Heat Wave', 'E', 95], ['FIRE', 'Flamethrower', 'E', 90]]],
    ['Magmortar', 0, 'FIRE', 12336, 1066, 871, 1274, 1052, 1074, [['NORMAL', 'Hyper Beam', 'E', 150], ['FIRE', 'Fire Blast', 'E', 110], ['FIRE', 'Flamethrower', 'E', 90], ['FIRE', 'Lava Plume', 'E', 80]]],
    ['Camerupt', 1, 'FIRE/GROUND', 11868, 1100, 891, 1135, 912, 742, [['FIRE', 'Eruption', 'E', 150], ['GROUND', 'Earthquake', 'F', 100], ['GROUND', 'Earth Power', 'E', 90], ['NORMAL', 'Take Down', 'F', 90]]],
    ['Typhlosion', 0, 'FIRE', 12612, 989, 947, 1163, 982, 1205, [['FIRE', 'Eruption', 'E', 150], ['NORMAL', 'Double-Edge', 'F', 120], ['FIRE', 'Inferno', 'E', 100], ['FIRE', 'Flamethrower', 'E', 90]]],
    ['Arcanine', 1, 'FIRE', 13728, 1170, 961, 1100, 947, 1167, [['DRAGON', 'Outrage', 'F', 120], ['FIRE', 'Flare Blitz', 'F', 120], ['FIRE', 'Heat Wave', 'E', 95], ['NORMAL', 'Take Down', 'F', 90]]],
    ['Magmar', 1, 'FIRE', 11400, 1066, 801, 1100, 982, 1151, [['FIRE', 'Fire Blast', 'E', 110], ['FIRE', 'Flamethrower', 'E', 90], ['FIRE', 'Lava Plume', 'E', 80], ['FIRE', 'Fire Punch', 'F', 75]]],
  ]],
  ['Viridian', 'Giovanni', 'GROUND', 'Kanto', [
    ['Rhydon', 1, 'GROUND/ROCK', 15120, 1309, 1240, 717, 703, 742, [['BUG', 'Megahorn', 'F', 120], ['ROCK', 'Stone Edge', 'F', 100], ['FIGHTING', 'Hammer Arm', 'F', 100], ['GROUND', 'Earthquake', 'F', 100]]],
    ['Sandslash', 1, 'GROUND', 12336, 1100, 1170, 717, 773, 935, [['GROUND', 'Earthquake', 'F', 100], ['GROUND', 'Dig', 'F', 80], ['NORMAL', 'Crush Claw', 'F', 75], ['NORMAL', 'Slash', 'F', 70]]],
    ['Donphan', 1, 'GROUND', 13728, 1240, 1240, 822, 808, 819, [['NORMAL', 'Giga Impact', 'F', 150], ['GROUND', 'Earthquake', 'F', 100], ['NORMAL', 'Slam', 'F', 80], ['NORMAL', 'Horn Attack', 'F', 65]]],
    ['Marowak', 1, 'GROUND', 10944, 961, 1170, 752, 947, 780, [['NORMAL', 'Thrash', 'F', 120], ['NORMAL', 'Double-Edge', 'F', 120], ['NORMAL', 'Headbutt', 'F', 70], ['NORMAL', 'Retaliate', 'F', 70]]],
    ['Swampert', 0, 'WATER/GROUND', 14652, 1170, 1031, 996, 1017, 896, [['FIGHTING', 'Hammer Arm', 'F', 100], ['GROUND', 'Earthquake', 'F', 100], ['WATER', 'Muddy Water', 'E', 90], ['NORMAL', 'Take Down', 'F', 90]]],
    ['Rhyperior', 0, 'GROUND/ROCK', 16044, 1379, 1309, 787, 773, 742, [['ROCK', 'Rock Wrecker', 'F', 150], ['BUG', 'Megahorn', 'F', 120], ['ROCK', 'Stone Edge', 'F', 100], ['GROUND', 'Earthquake', 'F', 100]]],
  ]],
  ['Violet', 'Falkner', 'FLYING', 'Johto', [
    ['Pidgeot', 1, 'NORMAL/FLYING', 13080, 961, 926, 891, 878, 1213, [['FLYING', 'Hurricane', 'E', 110], ['FLYING', 'Air Slash', 'E', 75], ['FLYING', 'Wing Attack', 'F', 60], ['NORMAL', 'Tackle', 'F', 50]]],
    ['Archeops', 0, 'ROCK/FLYING', 12336, 1379, 857, 1184, 843, 1283, [['NORMAL', 'Thrash', 'F', 120], ['DRAGON', 'Dragon Claw', 'F', 80], ['DARK', 'Crunch', 'F', 80], ['ROCK', 'Rock Slide', 'F', 75]]],
    ["Farfetch'd", 1, 'NORMAL/FLYING', 10200, 857, 787, 808, 822, 896, [['FLYING', 'Brave Bird', 'F', 120], ['POISON', 'Poison Jab', 'F', 80], ['FLYING', 'Air Slash', 'E', 75], ['NORMAL', 'Slash', 'F', 70]]],
    ['Gyarados', 1, 'WATER/FLYING', 14184, 1274, 954, 822, 1086, 1059, [['NORMAL', 'Hyper Beam', 'E', 150], ['NORMAL', 'Thrash', 'F', 120], ['WATER', 'Hydro Pump', 'E', 110], ['WATER', 'Aqua Tail', 'F', 90]]],
    ['Fearow', 0, 'NORMAL/FLYING', 11400, 1031, 857, 829, 815, 1205, [['FLYING', 'Drill Peck', 'F', 80], ['GROUND', 'Drill Run', 'F', 80], ['FLYING', 'Aerial Ace', 'F', 60], ['FLYING', 'Pluck', 'F', 60]]],
    ['Dodrio', 1, 'NORMAL/FLYING', 10944, 1170, 891, 822, 808, 1205, [['NORMAL', 'Thrash', 'F', 120], ['NORMAL', 'Uproar', 'E', 90], ['FLYING', 'Drill Peck', 'F', 80], ['NORMAL', 'Tri-Attack', 'E', 80]]],
  ]],
  ['Azalea', 'Bugsy', 'BUG', 'Johto', [
    ['Beedrill', 1, 'BUG/POISON', 11400, 1031, 683, 717, 947, 1012, [['POISON', 'Poison Jab', 'F', 80], ['DARK', 'Assurance', 'F', 60], ['DARK', 'Pursuit', 'F', 40], ['BUG', 'Fell Stinger', 'F', 30]]],
    ['Vespiquen', 0, 'BUG/FLYING', 11868, 961, 1114, 961, 1100, 742, [['BUG', 'Attack Order', 'F', 90], ['ROCK', 'Power Gem', 'E', 80], ['FLYING', 'Air Slash', 'E', 75], ['NORMAL', 'Slash', 'F', 70]]],
    ['Pinsir', 1, 'BUG', 11400, 1274, 1100, 787, 878, 1090, [['NORMAL', 'Thrash', 'F', 120], ['FIGHTING', 'Superpower', 'F', 120], ['FIGHTING', 'Submission', 'F', 80], ['BUG', 'X-Scissor', 'F', 80]]],
    ['Heracross', 0, 'BUG/FIGHTING', 12792, 1274, 926, 683, 1052, 1090, [['BUG', 'Megahorn', 'F', 120], ['FIGHTING', 'Close Combat', 'F', 120], ['NORMAL', 'Take Down', 'F', 90], ['FIGHTING', 'Brick Break', 'F', 75]]],
    ['Scizor', 0, 'BUG/STEEL', 11868, 1309, 1100, 787, 947, 935, [['STEEL', 'Iron Head', 'F', 80], ['BUG', 'X-Scissor', 'F', 80], ['NORMAL', 'Razor Wind', 'E', 80], ['NORMAL', 'Slash', 'F', 70]]],
    ['Scyther', 1, 'BUG/FLYING', 11868, 1170, 961, 787, 947, 1244, [['BUG', 'X-Scissor', 'F', 80], ['NORMAL', 'Razor Wind', 'E', 80], ['FLYING', 'Air Slash', 'E', 75], ['NORMAL', 'Slash', 'F', 70]]],
  ]],
  ['Goldenrod', 'Whitney', 'NORMAL', 'Johto', [
    ['Wigglytuff', 0, 'NORMAL/FAIRY', 18360, 891, 717, 996, 738, 780, [['NORMAL', 'Double-Edge', 'F', 120], ['FAIRY', 'Play Rough', 'F', 90], ['NORMAL', 'Hyper Voice', 'E', 90], ['NORMAL', 'Body Slam', 'F', 85]]],
    ['Kangaskhan', 0, 'NORMAL', 15120, 1066, 961, 683, 947, 1128, [['DRAGON', 'Outrage', 'F', 120], ['DARK', 'Crunch', 'F', 80], ['NORMAL', 'Mega Punch', 'F', 80], ['DARK', 'Sucker Punch', 'F', 80]]],
    ['Tauros', 1, 'NORMAL', 12336, 1100, 1066, 683, 878, 1283, [['NORMAL', 'Giga Impact', 'F', 150], ['NORMAL', 'Thrash', 'F', 120], ['NORMAL', 'Take Down', 'F', 90], ['PSYCHIC', 'Zen Headbutt', 'F', 80]]],
    ['Snorlax', 1, 'NORMAL', 20220, 1170, 857, 857, 1156, 665, [['NORMAL', 'Giga Impact', 'F', 150], ['NORMAL', 'Body Slam', 'F', 85], ['DARK', 'Crunch', 'F', 80], ['NORMAL', 'Chip Away', 'F', 70]]],
    ['Ursaring', 1, 'NORMAL', 13728, 1309, 926, 926, 912, 858, [['NORMAL', 'Thrash', 'F', 120], ['FIGHTING', 'Hammer Arm', 'F', 100], ['NORMAL', 'Slash', 'F', 70], ['NORMAL', 'Covet', 'F', 60]]],
    ['Miltank', 1, 'NORMAL', 14184, 961, 1135, 683, 878, 1205, [['NORMAL', 'Body Slam', 'F', 85], ['PSYCHIC', 'Zen Headbutt', 'F', 80], ['FIGHTING', 'Wake-Up Slap', 'F', 70], ['NORMAL', 'Stomp', 'F', 65]]],
  ]],
  ['Ecruteak', 'Morty', 'GHOST', 'Johto', [
    ['Misdreavus', 0, 'GHOST', 10944, 822, 822, 996, 982, 1090, [['GHOST', 'Shadow Ball', 'E', 80], ['ROCK', 'Power Gem', 'E', 80], ['GHOST', 'Hex', 'E', 65], ['PSYCHIC', 'Psybeam', 'E', 65]]],
    ['Sableye', 0, 'DARK/GHOST', 10020, 926, 926, 857, 843, 819, [['DARK', 'Foul Play', 'F', 95], ['GHOST', 'Shadow Ball', 'E', 80], ['PSYCHIC', 'Zen Headbutt', 'F', 80], ['ROCK', 'Power Gem', 'E', 80]]],
    ['Banette', 0, 'GHOST', 11316, 1205, 857, 982, 829, 935, [['GHOST', 'Phantom Force', 'F', 90], ['GHOST', 'Shadow Ball', 'E', 80], ['DARK', 'Sucker Punch', 'F', 80], ['DARK', 'Knock Off', 'F', 65]]],
    ['Dusclops', 0, 'GHOST', 9084, 891, 1309, 822, 1295, 626, [['PSYCHIC', 'Future Sight', 'E', 120], ['GHOST', 'Shadow Ball', 'E', 80], ['FIRE', 'Fire Punch', 'F', 75], ['ICE', 'Ice Punch', 'F', 75]]],
    ['Dusknoir', 0, 'GHOST', 9552, 1100, 1344, 857, 1330, 780, [['PSYCHIC', 'Future Sight', 'E', 120], ['GHOST', 'Shadow Ball', 'E', 80], ['FIRE', 'Fire Punch', 'F', 75], ['ICE', 'Ice Punch', 'F', 75]]],
    ['Gengar', 1, 'GHOST/POISON', 10944, 857, 822, 1309, 912, 1283, [['PSYCHIC', 'Dream Eater', 'E', 100], ['GHOST', 'Shadow Ball', 'E', 80], ['DARK', 'Sucker Punch', 'F', 80], ['DARK', 'Dark Pulse', 'E', 80]]],
  ]],
  ['Cianwood', 'Chuck', 'FIGHTING', 'Johto', [
    ['Hitmonlee', 1, 'FIGHTING', 10020, 1240, 773, 648, 1156, 1105, [['FIGHTING', 'Hi Jump Kick', 'F', 130], ['NORMAL', 'Mega Kick', 'F', 120], ['FIGHTING', 'Close Combat', 'F', 120], ['FIGHTING', 'Jump Kick', 'F', 100]]],
    ['Hitmonchan', 1, 'FIGHTING', 10020, 1135, 954, 648, 1156, 1020, [['FIGHTING', 'Focus Punch', 'F', 150], ['FIGHTING', 'Close Combat', 'F', 120], ['FIGHTING', 'Sky Uppercut', 'F', 85], ['NORMAL', 'Mega Punch', 'F', 80]]],
    ['Throh', 0, 'FIGHTING', 16500, 1100, 996, 613, 982, 780, [['FIGHTING', 'Superpower', 'F', 120], ['NORMAL', 'Body Slam', 'F', 85], ['FIGHTING', 'Vital Throw', 'F', 70], ['FIGHTING', 'Revenge', 'F', 60]]],
    ['Machamp', 1, 'FIGHTING', 13728, 1309, 961, 857, 982, 858, [['FIGHTING', 'Dynamic Punch', 'F', 100], ['FIGHTING', 'Cross Chop', 'F', 100], ['FIGHTING', 'Low Kick', 'F', 80], ['FIGHTING', 'Submission', 'F', 80]]],
    ['Sawk', 0, 'FIGHTING', 12336, 1274, 926, 613, 912, 1090, [['FIGHTING', 'Close Combat', 'F', 120], ['FIGHTING', 'Brick Break', 'F', 75], ['NORMAL', 'Retaliate', 'F', 70], ['FIGHTING', 'Low Sweep', 'F', 65]]],
    ['Poliwrath', 1, 'WATER/FIGHTING', 13728, 1066, 1066, 891, 1017, 974, [['WATER', 'Hydro Pump', 'E', 110], ['FIGHTING', 'Dynamic Punch', 'F', 100], ['NORMAL', 'Body Slam', 'F', 85], ['FIGHTING', 'Submission', 'F', 80]]],
  ]],
  ['Olivine', 'Jasmine', 'STEEL', 'Johto', [
    ['Magneton', 1, 'ELECTRIC/STEEL', 10020, 822, 1066, 1240, 878, 974, [['ELECTRIC', 'Zap Cannon', 'E', 120], ['NORMAL', 'Tri-Attack', 'E', 80], ['STEEL', 'Flash Cannon', 'E', 80], ['ELECTRIC', 'Discharge', 'E', 80]]],
    ['Skarmory', 0, 'STEEL/FLYING', 11400, 961, 1379, 683, 878, 974, [['FLYING', 'Air Slash', 'E', 75], ['STEEL', 'Steel Wing', 'F', 70], ['NORMAL', 'Slash', 'F', 70], ['DARK', 'Night Slash', 'F', 70]]],
    ['Lucario', 1, 'FIGHTING/STEEL', 11868, 1170, 891, 1205, 878, 1128, [['FIGHTING', 'Close Combat', 'F', 120], ['DRAGON', 'Dragon Pulse', 'E', 85], ['NORMAL', 'Extreme Speed', 'F', 80], ['FIGHTING', 'Aura Sphere', 'E', 80]]],
    ['Aggron', 1, 'STEEL/ROCK', 11868, 1170, 1658, 822, 808, 819, [['STEEL', 'Metal Burst', 'F', 120], ['NORMAL', 'Double-Edge', 'F', 120], ['STEEL', 'Iron Tail', 'F', 100], ['NORMAL', 'Take Down', 'F', 90]]],
    ['Metagross', 0, 'STEEL/PSYCHIC', 12792, 1344, 1309, 1066, 1017, 974, [['NORMAL', 'Hyper Beam', 'E', 150], ['FIGHTING', 'Hammer Arm', 'F', 100], ['PSYCHIC', 'Psychic', 'E', 90], ['STEEL', 'Meteor Mash', 'F', 90]]],
    ['Steelix', 1, 'STEEL/GROUND', 12336, 996, 1797, 787, 843, 665, [['NORMAL', 'Double-Edge', 'F', 120], ['STEEL', 'Iron Tail', 'F', 100], ['ROCK', 'Stone Edge', 'F', 100], ['NORMAL', 'Slam', 'F', 80]]],
  ]],
  ['Mahogany', 'Pryce', 'ICE', 'Johto', [
    ['Walrein', 0, 'ICE/WATER', 15576, 961, 1031, 1066, 1017, 935, [['ICE', 'Blizzard', 'E', 110], ['NORMAL', 'Body Slam', 'F', 85], ['DARK', 'Crunch', 'F', 80], ['ICE', 'Ice Fang', 'F', 65]]],
    ['Jynx', 1, 'ICE/PSYCHIC', 11400, 752, 648, 1205, 1052, 1167, [['ICE', 'Blizzard', 'E', 110], ['NORMAL', 'Body Slam', 'F', 85], ['ICE', 'Ice Punch', 'F', 75], ['FIGHTING', 'Wake-Up Slap', 'F', 70]]],
    ['Dewgong', 0, 'WATER/ICE', 13728, 891, 961, 891, 1052, 974, [['WATER', 'Aqua Tail', 'F', 90], ['ICE', 'Ice Beam', 'E', 90], ['NORMAL', 'Take Down', 'F', 90], ['WATER', 'Dive', 'F', 80]]],
    ['Cloyster', 1, 'WATER/ICE', 10020, 1066, 1658, 996, 703, 974, [['WATER', 'Hydro Pump', 'E', 110], ['ICE', 'Ice Beam', 'E', 90], ['ICE', 'Icicle Crash', 'F', 85], ['WATER', 'Razor Shell', 'F', 75]]],
    ['Lapras', 1, 'WATER/ICE', 17436, 996, 961, 996, 1052, 896, [['WATER', 'Hydro Pump', 'E', 110], ['ICE', 'Ice Beam', 'E', 90], ['NORMAL', 'Body Slam', 'F', 85], ['WATER', 'Brine', 'E', 65]]],
    ['Piloswine', 1, 'ICE/GROUND', 14652, 1100, 961, 822, 808, 819, [['NORMAL', 'Thrash', 'F', 120], ['ICE', 'Blizzard', 'E', 110], ['GROUND', 'Earthquake', 'F', 100], ['NORMAL', 'Take Down', 'F', 90]]],
  ]],
  ['Blackthorn', 'Clair', 'DRAGON', 'Johto', [
    ['Altaria', 0, 'DRAGON/FLYING', 12336, 891, 1031, 891, 1121, 1051, [['FLYING', 'Sky Attack', 'F', 140], ['FAIRY', 'Moonblast', 'E', 95], ['NORMAL', 'Take Down', 'F', 90], ['DRAGON', 'Dragon Pulse', 'E', 85]]],
    ['Flygon', 0, 'GROUND/DRAGON', 12792, 1100, 961, 961, 947, 1205, [['NORMAL', 'Hyper Beam', 'E', 150], ['GROUND', 'Earthquake', 'F', 100], ['DRAGON', 'Dragon Rush', 'F', 100], ['GROUND', 'Earth Power', 'E', 90]]],
    ['Salamence', 0, 'DRAGON/FLYING', 14184, 1344, 961, 1170, 947, 1205, [['NORMAL', 'Double-Edge', 'F', 120], ['FIRE', 'Flamethrower', 'E', 90], ['FLYING', 'Fly', 'F', 90], ['DARK', 'Crunch', 'F', 80]]],
    ['Dragonair', 1, 'DRAGON', 11040, 989, 857, 891, 878, 974, [['NORMAL', 'Hyper Beam', 'E', 150], ['DRAGON', 'Outrage', 'F', 120], ['DRAGON', 'Dragon Rush', 'F', 100], ['WATER', 'Aqua Tail', 'F', 90]]],
    ['Kingdra', 1, 'WATER/DRAGON', 12336, 1066, 1066, 1066, 1052, 1090, [['WATER', 'Hydro Pump', 'E', 110], ['DRAGON', 'Dragon Pulse', 'E', 85], ['WATER', 'Bubble Beam', 'E', 65], ['WATER', 'Brine', 'E', 65]]],
    ['Dragonite', 0, 'DRAGON/FLYING', 13812, 1337, 1066, 1100, 1086, 1051, [['NORMAL', 'Hyper Beam', 'E', 150], ['DRAGON', 'Outrage', 'F', 120], ['FLYING', 'Hurricane', 'E', 110], ['DRAGON', 'Dragon Rush', 'F', 100]]],
  ]],
  ['Spikemuth', 'Piers', 'DARK', 'Otras', [
    ['Tyranitar', 0, 'ROCK/DARK', 14652, 1337, 1170, 1066, 1086, 904, [['NORMAL', 'Hyper Beam', 'E', 150], ['NORMAL', 'Giga Impact', 'F', 150], ['NORMAL', 'Thrash', 'F', 120], ['ROCK', 'Stone Edge', 'F', 100]]],
    ['Umbreon', 0, 'DARK', 14184, 857, 1170, 822, 1295, 935, [['NORMAL', 'Last Resort', 'F', 140], ['DARK', 'Feint Attack', 'F', 60], ['DARK', 'Assurance', 'F', 60], ['NORMAL', 'Tackle', 'F', 50]]],
    ['Houndoom', 0, 'DARK/FIRE', 12336, 1031, 752, 1170, 947, 1167, [['FIRE', 'Inferno', 'E', 100], ['DARK', 'Foul Play', 'F', 95], ['FIRE', 'Flamethrower', 'E', 90], ['DARK', 'Crunch', 'F', 80]]],
    ['Pangoro', 0, 'FIGHTING/DARK', 14184, 1268, 947, 884, 884, 881, [['FIGHTING', 'Hammer Arm', 'F', 100], ['NORMAL', 'Body Slam', 'F', 85], ['FIGHTING', 'Sky Uppercut', 'F', 85], ['DARK', 'Crunch', 'F', 80]]],
    ['Weavile', 0, 'DARK/ICE', 11868, 1240, 857, 717, 982, 1399, [['DARK', 'Dark Pulse', 'E', 80], ['DARK', 'Night Slash', 'F', 70], ['FIGHTING', 'Revenge', 'F', 60], ['DARK', 'Assurance', 'F', 60]]],
    ['Zoroark', 0, 'DARK', 10944, 1135, 822, 1240, 808, 1244, [['DARK', 'Foul Play', 'F', 95], ['DARK', 'Night Daze', 'E', 85], ['DARK', 'Night Slash', 'F', 70], ['BUG', 'U-turn', 'F', 70]]],
  ]],
  ['Laverre', 'Valerie', 'FAIRY', 'Otras', [
    ['Florges', 0, 'FAIRY', 12612, 857, 878, 1184, 1463, 1012, [['GRASS', 'Petal Dance', 'E', 120], ['GRASS', 'Solar Beam', 'E', 120], ['FAIRY', 'Moonblast', 'E', 95], ['GRASS', 'Petal Blizzard', 'F', 90]]],
    ['Gardevoir', 0, 'PSYCHIC/FAIRY', 11688, 857, 857, 1274, 1191, 1051, [['PSYCHIC', 'Future Sight', 'E', 120], ['PSYCHIC', 'Dream Eater', 'E', 100], ['FAIRY', 'Moonblast', 'E', 95], ['PSYCHIC', 'Psychic', 'E', 90]]],
    ['Sylveon', 0, 'FAIRY', 14184, 857, 857, 1170, 1295, 896, [['NORMAL', 'Last Resort', 'F', 140], ['FAIRY', 'Moonblast', 'E', 95], ['NORMAL', 'Swift', 'E', 60], ['NORMAL', 'Tackle', 'F', 50]]],
    ['Togekiss', 1, 'FAIRY/FLYING', 13260, 752, 1066, 1240, 1191, 1051, [['FLYING', 'Sky Attack', 'F', 140], ['NORMAL', 'Last Resort', 'F', 140], ['NORMAL', 'Double-Edge', 'F', 120], ['FIGHTING', 'Aura Sphere', 'E', 80]]],
    ['Mawile', 1, 'STEEL/FAIRY', 10020, 996, 996, 787, 773, 819, [['FAIRY', 'Play Rough', 'F', 90], ['STEEL', 'Iron Head', 'F', 80], ['DARK', 'Sucker Punch', 'F', 80], ['DARK', 'Crunch', 'F', 80]]],
    ['Wigglytuff', 0, 'NORMAL/FAIRY', 18360, 891, 717, 996, 738, 780, [['NORMAL', 'Double-Edge', 'F', 120], ['FAIRY', 'Play Rough', 'F', 90], ['NORMAL', 'Hyper Voice', 'E', 90], ['NORMAL', 'Body Slam', 'F', 85]]],
  ]],
];

const BUILTIN = G.map(([name, leader, type, region, team], k) => ({
  name, city: name.toLowerCase(), leader, type, region, order: k + 1, builtin: true, t: Date.UTC(2026, 9, 12),
  team: team.map(([n, sh, types, hp, atk, def, spa, spd, spe, moves]) => ({
    name: n, level: 400, shiny: !!sh, types: types.split('/'),
    battleHp: hp, stats: { hp: hp / 12, atk, def, spa, spd, spe }, ivs: null,   // ♥ del gimnasio = 12 × HP
    moves: moves.map(([t, mn, c, p]) => ({ name: mn, type: t, power: p, cat: c === 'F' ? 'Físico' : 'Especial' })),
  })),
}));

module.exports = { BUILTIN };

};
__defs['ivcalc']=function(module,exports,require){
// Poke Azul — cálculo de calidad e IV a partir de las stats que enseña el juego.
// Fórmula del juego (comprobada con un Scizor real: nv 501, calidad 2,6, IV 187/192):
//   stat = redondeo( (base + 2·IV) · (nivel / 100) · calidad^k )   con k = 0,95 en HP y VEL, y 0,80 en el resto
//
// Pokémon de jugadores en gimnasios (BDS - Lokiivlr, 5 pokémon): ATK, DEF, SP.ATK y SP.DEF llevan un bonus ×1,30
// que se aplica DESPUÉS de redondear la stat normal:  stat = redondeo( redondeo(fórmula) · 1,30 ).  HP y VEL no lo llevan.
// Con eso encajan las 6 stats exactas de Tyranitar, Weavile, Umbreon y Houndour; Houndoom pide ×1,3065 (ver solveBonus).
//
// El cálculo es analítico: cada stat, para cada IV (0–32), solo vale en un tramo de calidades que se despeja
// directamente; el resultado es la intersección de esos tramos (milisegundos, sin barrer calidades una a una).
'use strict';

const KEYS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const BONUS_KEYS = ['atk', 'def', 'spa', 'spd'];
const EXP = { hp: 0.95, atk: 0.8, def: 0.8, spa: 0.8, spd: 0.8, spe: 0.95 };
const IV_MIN = 0, IV_MAX = 32;
const Q_MIN = 0.3, Q_MAX = 6, RNG = [Q_MIN, Q_MAX];
const BONUS = 1.3;            // bonus de los pokémon de jugadores en gimnasio (ATK/DEF/SP.ATK/SP.DEF)
const RARITY = [[4, 'Divina'], [3, 'Anciana'], [2, 'Mítica'], [1.7, 'Legendaria'], [1.5, 'Épica'], [1.3, 'Rara'], [1.1, 'Poco común'], [1, 'Común'], [0, 'Débil']];

const statOf = (base, iv, level, q, k) => Math.round((base + 2 * iv) * (level / 100) * Math.pow(q, EXP[k]));
// stat de un pokémon de gimnasio de jugador: las 4 stats de combate se multiplican por m tras redondear
const playerStatOf = (base, iv, level, q, k, m = BONUS) => {
  const s = statOf(base, iv, level, q, k);
  return BONUS_KEYS.includes(k) ? Math.round(s * m) : s;
};
const rarityOf = (q) => { for (const [t, n] of RARITY) if (q + 1e-9 >= t) return n; return 'Débil'; };
const r3 = (x) => Math.round(x * 1000) / 1000;

// ---------- núcleo analítico ----------

// Tramos de calidad en los que una stat observada `s` sale de algún IV. Con bonus m≠1 la stat normal n cumple round(n·m) = s.
// → [{lo, hi, iv}] (lo incluido, hi excluido)
function statWindows(b, level, k, s, m, rng = RNG) {
  const e = EXP[k], out = [];
  let ns;
  if (m === 1) ns = [s];
  else {
    ns = [];
    for (let n = Math.floor((s - 0.5) / m) - 1; n <= Math.ceil((s + 0.5) / m) + 1; n++) if (n > 0 && Math.round(n * m) === s) ns.push(n);
  }
  for (let iv = IV_MIN; iv <= IV_MAX; iv++) {
    const A = (b + 2 * iv) * (level / 100);
    if (!(A > 0)) continue;
    let cur = null;
    for (const n of ns) {
      const lo = Math.max(rng[0], n - 0.5 <= 0 ? 0 : Math.pow((n - 0.5) / A, 1 / e));
      const hi = Math.min(rng[1], Math.pow((n + 0.5) / A, 1 / e));
      if (!(hi > lo)) continue;
      if (cur && lo <= cur.hi + 1e-12) cur.hi = Math.max(cur.hi, hi);
      else { cur = { lo, hi, iv }; out.push(cur); }
    }
  }
  return out.sort((x, y) => x.lo - y.lo);
}

// Intersección de los tramos de varias stats → [{lo, hi, ivs:{k:iv}}]
function intersect(lists) {
  let wins = null;
  for (const [k, list] of lists) {
    if (!wins) { wins = list.map((w) => ({ lo: w.lo, hi: w.hi, ivs: { [k]: w.iv } })); continue; }
    const next = [];
    for (const c of wins) {
      for (const w of list) {
        if (w.lo >= c.hi) break;               // la lista está ordenada por lo
        if (w.hi <= c.lo) continue;
        next.push({ lo: Math.max(c.lo, w.lo), hi: Math.min(c.hi, w.hi), ivs: { ...c.ivs, [k]: w.iv } });
        if (next.length > 20000) break;
      }
    }
    wins = next;
    if (!wins.length) break;
  }
  return wins || [];
}

// Cierra los tramos: comprueba hacia delante con la fórmula y agrupa por combinación de IV
function verified(base, level, wins, m) {
  const groups = new Map();
  for (const w of wins) {
    let q = null;
    for (const t of [0.5, 0.25, 0.75, 0.1, 0.9]) {
      const c = w.lo + (w.hi - w.lo) * t;
      if (Object.entries(w.ivs).every(([k, iv]) => w.obs[k] === playerStatOf(Number(base[k]), iv, level, c, k, m))) { q = c; break; }
    }
    if (q == null) continue;
    const sig = Object.keys(w.ivs).sort().map((k) => k + w.ivs[k]).join('/');
    const g = groups.get(sig);
    if (!g) groups.set(sig, { lo: w.lo, hi: w.hi, ivs: w.ivs, m });
    else { g.lo = Math.min(g.lo, w.lo); g.hi = Math.max(g.hi, w.hi); }
  }
  return [...groups.values()];
}

// Todas las combinaciones (IV, calidad) que explican TODAS las stats dadas con el bonus m
function fitAll(base, level, stats, keys, m, rng) {
  const lists = keys.map((k) => [k, statWindows(Number(base[k]), level, k, Number(stats[k]), BONUS_KEYS.includes(k) ? m : 1, rng)]);
  if (lists.some(([, l]) => !l.length)) return [];
  lists.sort((a, b) => a[1].length - b[1].length);       // primero las más restrictivas
  const wins = intersect(lists);
  for (const w of wins) w.obs = stats;
  return verified(base, level, wins, m);
}

// Con un bonus libre: la calidad la fijan HP/VEL (sin bonus); para cada tramo se despejan los m que cuadran en las 4 stats
function fitFreeBonus(base, level, stats, hsKeys, bKeys, rng) {
  const hs = intersect(hsKeys.map((k) => [k, statWindows(Number(base[k]), level, k, Number(stats[k]), 1, rng)]).sort((a, b) => a[1].length - b[1].length));
  const found = [];
  for (const w of hs) {
    // por stat: intervalos de m (n = stat normal posible dentro del tramo de calidad)
    const perStat = bKeys.map((k) => {
      const b = Number(base[k]), s = Number(stats[k]), e = EXP[k], out = [];
      for (let iv = IV_MIN; iv <= IV_MAX; iv++) {
        const A = (b + 2 * iv) * (level / 100);
        const n0 = Math.round(A * Math.pow(w.lo, e)), n1 = Math.round(A * Math.pow(w.hi, e));
        for (let n = n0; n <= n1; n++) if (n > 0) out.push([(s - 0.5) / n, (s + 0.5) / n]);
      }
      return out.filter(([a, z]) => z > 1.0005 && a < 3);
    });
    if (perStat.some((l) => !l.length)) continue;
    // intersección de uniones de intervalos
    let cur = perStat[0].map((x) => x.slice());
    for (let i = 1; i < perStat.length && cur.length; i++) {
      const nx = [];
      for (const a of cur) for (const z of perStat[i]) { const lo = Math.max(a[0], z[0]), hi = Math.min(a[1], z[1]); if (hi > lo) nx.push([lo, hi]); }
      cur = nx;
    }
    for (const [ma, mb] of cur) {
      for (const t of [0.5, 0.2, 0.8, 0.05, 0.95]) {
        const m = ma + (mb - ma) * t;
        const sols = fitAll(base, level, stats, [...hsKeys, ...bKeys], m, rng).filter((g) => g.hi > w.lo && g.lo < w.hi);
        if (sols.length) { for (const g of sols) found.push({ ...g, mLo: ma, mHi: mb, m: (ma + mb) / 2 }); break; }
      }
    }
  }
  return found;
}

// Mejor ajuste parcial (por si una stat está mal leída): calidad donde más stats cuadran, con bonus m
function bestPartial(base, level, stats, keys, m, rng) {
  const lists = keys.map((k) => ({ k, w: statWindows(Number(base[k]), level, k, Number(stats[k]), BONUS_KEYS.includes(k) ? m : 1, rng) }));
  const pts = new Set();
  for (const { w } of lists) for (const x of w) { pts.add(x.lo); pts.add(x.hi); }
  const xs = [...pts].sort((a, b) => a - b);
  // HP y VEL no llevan bonus de gimnasio: si cuadran ellas, la calidad es más fiable (desempate)
  let best = 0, bestScore = -1, segs = [];
  for (let i = 0; i + 1 < xs.length; i++) {
    if (xs[i + 1] - xs[i] < 1e-9) continue;
    const q = (xs[i] + xs[i + 1]) / 2;
    const ivs = {};
    for (const { k, w } of lists) { const x = w.find((y) => y.lo <= q && q < y.hi); if (x) ivs[k] = x.iv; }
    const c = Object.keys(ivs).length;
    const score = c + (['hp', 'spe'].filter((k) => keys.includes(k)).every((k) => ivs[k] != null) ? 0.5 : 0);
    if (score > bestScore) { bestScore = score; best = c; segs = []; }
    if (score === bestScore) segs.push({ lo: xs[i], hi: xs[i + 1], ivs });
  }
  return { count: best, segs };
}

// ---------- API ----------

// opts.q = calidad ya conocida (p. ej. 2,00 en los gimnasios NPC): solo se busca alrededor de ella
const rngOf = (opts) => (Number(opts && opts.q) > 0 ? [Math.max(Q_MIN, opts.q - 0.003), Math.min(Q_MAX, opts.q + 0.003)] : RNG);

// IV de la stat más cercano para una calidad dada (cuando una stat no encaja exacta)
function nearestIv(base, level, q, k, stat, m) {
  const f = (level / 100) * Math.pow(q, EXP[k]) * (BONUS_KEYS.includes(k) ? m : 1);
  return Math.max(IV_MIN, Math.min(IV_MAX, Math.round((Number(stat) / f - Number(base)) / 2)));
}

// Monta el resultado a partir de uno o varios candidatos (cands: [{lo, hi, ivs, m, mLo?, mHi?}])
function build(base, level, stats, keys, cands, opts) {
  const exact = opts.exact !== false && cands.length === 1 && cands[0].hi - cands[0].lo < 0.05;
  // el candidato preferido es el más cercano al bonus conocido
  const sorted = cands.slice().sort((a, b) => Math.abs(a.m - BONUS) - Math.abs(b.m - BONUS) || (a.hi - a.lo) - (b.hi - b.lo));
  const c = sorted[0];
  const q = (c.lo + c.hi) / 2;
  const ivs = {};
  for (const k of keys) ivs[k] = c.ivs[k] != null ? c.ivs[k] : nearestIv(base[k], level, q, k, stats[k], c.m);
  const total = keys.reduce((s, k) => s + ivs[k], 0);
  const qMin = Math.min(...cands.map((x) => x.lo)), qMax = Math.max(...cands.map((x) => x.hi));
  const res = {
    quality: Math.round(q * 100) / 100, qMin: r3(qMin), qMax: r3(qMax), rarity: rarityOf(Math.round(q * 100) / 100), ivs, total,
    max: keys.length * IV_MAX, pct: Math.round((total / (keys.length * IV_MAX)) * 1000) / 10, keys,
    exact, estimated: !exact, bonus: Math.round(c.m * 1000) / 1000,
  };
  if (cands.length > 1) {
    res.ivRange = {};
    for (const k of keys) {
      const v = cands.map((x) => (x.ivs[k] != null ? x.ivs[k] : ivs[k]));
      res.ivRange[k] = [Math.min(...v), Math.max(...v)];
    }
    res.totalRange = [Math.min(...cands.map((x) => keys.reduce((s, k) => s + (x.ivs[k] != null ? x.ivs[k] : ivs[k]), 0))),
                      Math.max(...cands.map((x) => keys.reduce((s, k) => s + (x.ivs[k] != null ? x.ivs[k] : ivs[k]), 0)))];
    res.candidates = cands.length;
  }
  const bad = keys.filter((k) => c.ivs[k] == null);
  if (bad.length) res.mismatch = bad;
  if (opts.free && cands.length === 1) res.bonusFree = true;
  return res;
}

/**
 * @param {{hp,atk,def,spa,spd,spe}} base   stats base de la especie
 * @param {number} level
 * @param {{hp,atk,def,spa,spd,spe}} stats  stats que enseña el juego (hp = stat HP, no la ♥ de gimnasio)
 * @param {{skipHp?:boolean, bonus?:boolean, q?:number}} opts   bonus: pokémon de jugador en gimnasio (ver solveBonus); q: calidad conocida
 * @returns {{quality, qMin, qMax, rarity, ivs, total, max, pct, keys, exact, estimated, bonus} | {unsolvable:true} | null}
 */
function solve(base, level, stats, opts = {}) {
  if (!base || !level || !stats) return null;
  if (opts.bonus) return solveBonus(base, level, stats, opts);
  const keys = KEYS.filter((k) => Number(base[k]) > 0 && Number(stats[k]) > 0 && !(opts.skipHp && k === 'hp'));
  if (keys.length < 4) return null;
  const rng = rngOf(opts);
  const cands = fitAll(base, level, stats, keys, 1, rng);
  if (cands.length) return build(base, level, stats, keys, cands, {});
  const part = bestPartial(base, level, stats, keys, 1, rng);
  if (part.count >= keys.length - 1 && part.segs.length) return build(base, level, stats, keys, part.segs.map((s) => ({ ...s, m: 1 })), { exact: false });
  return { unsolvable: true };
}

/**
 * Pokémon de jugadores en gimnasios. Orden de intentos (se devuelve el primero que encaja):
 *  1. sin bonus; 2. bonus ×1,30 en ATK/DEF/SP.ATK/SP.DEF; 3. bonus libre (la calidad la fijan HP y VEL).
 * exact:true solo si hay UNA solución. Si hay varias (ambiguo) o una stat no cuadra (mal leída), devuelve la mejor
 * estimación con estimated:true, el rango de calidad qMin–qMax y, si procede, ivRange por stat.
 */
function solveBonus(base, level, stats, opts = {}) {
  if (!base || !level || !stats) return null;
  const keys = KEYS.filter((k) => Number(base[k]) > 0 && Number(stats[k]) > 0);
  const hsKeys = keys.filter((k) => k === 'hp' || k === 'spe');
  const bKeys = keys.filter((k) => BONUS_KEYS.includes(k));
  if (keys.length < 4 || !hsKeys.length) return null;

  // 1) sin bonus
  const rng = rngOf(opts);
  const plain = fitAll(base, level, stats, keys, 1, rng);
  if (plain.length === 1) return build(base, level, stats, keys, plain, {});
  // 2) bonus conocido ×1,30
  const known = bKeys.length >= 3 ? fitAll(base, level, stats, keys, BONUS, rng) : [];
  if (known.length === 1) return build(base, level, stats, keys, known, {});
  if (plain.length > 1 || known.length > 1) return build(base, level, stats, keys, plain.length > 1 ? plain : known, { exact: false });
  // 3) bonus libre
  if (bKeys.length >= 3 && hsKeys.length >= 1) {
    const free = fitFreeBonus(base, level, stats, hsKeys, bKeys, rng);
    if (free.length) {
      // mismas IV en varias ventanas de m = una sola solución
      const bySig = new Map();
      for (const f of free) { const s = JSON.stringify(f.ivs); if (!bySig.has(s)) bySig.set(s, f); else { const g = bySig.get(s); g.lo = Math.min(g.lo, f.lo); g.hi = Math.max(g.hi, f.hi); } }
      return build(base, level, stats, keys, [...bySig.values()], { free: true });
    }
  }
  // 4) alguna stat no cuadra (¿mal leída?): mejor ajuste parcial con y sin bonus
  const options = [[1, bestPartial(base, level, stats, keys, 1, rng)], [BONUS, bestPartial(base, level, stats, keys, BONUS, rng)]]
    .filter(([, p]) => p.count >= Math.max(4, keys.length - 2) && p.segs.length)
    .sort((a, b) => b[1].count - a[1].count || (a[0] === BONUS ? -1 : 1));
  if (options.length) {
    const [m, p] = options[0];
    return build(base, level, stats, keys, p.segs.map((s) => ({ ...s, m })), { exact: false });
  }
  return { unsolvable: true };
}

module.exports = { solve, solveBonus, statOf, playerStatOf, rarityOf, RARITY, KEYS, BONUS, BONUS_KEYS };

};
__defs['gamedata']=function(module,exports,require){
// Poke Azul — datos públicos del juego (especies, tipos, hunts) y recomendación de hunt por tipos.
// Solo lee los mismos archivos públicos que descarga el propio juego al abrirse.
'use strict';

const fs = require('fs');
const path = require('path');

// ---------- tabla de tipos (multiplicador del atacante contra cada tipo defensor) ----------
const CHART = {
  normal: { rock: .5, ghost: 0, steel: .5 },
  fire: { fire: .5, water: .5, grass: 2, ice: 2, bug: 2, rock: .5, dragon: .5, steel: 2 },
  water: { fire: 2, water: .5, grass: .5, ground: 2, rock: 2, dragon: .5 },
  electric: { water: 2, electric: .5, grass: .5, ground: 0, flying: 2, dragon: .5 },
  grass: { fire: .5, water: 2, grass: .5, poison: .5, ground: 2, flying: .5, bug: .5, rock: 2, dragon: .5, steel: .5 },
  ice: { fire: .5, water: .5, grass: 2, ice: .5, ground: 2, flying: 2, dragon: 2, steel: .5 },
  fighting: { normal: 2, ice: 2, poison: .5, flying: .5, psychic: .5, bug: .5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: .5 },
  poison: { grass: 2, poison: .5, ground: .5, rock: .5, ghost: .5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: .5, poison: 2, flying: 0, bug: .5, rock: 2, steel: 2 },
  flying: { electric: .5, grass: 2, fighting: 2, bug: 2, rock: .5, steel: .5 },
  psychic: { fighting: 2, poison: 2, psychic: .5, dark: 0, steel: .5 },
  bug: { fire: .5, grass: 2, fighting: .5, poison: .5, flying: .5, psychic: 2, ghost: .5, dark: 2, steel: .5, fairy: .5 },
  rock: { fire: 2, ice: 2, fighting: .5, ground: .5, flying: 2, bug: 2, steel: .5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: .5 },
  dragon: { dragon: 2, steel: .5, fairy: 0 },
  dark: { fighting: .5, psychic: 2, ghost: 2, dark: .5, fairy: .5 },
  steel: { fire: .5, water: .5, electric: .5, ice: 2, rock: 2, steel: .5, fairy: 2 },
  fairy: { fire: .5, fighting: 2, poison: .5, dragon: 2, dark: 2, steel: .5 },
};
const ES = {
  fuego: 'fire', agua: 'water', electrico: 'electric', planta: 'grass', hielo: 'ice', lucha: 'fighting', veneno: 'poison',
  tierra: 'ground', volador: 'flying', psiquico: 'psychic', bicho: 'bug', roca: 'rock', fantasma: 'ghost', dragon: 'dragon',
  siniestro: 'dark', acero: 'steel', hada: 'fairy', normal: 'normal',
};
const TYPE_ES = {
  normal: 'Normal', fire: 'Fuego', water: 'Agua', electric: 'Eléctrico', grass: 'Planta', ice: 'Hielo', fighting: 'Lucha',
  poison: 'Veneno', ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho', rock: 'Roca', ghost: 'Fantasma',
  dragon: 'Dragón', dark: 'Siniestro', steel: 'Acero', fairy: 'Hada',
};
function normType(t) {
  const s = String(t == null ? '' : t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  if (CHART[s]) return s;
  return ES[s] || '';
}
// multiplicador de un tipo atacante contra un defensor de 1 o 2 tipos (×4, ×2, ×1, ×0.5, ×0.25, ×0)
function eff(atk, defTypes) {
  const row = CHART[atk];
  if (!row) return 1;
  return defTypes.reduce((m, d) => m * (row[d] != null ? row[d] : 1), 1);
}
// el mejor de los tipos del atacante (se asume que usa ataques de su tipo)
function bestEff(atkTypes, defTypes) {
  if (!atkTypes.length || !defTypes.length) return 1;
  return Math.max(...atkTypes.map((a) => eff(a, defTypes)));
}

const num = (v, d = 0) => { const n = Number(v); return Number.isFinite(n) ? n : d; };
const DAY = 24 * 3600000;

class GameData {
  /**
   * @param {string} file  dónde se guardan los datos descargados
   * @param {(url: string) => Promise<any>} fetchJson  descarga JSON con la sesión del juego
   * @param {string} baseUrl
   */
  constructor(file, fetchJson, baseUrl) {
    this.file = file;
    this.fetchJson = fetchJson;
    this.base = baseUrl.replace(/\/$/, '');
    this.species = new Map();   // id → { name, types }
    this.hunts = new Map();     // slug → { slug, name, level, spawns: Set, cfgT }
    this.items = new Map();     // id → { name, npc } (precio de venta al NPC)
    this.itemByName = new Map();
    this.loadedAt = 0;
    this.busy = false;
    this.saveTimer = null;
    this.readCache();
  }

  readCache() {
    try {
      const c = JSON.parse(fs.readFileSync(this.file, 'utf8'));
      for (const [id, s] of Object.entries(c.species || {})) this.species.set(num(id), { ...s, types: (s.types || []).filter((t) => CHART[t]), attacks: s.attacks || [] });
      for (const h of c.hunts || []) this.hunts.set(h.slug, { slug: h.slug, name: h.name, level: num(h.level), spawns: new Set((h.spawns || []).map(num)), cfgT: num(h.cfgT) });
      for (const it of c.items || []) this.addItem(it.id, it.name, it.npc);
      this.loadedAt = num(c.loadedAt);
    } catch (_) {}
  }

  save() { if (!this.saveTimer) this.saveTimer = setTimeout(() => this.saveNow(), 2000); }
  saveNow() {
    clearTimeout(this.saveTimer);
    this.saveTimer = null;
    try {
      const out = {
        loadedAt: this.loadedAt,
        species: Object.fromEntries([...this.species].map(([id, s]) => [id, s])),
        hunts: [...this.hunts.values()].map((h) => ({ slug: h.slug, name: h.name, level: h.level, spawns: [...h.spawns], cfgT: h.cfgT })),
        items: [...this.items].map(([id, it]) => ({ id, name: it.name, npc: it.npc })),
      };
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      fs.writeFileSync(this.file + '.tmp', JSON.stringify(out));
      fs.renameSync(this.file + '.tmp', this.file);
    } catch (_) {}
  }

  ready() { return this.species.size > 0 && this.hunts.size > 0; }

  addItem(id, name, npc) {
    id = num(id); if (!id) return;
    const it = { name: String(name || ''), npc: num(npc) };
    this.items.set(id, it);
    if (it.name) this.itemByName.set(it.name.toLowerCase(), it);
  }
  // precio de venta al NPC de un objeto (por id o por nombre)
  itemPrice(id, name) {
    const it = this.items.get(num(id)) || (name ? this.itemByName.get(String(name).toLowerCase()) : null);
    return it ? it.npc : 0;
  }
  async refreshItems() {
    try {
      const j = await this.fetchJson(this.base + '/game/items.json');
      const list = Array.isArray(j) ? j : (j && (j.items || j.list)) || [];
      if (!list.length) return;
      for (const it of list) if (it) this.addItem(it.id ?? it.itemId, it.name, it.npcPrice ?? it.priceNpc ?? it.sellPrice ?? it.price);
      this.save();
    } catch (e) { this.lastError = String((e && e.message) || e); }
  }

  // descarga especies y hunts (una vez al día)
  async refresh(force) {
    if (this.busy) return;
    if (!force && this.ready() && Date.now() - this.loadedAt < DAY) { if (!this.items.size && !this.busy) { this.busy = true; try { await this.refreshItems(); } finally { this.busy = false; } } return; }
    this.busy = true;
    try {
      const [cr, mk] = await Promise.all([
        this.fetchJson(this.base + '/game/creatures.json'),
        this.fetchJson(this.base + '/api/game/map-markers'),
      ]);
      const list = (cr && cr.creatures) || [];
      if (list.length) {
        this.species.clear();
        for (const c of list) {
          if (!c || c.pokeId == null) continue;
          const types = [normType(c.type1), normType(c.type2)].filter(Boolean);
          const attacks = (Array.isArray(c.attacks) ? c.attacks : [])
            .filter((a) => a && num(a.power) > 0 && normType(a.type))
            .map((a) => ({ n: String(a.name || ''), p: num(a.power), t: normType(a.type), l: num(a.learnLevel), tm: !!a.tm, c: String(a.category || '').slice(0, 10) }));
          this.species.set(num(c.pokeId), {
            name: String(c.name || ''), types: [...new Set(types)], exp: num(c.experience), hp: num(c.baseHp, 50), attacks,
            base: { hp: num(c.baseHp), atk: num(c.baseAtk), def: num(c.baseDef), spa: num(c.baseSpAtk), spd: num(c.baseSpDef), spe: num(c.baseSpeed) },
          });
        }
      }
      for (const h of (mk && mk.hunts) || []) {
        if (!h || !h.slug) continue;
        const level = num(h.level);
        if (level <= 0) continue;   // ciudades
        const old = this.hunts.get(String(h.slug));
        this.hunts.set(String(h.slug), { slug: String(h.slug), name: String(h.name || h.slug), level, spawns: old ? old.spawns : new Set(), cfgT: old ? old.cfgT : 0 });
      }
      if (this.ready()) this.loadedAt = Date.now();
      await this.refreshItems();
      this.save();
    } catch (e) {
      this.lastError = String((e && e.message) || e);
    } finally { this.busy = false; }
  }

  // qué especies salen en cada hunt: de poco en poco (una consulta cada 2 s) y se guarda 3 días
  async refreshSpawns(leaderLevels, limit = 60) {
    if (this.spawnBusy || !this.ready() || !leaderLevels.length) return;
    this.spawnBusy = true;
    try {
      const maxLevel = Math.max(...leaderLevels) + 5;
      // primero las hunts más cercanas al nivel de algún líder
      const dist = (h) => Math.min(...leaderLevels.map((l) => Math.abs(l - h.level)));
      const todo = [...this.hunts.values()]
        .filter((h) => h.level > 0 && h.level <= maxLevel && Date.now() - h.cfgT > 3 * DAY)
        .sort((a, b) => dist(a) - dist(b))
        .slice(0, limit);
      for (const h of todo) {
        try {
          const r = await this.fetchJson(this.base + '/api/game/hunt-config?slug=' + encodeURIComponent(h.slug));
          const spawns = Array.isArray(r && r.spawns) ? r.spawns : [];
          const ids = spawns.map((s) => num(s && s.pokeId)).filter(Boolean);
          if (ids.length) h.spawns = new Set(ids);
          h.cfgT = Date.now();
        } catch (_) { h.cfgT = Date.now() - 2 * DAY; }   // reintento en un día
        await new Promise((r) => setTimeout(r, 2000));
      }
      this.save();
    } finally { this.spawnBusy = false; }
  }

  // especie vista jugando en una hunt (completa los datos aunque falle la descarga)
  learn(slug, sp) {
    if (!slug || !sp) return;
    const h = this.hunts.get(slug);
    if (!h || !h.level) return;            // solo hunts que el juego ya nos ha dicho que existen
    if (!h.spawns.has(sp)) { h.spawns.add(sp); this.save(); }
  }

  // stats base de una especie por su nombre (para calcular calidad e IV)
  baseByName(name) {
    const n = String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!n) return null;
    if (!this._byName || this._byNameSize !== this.species.size) {
      this._byName = new Map();
      for (const s of this.species.values()) this._byName.set(String(s.name).toLowerCase().replace(/[^a-z0-9]/g, ''), s);
      this._byNameSize = this.species.size;
    }
    const s = this._byName.get(n);
    return s && s.base && s.base.hp ? s.base : null;
  }

  typesOf(sp) { const s = this.species.get(num(sp)); return s ? s.types : []; }
  huntName(slug) { const h = this.hunts.get(slug); return h ? h.name : slug; }

  // ataques que el líder puede usar: los de su nivel y, de los de MT, solo los de las MT que tiene de verdad
  movesOf(sp, level, tms) {
    const s = this.species.get(num(sp));
    if (!s) return [];
    const owned = (tms || []).map((x) => String(typeof x === 'object' && x ? (x.name || x.type || '') : x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
    const hasTm = (a) => owned.some((o) => o === a.t || normType(o) === a.t || o === a.n.toLowerCase());
    return (s.attacks || []).filter((a) => (a.tm ? hasTm(a) : (!a.l || !level || a.l <= level)));
  }

  // el mejor golpe contra un defensor: potencia × mismo tipo (×1.5) × efectividad
  bestHit(moves, atkTypes, defTypes) {
    let best = null;
    for (const m of moves) {
      const e = eff(m.t, defTypes);
      const dmg = m.p * (atkTypes.includes(m.t) ? 1.5 : 1) * e;
      if (!best || dmg > best.dmg) best = { dmg, eff: e, move: m.n, type: m.t };
    }
    if (!best) { // sin ataques conocidos: por sus tipos
      const e = bestEff(atkTypes, defTypes);
      best = { dmg: 60 * 1.5 * e, eff: e, move: '', type: '' };
    }
    return best;
  }

  /**
   * Hunts ordenadas para un líder según lo que de verdad le va a rendir:
   * XP que da cada especie ÷ golpes que necesita (vida de la especie frente al mejor ataque del líder).
   * @param {{sp:number, level:number, name:string}} leader
   * @param {Map<string, {xph:number, secs:number}>} measured  XP/h medida con este líder por hunt
   */
  recommend(leader, measured) {
    if (!leader || !this.ready()) return { types: [], moves: [], list: [], reason: this.ready() ? 'sin-lider' : 'sin-datos' };
    const atk = this.typesOf(leader.sp);
    const lvl = num(leader.level, 0);
    const moves = this.movesOf(leader.sp, lvl, leader.tms);
    const list = [];
    for (const h of this.hunts.values()) {
      if (!h.spawns.size) continue;
      if (lvl && h.level > lvl + 5) continue;            // demasiado alta para su nivel
      let sumEff = 0, minEff = Infinity, sumDef = 0, sumVal = 0, n = 0;
      const names = [], usedMoves = new Map();
      for (const sp of h.spawns) {
        const s = this.species.get(sp);
        if (!s || !s.types.length) continue;
        const hit = this.bestHit(moves, atk, s.types);
        sumEff += hit.eff; minEff = Math.min(minEff, hit.eff);
        sumDef += bestEff(s.types, atk);                  // lo que te pegan ellos
        sumVal += (Math.max(1, s.exp) * Math.max(0.1, hit.dmg)) / Math.max(10, s.hp);
        if (hit.move) usedMoves.set(hit.move, (usedMoves.get(hit.move) || 0) + 1);
        if (names.length < 6) names.push(s.name);
        n++;
      }
      if (!n) continue;
      const m = measured && measured.get(h.slug);
      const move = [...usedMoves.entries()].sort((a, b) => b[1] - a[1])[0];
      list.push({
        slug: h.slug, name: h.name, level: h.level, atk: sumEff / n, atkMin: minEff, def: sumDef / n,
        move: move ? move[0] : '', species: names, value: sumVal / n,
        measuredXph: m ? m.xph : 0, measuredGph: m ? m.gph || 0 : 0, measuredSecs: m ? m.secs : 0,
      });
    }
    // XP por golpe, un poco penalizada si te pegan fuerte (más tiempo curándote)
    for (const r of list) r.score = r.value / Math.sqrt(Math.max(0.25, r.def));
    list.sort((a, b) => b.score - a.score);
    const top = list.length ? list[0].score : 1;
    for (const r of list) r.pct = Math.round((r.score / top) * 100);
    return {
      types: atk.map((t) => TYPE_ES[t] || t),
      moves: moves.map((m) => `${m.n} (${TYPE_ES[m.t] || m.t}, ${m.p}${m.tm ? ', MT' : ''})`),
      list: list.slice(0, 15), all: list, reason: list.length ? '' : 'sin-hunts',
    };
  }
}

module.exports = { GameData, eff, bestEff, normType, TYPE_ES };

};
__defs['battle']=function(module,exports,require){
// Poke Azul — simulador de combate de gimnasio (estimación).
// Fórmula clásica de Pokémon: daño = ((2·Nv/5 + 2) · Potencia · Atq/Def / 50 + 2) × mismo tipo (1,5) × efectividad × azar (0,85–1) × crítico (1,5; 6,25 %).
// Combate 1 contra 1 por orden: el más rápido golpea primero; cada uno usa su mejor ataque contra el rival que tiene delante.
// Al caer uno, entra el siguiente de su equipo con la vida que le quede. Gana quien deje sin pokémon al otro.
'use strict';
const { eff, normType } = require('./gamedata');

const PHYS = /^(f|ph|fis|fís)/i;
function catOf(c) { const s = String(c || ''); if (!s) return ''; return PHYS.test(s) ? 'P' : /^(e|sp|esp)/i.test(s) ? 'S' : ''; }

function rngFrom(seed) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

// mejor ataque de A contra D (daño esperado), con su categoría
function bestMove(A, D) {
  let best = null;
  const dTypes = D.types;
  for (const m of A.moves) {
    if (!m.p) continue;
    const e = eff(m.t, dTypes);
    const stab = A.types.includes(m.t) ? 1.5 : 1;
    let c = m.c;
    if (!c) c = A.stats.atk >= A.stats.spa ? 'P' : 'S';   // sin categoría conocida: la de su mejor stat
    const ad = c === 'P' ? A.stats.atk / Math.max(1, D.stats.def) : A.stats.spa / Math.max(1, D.stats.spd);
    const score = m.p * stab * e * ad;
    if (!best || score > best.score) best = { m, e, stab, c, ad, score };
  }
  if (!best) { // sin ataques: golpe de 60 de su primer tipo
    const t = A.types[0] || 'normal';
    const c = A.stats.atk >= A.stats.spa ? 'P' : 'S';
    const ad = c === 'P' ? A.stats.atk / Math.max(1, D.stats.def) : A.stats.spa / Math.max(1, D.stats.spd);
    best = { m: { n: 'Placaje', t, p: 60 }, e: eff(t, dTypes), stab: 1.5, c, ad, score: 0 };
  }
  return best;
}

function hit(A, D, rnd, hpScale) {
  const b = bestMove(A, D);
  if (b.e === 0) return { dmg: 0, move: b.m.n, eff: 0, crit: false };
  const crit = rnd() < 0.0625;
  const base = ((2 * A.level) / 5 + 2) * b.m.p * b.ad / 50 + 2;
  // baya del defensor: reduce el daño de los golpes de su tipo (p. ej. Babiri Berry: −5 % a los de tipo Acero)
  const berry = D.berry && D.berry.t === b.m.t ? 1 - (D.berry.r || 0) : 1;
  const dmg = Math.max(1, Math.floor(base * b.stab * b.e * (0.85 + rnd() * 0.15) * (crit ? 1.5 : 1) * hpScale * berry));
  return { dmg, move: b.m.n, eff: b.e, crit, berry: berry < 1 };
}

/**
 * @param mine   pokémon tuyos (en el orden que se quiera; se barajan si shuffleMine)
 * @param theirs pokémon del gimnasio
 * mon = { name, sp, level, types:[...], hp (vida de combate), stats:{atk,def,spa,spd,spe}, moves:[{n,t,p,c}], shiny }
 */
function simulate(mine, theirs, n = 5, opts = {}) {
  const N = Math.max(1, Math.min(10, Math.floor(n) || 1));
  const rnd = rngFrom(opts.seed || Date.now());
  const hpScale = opts.hpScale || 12;   // la vida de combate del juego es 12 × la stat HP
  const prep = (m) => ({ ...m, types: (m.types || []).map(normType).filter(Boolean), moves: (m.moves || []).map((x) => ({ n: x.n || x.name, t: normType(x.t || x.type), p: Number(x.p ?? x.power) || 0, c: catOf(x.c ?? x.cat ?? x.category) })) });
  const A0 = mine.map(prep), B0 = theirs.map(prep);
  const battles = [];
  for (let k = 0; k < N; k++) {
    const A = A0.map((m) => ({ ...m, cur: m.hp }));
    const B = B0.map((m) => ({ ...m, cur: m.hp }));
    if (opts.shuffleMine !== false) for (let i = A.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [A[i], A[j]] = [A[j], A[i]]; }
    if (opts.shuffleTheirs) for (let i = B.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [B[i], B[j]] = [B[j], B[i]]; }
    const order = A.map((m) => m.name), orderTheirs = B.map((m) => m.name);
    const log = [];
    let ia = 0, ib = 0, turns = 0, dmgA = 0, dmgB = 0;
    while (ia < A.length && ib < B.length && turns < 5000) {
      const a = A[ia], b = B[ib];
      let t = 0;
      const startA = a.cur, startB = b.cur;
      while (a.cur > 0 && b.cur > 0 && t < 400) {
        t++; turns++;
        const aFirst = a.stats.spe > b.stats.spe || (a.stats.spe === b.stats.spe && rnd() < 0.5);
        const [x, y] = aFirst ? [a, b] : [b, a];
        const h1 = hit(x, y, rnd, hpScale); y.cur -= h1.dmg; if (x === a) dmgA += h1.dmg; else dmgB += h1.dmg;
        if (y.cur <= 0) break;
        const h2 = hit(y, x, rnd, hpScale); x.cur -= h2.dmg; if (y === a) dmgA += h2.dmg; else dmgB += h2.dmg;
      }
      const ma = bestMove(a, b), mb = bestMove(b, a);
      if (b.cur <= 0) {
        log.push({ win: 'mine', w: a.name, l: b.name, turns: t, hpLeft: Math.max(0, Math.round((a.cur / a.hp) * 100)), moveW: ma.m.n, effW: ma.e, moveL: mb.m.n, effL: mb.e, wSp: a.sp, lSp: b.sp });
        b.cur = 0; ib++;
      } else if (a.cur <= 0) {
        log.push({ win: 'theirs', w: b.name, l: a.name, turns: t, hpLeft: Math.max(0, Math.round((b.cur / b.hp) * 100)), moveW: mb.m.n, effW: mb.e, moveL: ma.m.n, effL: ma.e, wSp: b.sp, lSp: a.sp });
        a.cur = 0; ia++;
      } else { // empate por tiempo: pierde quien tenga menos % de vida
        if (a.cur / a.hp >= b.cur / b.hp) { b.cur = 0; ib++; } else { a.cur = 0; ia++; }
      }
      void startA; void startB;
    }
    const won = ib >= B.length;
    battles.push({
      won, order, orderTheirs, log, turns,
      mineLeft: A.filter((m) => m.cur > 0).map((m) => ({ name: m.name, sp: m.sp, pct: Math.round((m.cur / m.hp) * 100) })),
      theirsLeft: B.filter((m) => m.cur > 0).map((m) => ({ name: m.name, sp: m.sp, pct: Math.round((m.cur / m.hp) * 100) })),
    });
  }
  // quién rinde mejor y quién es el problema
  const kills = {}, deaths = {}, theirKills = {};
  for (const bt of battles) for (const e of bt.log) {
    if (e.win === 'mine') kills[e.w] = (kills[e.w] || 0) + 1; else { deaths[e.l] = (deaths[e.l] || 0) + 1; theirKills[e.w] = (theirKills[e.w] || 0) + 1; }
  }
  const top = (o) => Object.entries(o).sort((x, y) => y[1] - x[1])[0] || null;
  return { n: N, wins: battles.filter((b) => b.won).length, battles, mvp: top(kills), weak: top(deaths), threat: top(theirKills) };
}

// bayas que reducen el daño de un tipo (nombre del juego → tipo)
const BERRIES = { Chilan: 'normal', Occa: 'fire', Passho: 'water', Wacan: 'electric', Rindo: 'grass', Yache: 'ice', Chople: 'fighting', Kebia: 'poison', Shuca: 'ground', Coba: 'flying', Payapa: 'psychic', Tanga: 'bug', Charti: 'rock', Kasib: 'ghost', Haban: 'dragon', Colbur: 'dark', Babiri: 'steel', Roseli: 'fairy' };
module.exports = { simulate, bestMove, BERRIES };

};
__defs['gyms']=function(module,exports,require){
// Poke Azul — gimnasios: guarda lo que el juego manda al abrir su ventana de gimnasios
// y lo ordena (gimnasio → pokémon con nivel, vida, tipos, stats, IV si vienen y golpes).
'use strict';

const fs = require('fs');
const { BUILTIN } = require('./gyms-data');
const { rarityOf } = require('./ivcalc');
const path = require('path');

const GYM_HINT = /gym|gin[aá]sio|gimnas|badge|insign|leadership|lideranc/i;

const pick = (o, keys) => { for (const k of keys) if (o && o[k] != null && o[k] !== '') return o[k]; return undefined; };
const numOr = (v) => { const n = Number(v); return Number.isFinite(n) ? n : null; };
const STAT_KEYS = {
  atk: ['atk', 'attack', 'Attack', 'ATK'],
  def: ['def', 'defense', 'defence', 'Defense', 'DEF'],
  spa: ['spAtk', 'spatk', 'sp_atk', 'spa', 'specialAttack', 'spAttack', 'SPATK'],
  spd: ['spDef', 'spdef', 'sp_def', 'spd', 'specialDefense', 'spDefense', 'SPDEF'],
  spe: ['speed', 'spe', 'vel', 'Speed', 'SPEED'],
};
const HP_KEYS = ['maxHp', 'hpMax', 'max_hp', 'hp', 'HP'];

// stats.hp = la stat HP de verdad; la ♥ del gimnasio (vida de combate = 12 × HP) va aparte en battleHpOf
function statsOf(o) {
  const nested = [o && o.stats, o && o.stat, o && o.currentStats, o && o.computedStats].filter((x) => x && typeof x === 'object');
  const srcs = [o, ...nested];
  const out = {};
  for (const [k, keys] of Object.entries(STAT_KEYS)) {
    for (const s of srcs) { const v = numOr(pick(s, keys)); if (v != null) { out[k] = v; break; } }
  }
  for (const s of nested) { const v = numOr(pick(s, ['hp', 'HP'])); if (v != null) { out.hp = v; break; } }
  if (out.hp == null) {
    const b = battleHpOf(o);
    if (b != null && b % 12 === 0) out.hp = b / 12;
  }
  return out;
}
function battleHpOf(o) {
  for (const s of [o, o && o.stats].filter((x) => x && typeof x === 'object')) { const v = numOr(pick(s, ['maxHp', 'hpMax', 'max_hp'])); if (v != null) return v; }
  return null;
}

// nombres posibles de cada IV cuando vienen sueltos (ivHp, hpIv, iv_atk…)
const FLAT_IV = {
  hp: ['ivHp', 'ivHP', 'iv_hp', 'hpIv', 'hpIV', 'hp_iv', 'IVHp'],
  atk: ['ivAtk', 'ivAttack', 'iv_atk', 'atkIv', 'atkIV', 'atk_iv'],
  def: ['ivDef', 'ivDefense', 'iv_def', 'defIv', 'defIV', 'def_iv'],
  spa: ['ivSpAtk', 'ivSpa', 'ivSpecialAttack', 'iv_spatk', 'iv_sp_atk', 'spAtkIv', 'spaIv', 'spatk_iv'],
  spd: ['ivSpDef', 'ivSpd', 'ivSpecialDefense', 'iv_spdef', 'iv_sp_def', 'spDefIv', 'spdIv', 'spdef_iv'],
  spe: ['ivSpeed', 'ivSpe', 'iv_speed', 'speedIv', 'speIv', 'speed_iv'],
};

function ivsOf(o) {
  const src = (o && (o.ivs || o.iv || o.IVs)) || null;
  if (src && typeof src === 'object') {
    const out = {};
    const map = { hp: ['hp', 'HP', 'maxHp'], ...STAT_KEYS };
    for (const [k, keys] of Object.entries(map)) { const v = numOr(pick(src, keys)); if (v != null) out[k] = v; }
    if (Object.keys(out).length) { out.total = Object.values(out).reduce((a, b) => a + b, 0); return out; }
  }
  // IV sueltos en el propio objeto (ivHp, ivAtk…)
  const flat = {};
  for (const [k, keys] of Object.entries(FLAT_IV)) { const v = numOr(pick(o || {}, keys)); if (v != null) flat[k] = v; }
  if (Object.keys(flat).length) { flat.total = Object.values(flat).reduce((a, b) => a + b, 0); return flat; }
  const tot = numOr(pick(o || {}, ['ivTotal', 'iv_total', 'totalIv']));
  if (tot != null) return { total: tot };
  if (typeof (o && o.ivTotal) === 'string') { const m = o.ivTotal.match(/\d+/); if (m) return { total: +m[0] }; }
  return null;
}

// calidad (multiplicador) y rareza si el juego las manda; si vienen, valen más que lo calculado
const RARITY_ES = { common: 'Común', comum: 'Común', uncommon: 'Poco común', incomum: 'Poco común', rare: 'Rara', raro: 'Rara', epic: 'Épica', epico: 'Épica',
  legendary: 'Legendaria', legendario: 'Legendaria', mythic: 'Mítica', mitico: 'Mítica', ancient: 'Anciana', antigo: 'Anciana', divine: 'Divina', divino: 'Divina', weak: 'Débil', fraco: 'Débil' };
function qualityOf(o) {
  let v = pick(o || {}, ['quality', 'qualityMultiplier', 'quality_multiplier', 'qualityMult', 'qMultiplier', 'qualityValue']);
  if (v && typeof v === 'object') v = pick(v, ['multiplier', 'mult', 'value', 'q']);
  const q = numOr(v);
  return q != null && q > 0 ? q : null;
}
function rarityName(o, q) {
  let r = pick(o || {}, ['rarity', 'tier', 'qualityName', 'qualityTier', 'qualityLabel']);
  if (r && typeof r === 'object') r = pick(r, ['name', 'label']);
  if (typeof r !== 'string' && o && typeof o.quality === 'string') r = o.quality;   // a veces la calidad llega como nombre de rareza
  if (typeof r === 'string' && r) {
    const k = r.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    return RARITY_ES[k] || r;
  }
  return q != null ? rarityOf(q) : null;
}

function typesOf(o) {
  const t = [];
  for (const k of ['type1', 'type2', 'type', 'primaryType', 'secondaryType']) {
    const v = o && o[k];
    if (typeof v === 'string' && v) t.push(v.toUpperCase());
  }
  if (Array.isArray(o && o.types)) for (const v of o.types) { const s = typeof v === 'string' ? v : v && (v.name || v.type); if (s) t.push(String(s).toUpperCase()); }
  return [...new Set(t)];
}

function nameOf(o) {
  const n = pick(o, ['name', 'speciesName', 'pokeName', 'pokemonName', 'nickname']);
  if (typeof n === 'string') return n;
  for (const k of ['species', 'pokemon', 'creature']) {
    const s = o && o[k];
    if (s && typeof s === 'object' && typeof s.name === 'string') return s.name;
  }
  return '';
}

function movesOf(o) {
  const arr = pick(o, ['moves', 'attacks', 'moveList', 'skills']);
  if (!Array.isArray(arr)) return [];
  return arr.filter((m) => m && typeof m === 'object').slice(0, 8).map((m) => ({
    name: String(pick(m, ['name', 'moveName', 'title']) || ''),
    type: String(pick(m, ['type', 'element']) || '').toUpperCase(),
    power: numOr(pick(m, ['power', 'basePower', 'damage'])),
    cat: String(pick(m, ['category', 'kind', 'class']) || ''),
  })).filter((m) => m.name);
}

// ¿parece un pokémon con stats?
function isMon(o) {
  if (!o || typeof o !== 'object' || Array.isArray(o) || !nameOf(o)) return false;
  return Object.keys(statsOf(o)).filter((k) => k !== 'hp').length >= 2 || (numOr(o.level) != null && (Array.isArray(o.moves) || Array.isArray(o.attacks)));
}

// Objetos equipados: solamente campos explícitos del Pokémon del gimnasio.
// No inferir un objeto por sus estadísticas ni confundirlo con inventario.
function heldOf(o) {
  if (!o || typeof o !== 'object') return { status: 'unknown' };
  const keys = ['heldItem', 'held_item', 'equippedItem', 'equipped_item', 'held', 'heldItemData', 'held_item_data'];
  let found = false, raw;
  for (const k of keys) if (Object.prototype.hasOwnProperty.call(o, k)) { raw = o[k]; found = true; break; }
  if (!found && o.equipment && typeof o.equipment === 'object') {
    for (const k of ['heldItem', 'held_item', 'held']) if (Object.prototype.hasOwnProperty.call(o.equipment, k)) { raw = o.equipment[k]; found = true; break; }
  }
  if (!found) return { status: 'unknown' };
  if (raw == null || raw === false || raw === '' || raw === 0) return { status: 'none' };
  if (typeof raw === 'string') return { status: 'equipped', name: raw.trim() || null, level: null };
  if (typeof raw === 'number') return { status: 'equipped', name: null, id: raw, level: null };
  if (typeof raw !== 'object' || Array.isArray(raw)) return { status: 'unknown' };
  const name = pick(raw, ['name', 'itemName', 'displayName', 'title', 'label']);
  const level = numOr(pick(raw, ['level', 'tier', 'rank', 'grade']));
  const id = pick(raw, ['id', 'itemId', 'item_id']);
  const icon = pick(raw, ['icon', 'iconUrl', 'image', 'imageUrl', 'sprite']);
  return { status: 'equipped', name: typeof name === 'string' ? name : null, id: id ?? null,
    level: level != null && level >= 1 && level <= 8 ? level : null,
    icon: typeof icon === 'string' && /^https:\/\//i.test(icon) ? icon : null };
}

function monOf(o) {
  const quality = qualityOf(o);
  return {
    name: nameOf(o),
    level: numOr(pick(o, ['level', 'lvl', 'nivel'])),
    shiny: !!o.shiny,
    types: typesOf(o.species && typeof o.species === 'object' ? { ...o.species, ...o } : o),
    stats: statsOf(o),
    battleHp: battleHpOf(o),
    ivs: ivsOf(o),
    quality,
    rarity: rarityName(o, quality),
    moves: movesOf(o),
    heldItem: heldOf(o),
  };
}

function gymInfo(o) {
  const leader = o.leader;
  // quién lo tiene ahora: "defender" (detalle) u "holder" (lista); si no viene, el líder NPC
  const d = (o.defender && typeof o.defender === 'object' && o.defender) || (o.holder && typeof o.holder === 'object' && o.holder) || null;
  const npcLeader = String((leader && typeof leader === 'object' ? (leader.name || leader.username) : leader) || pick(o, ['leaderName', 'trainer']) || '');
  const isNpc = d ? d.isNpc === true : ('holder' in o || 'defender' in o ? true : null);
  return {
    name: String(pick(o, ['name', 'gymName', 'title', 'city', 'cityName', 'slug', 'id']) || ''),
    city: String(pick(o, ['city', 'cityName', 'slug']) || ''),
    leader: String((d && d.name) || npcLeader || ''),
    npcLeader,
    isNpc,
    since: d && d.sinceAt ? Date.parse(d.sinceAt) || null : null,
    defenses: d ? numOr(d.defenses) : null,
    type: String(pick(o, ['type', 'gymType', 'element']) || '').toUpperCase(),
    region: String(pick(o, ['region', 'area']) || ''),
    order: numOr(pick(o, ['order', 'index', 'number', 'position'])),
  };
}

// recorre el JSON: cada lista de pokémon con stats se asigna al objeto "gimnasio" más cercano que la contiene
function parse(json, fallbackName) {
  const gyms = [];
  const seen = new Set();
  (function walk(node, parents) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      const mons = node.filter(isMon);
      if (mons.length && mons.length >= node.length / 2) {
        const owner = [...parents].reverse().find((p) => p && !Array.isArray(p) && (p.name || p.city || p.leader || p.slug || p.gymName)) || {};
        if (!seen.has(owner)) {
          seen.add(owner);
          const g = gymInfo(owner);
          if (!g.name && !g.city && !g.leader) return;   // una lista de pokémon sin gimnasio (p. ej. tu equipo): se ignora
          if (!g.name) g.name = fallbackName || 'Gimnasio';
          g.team = mons.map(monOf);
          gyms.push(g);
        }
        return;
      }
      for (const x of node) walk(x, parents.concat([node]));
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (/^npc/i.test(k) && Array.isArray(node.team)) continue;   // el equipo NPC de las medallas ya lo tenemos; aquí solo el actual
      if (v && typeof v === 'object') walk(v, parents.concat([node]));
    }
  })(json, []);
  return gyms;
}

// "Pewter City", "pewter-city", "Ginásio de Pewter" → "pewter"
function gymKey(s) {
  let k = String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  k = k.replace(/gin[aá]sio de|gimnasio de|gym|city|ciudad|cidade/g, '').replace(/[^a-z0-9]+/g, '');
  const hit = BUILTIN.find((b) => k === b.city || k.startsWith(b.city) || b.city.startsWith(k));
  return hit && k ? hit.city : k;
}

class Gyms {
  constructor(dir) {
    this.dir = dir;
    this.file = path.join(dir, 'gimnasios.json');
    this.gyms = {};          // clave → gimnasio
    this.updated = 0;
    try { const d = JSON.parse(fs.readFileSync(this.file, 'utf8')); this.gyms = d.gyms || {}; this.updated = d.updated || 0; } catch (_) {}
    // datos guardados por la versión anterior (sin dueño ni HP real): se descartan y se vuelven a leer del juego
    for (const [k, g] of Object.entries(this.gyms)) {
      if (!g || !('isNpc' in g) || (g.team || []).some((m) => !('battleHp' in m))) delete this.gyms[k];
    }
  }

  static looksLikeGym(label) { return GYM_HINT.test(String(label || '')); }

  // un mensaje del juego (WebSocket) o respuesta (HTTP) que parece de gimnasios
  ingest(label, json) {
    let changed = 0;
    for (const g of parse(json, label)) {
      const key = gymKey(g.city || g.name);
      if (!key) continue;
      const prev = this.gyms[key] || {};
      // si cambia el dueño, el equipo guardado ya no vale
      const team = g.team || (prev.leader === g.leader ? prev.team : undefined);
      this.gyms[key] = { ...prev, ...g, team, city: key, t: Date.now() };
      changed++;
    }
    // muestra original (una por tipo de mensaje y minuto), para poder mejorar la lectura si el formato es raro
    const safe = String(label).replace(/[^a-z0-9_-]+/gi, '_').slice(0, 60) || 'muestra';
    this.sampleT = this.sampleT || {};
    if (Date.now() - (this.sampleT[safe] || 0) > 60000) {
      this.sampleT[safe] = Date.now();
      try {
        fs.mkdirSync(path.join(this.dir, 'muestras'), { recursive: true });
        fs.writeFileSync(path.join(this.dir, 'muestras', safe + '.json'), JSON.stringify(json).slice(0, 2000000));
      } catch (_) {}
    }
    if (changed) {
      this.updated = Date.now();
      if (!this.saveTimer) this.saveTimer = setTimeout(() => this.saveNow(), 2000);
    }
    return changed;
  }

  saveNow() {
    clearTimeout(this.saveTimer);
    this.saveTimer = null;
    try {
      fs.mkdirSync(this.dir, { recursive: true });
      fs.writeFileSync(this.file + '.tmp', JSON.stringify({ gyms: this.gyms, updated: this.updated }));
      fs.renameSync(this.file + '.tmp', this.file);
    } catch (_) {}
  }

  // los 18 gimnasios: el equipo NPC (de las capturas) y, si el juego lo ha mandado, lo último que se vio en el juego
  list() {
    const out = BUILTIN.map((b) => {
      const live = this.gyms[b.city];
      return { ...b, npcTeam: b.team, live: live ? { leader: live.leader, isNpc: live.isNpc, since: live.since, defenses: live.defenses, team: live.team, t: live.t } : null };
    });
    for (const [k, g] of Object.entries(this.gyms)) {
      if (!BUILTIN.some((b) => b.city === k)) out.push({ ...g, npcTeam: [], live: { leader: g.leader, isNpc: g.isNpc, since: g.since, defenses: g.defenses, team: g.team, t: g.t }, order: g.order ?? 99 });
    }
    return out.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }
}

module.exports = { Gyms, parse, gymKey };

};
__defs['conquest']=function(module,exports,require){
// Poke Azul — "conquistas de las 10:00 (Brasil)": quién tenía cada gimnasio justo antes del reparto de recompensas.
// Entre las 09:55 y las 10:00 (hora de Brasil) se miran los gimnasios cada 10 s y se guarda el ÚLTIMO estado antes de las 10:00 (Brasil).
// Al empezar el guardado de un día nuevo, el de hoy pasa a "ayer" y el de anteayer se borra.
const fs = require('fs'), path = require('path');

const START = 9 * 60 + 55, END = 10 * 60;   // minutos del día, hora de São Paulo

/** hora de Brasil (America/Sao_Paulo) sin depender de la zona horaria del PC */
function brasil(t = Date.now()) {
  const p = {};
  for (const x of new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(t))) p[x.type] = x.value;
  const h = Number(p.hour), m = Number(p.minute), s = Number(p.second);
  return { date: `${p.year}-${p.month}-${p.day}`, h, m, s, min: h * 60 + m, sec: h * 3600 + m * 60 + s };
}
const inWindow = (t) => { const z = brasil(t); return z.min >= START && z.min < END; };

class Conquests {
  constructor(dir) {
    this.file = path.join(dir, 'conquistas.json');
    this.d = { today: null, yesterday: null };
    try { const j = JSON.parse(fs.readFileSync(this.file, 'utf8')); if (j && typeof j === 'object') this.d = { today: j.today || null, yesterday: j.yesterday || null }; } catch (_) {}
  }
  save() {
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      fs.writeFileSync(this.file + '.tmp', JSON.stringify(this.d));
      fs.renameSync(this.file + '.tmp', this.file);
    } catch (_) {}
  }
  /** al empezar la ventana de un día nuevo: hoy → ayer, y se empieza el nuevo vacío */
  startDay(date) {
    if (this.d.today && this.d.today.date === date) return false;
    if (this.d.today && this.d.today.gyms) this.d.yesterday = this.d.today;
    this.d.today = { date, gyms: null, at: 0, first: 0, checks: 0 };
    this.save();
    return true;
  }
  /**
   * guarda una foto de los gimnasios tomados por jugadores (solo si se pidió antes de las 10:00 (Brasil))
   * @param {number} askedAt cuándo se pidió la lista al juego
   * @param {object[]} list gimnasios (gymList)
   */
  capture(askedAt, list, doneAt = Date.now()) {
    if (!inWindow(askedAt)) return false;
    const z = brasil(askedAt);
    this.startDay(z.date);
    const T = this.d.today;
    if (askedAt < T.at) return false;              // una respuesta más vieja que la guardada no la pisa
    if (!inWindow(doneAt) && T.gyms) return false;  // llegó ya pasadas las 10:00 (Brasil): puede ser del reparto, nos quedamos con la anterior
    T.gyms = (list || []).filter((g) => g && g.live && g.live.isNpc === false && g.live.leader).map((g) => ({
      city: g.city, name: g.name, type: g.type, order: g.order, region: g.region,
      leader: g.live.leader, since: g.live.since, defenses: g.live.defenses, team: g.live.team || [],
    }));
    T.total = (list || []).length;
    T.at = askedAt; T.first = T.first || askedAt; T.checks = (T.checks || 0) + 1;
    this.save();
    return true;
  }
  get() { const z = brasil(); return { ...this.d, now: z, window: { start: '09:55', end: '10:00' }, active: z.min >= START && z.min < END }; }
}

module.exports = { Conquests, brasil, inWindow, START, END };

};
window.PA_LIB={ivcalc:require('ivcalc'),gamedata:require('gamedata'),battle:require('battle'),gyms:require('gyms'),conquest:require('conquest')};
})();