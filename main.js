$(() => {
  $('.encode-moves').on('click', handleEncodeMoves);
});

function handleEncodeMoves(event) {
  let moveText = $('.new-moves').val();
  $('.new-moves').val('')

  let [moves, mnemonics] = encodeMoves(moveText);
  const $newEntry = getNewEntry(moves, mnemonics);
  renderEntry($newEntry, mnemonics);
}

function renderEntry(newEntryEl, mnemonics) {
  let renderType = $('input:checked').val();
  if (!renderType) return;
  mnemonics.forEach(([source, person, object], i) => {
    const $nextResult = newEntryEl.find(`.template-move.${renderType}`).clone();
    $nextResult
      .removeClass('template-move')
      .removeClass('hidden')
    if (renderType === 'verbose') {
      $nextResult.find('.move-person').text(person);
      $nextResult.find('.move-object').text(object);
      $nextResult.find('.move-source').text(source);
    }
    if (renderType === 'concise') {
      $nextResult.find('.move-info').text(`${person}, ${object}`)
    }
    if (renderType === 'no-moves') {
      $nextResult.find('.move-person').text(person);
      $nextResult.find('.move-object').text(object);
    }
    newEntryEl.find('.append-results--move').append($nextResult)
  });
  if ($('div.append-here').children().length) {
    newEntryEl.insertBefore('.append-here > .posts-body:first');
  } else {
    $('div.append-here').append(newEntryEl);
  }
}

function getNewEntry(moves) {
  let entryName = $('.entry-name').val();
  $('.entry-name').val('')
  let $newEntry = $('div.template').clone();

  $newEntry
    .removeClass('template')
    .addClass('new-post')
    .attr('id', Date.now());
  $newEntry
    .find('.template-name')
    .removeClass('template-name')
    .addClass('new-entry')
    .text(entryName)
  $newEntry
    .find('.move-list')
    .text(moves)

  return $newEntry;
}

function encodeMoves(data) {
  const results = data.match(/([0-9]+.)|([O-O-O]+)|([RNBQK]?)([abcdefgh]+)([0-8])([+])|([RNBQK]?)([abcdefghx]+)([0-8])|([RNBQK])([0-8])([abcdefgh])([0-8])/gm);
  const moveList = results.reduce((map, r) => {
    if (r.includes('.')) { // is move number
      const [moveNum] = r.match(/[0-9]/gi);
      map.push([]);
    } else {
      const lastResult = map[map.length - 1];
      if (Array.isArray(lastResult)) {
        lastResult.push(r);
      }
    }
    return map;
  }, []);
  const mappedMoves = moveList.map((moves, i) => {
    const [white, black] = moves;
    let [result1, result2] = ['', ''];
    if (white) {
      result1 = parseMove({ turn: 'white', move: white })
    }
    if (black) {
      result2 = parseMove({ turn: 'black', move: black });
    }
    return [`${i + 1}.${white} ${black}`, result1, result2]
  });
  return [data, mappedMoves];
}

/**
 * @function parseMove
 * - Maps a move to it's corresponding mnemonic property.
 * - First cleans the move of annotation artifacts by way of detecting edge cases.
 * - Second parses the move to it's corresponding mnemonic map notation.
 * - Third returns a sentence from the mnemonic map tree as a result.
 * @param {string} turn - denotes which mnemonic (character or object) we should return
 * @param {string} move - the actual chess move
 */
function parseMove(info) {
  if (info.move.includes('+')) {
    return handleCheckMove(info);
  }
  if (info.move.includes('O-O')) {
    return handleCastleMove(info);
  }
  if (info.move.includes('x')) {
    return handleCaptureMove(info);
  }
  if (info.move.includes('=')) {
    return handlePawnPromotion(info);
  }
  if (info.move.length >= 4) {
    return handleTwoOptionMove(info);
  }
  return handleNormalMove(info);
}

function handleCheckMove(info) {
  let [
    piece,
    square,
    story,
  ] = [, , info.turn === 'white' ? 'c' : 'o'];
  if (majorPieces.includes(info.move[0])) {
    piece = info.move[0];
    square = info.move.slice(1, info.move.length - 1);
  } else {
    piece = 'P';
    square = info.move.slice(0, info.move.length - 1)
  }
  return MoveMap[square][piece][story];
}

function handleCastleMove(info) {
  let getters = [];
  if (info.move === 'O-O-O') {
    if (info.turn === 'white') {
      getters = ['c1', 'K', 'c'];
    } else {
      getters = ['c8', 'K', 'o'];
    }
  } else {
    if (info.turn === 'white') {
      getters = ['g1', 'K', 'c'];
    } else {
      getters = ['g8', 'K', 'o'];
    }
  }
  const [square, piece, story] = getters;
  return MoveMap[square][piece][story];
}

function handleCaptureMove(info) {
  const [source, destination] = info.move.split('x');
  const [
    piece, square, story,
  ] = [
      majorPieces.includes(source) ? source : 'P',
      destination,
      info.turn === 'white' ? 'c' : 'o'
    ];
  return MoveMap[square][piece][story];
}

function handlePawnPromotion(info) {
  const [
    [destination], piece, story,
  ] = [
      info.move.split('='),
      'P',
      info.turn === 'white' ? 'c' : 'o'
    ];
  return moveMap[destination, piece, story];
}

function handleTwoOptionMove(info) {
  const [
    piece, square, story,
  ] = [
      majorPieces.includes(info.move[0]) ? info.move[0] : 'P',
      info.move.slice(2),
      info.turn === 'white' ? 'c' : 'o'
    ];
  return MoveMap[square][piece][story];
}

function handleNormalMove(info) {
  let [
    piece, square, story
  ] = [, , info.turn === 'white' ? 'c' : 'o'];
  if (majorPieces.includes(info.move[0])) {
    piece = info.move[0];
    square = info.move.slice(1);
  } else {
    piece = 'P';
    square = info.move;
  }
  return MoveMap[square][piece][story];
}

var majorPieces = ['K', 'Q', 'R', 'N', 'B'];

var MoveMap = {
  a1: {
    P: {
      c: 'Cookie Monster',
      o: 'Trash Can',
    },
    R: {
      c: 'Sean Connery',
      o: 'Cigarette & Zippo'
    },
    N: {
      c: 'Katsumoto',
      o: 'Black Samurai Armor'
    },
    B: {
      c: 'Iron Man',
      o: 'Blow Torch'
    },
    Q: {
      c: 'Neo',
      o: 'White Rabbit'
    },
    K: {
      c: 'Tom Brady',
      o: 'Lombardi Trophy'
    }
  },
  a2: {
    P: {
      c: 'Burt',
      o: 'Banana',
    },
    R: {
      c: 'Daniel Craig',
      o: 'Difibulator'
    },
    N: {
      c: 'Nathan',
      o: 'Red Samurai Armor'
    },
    B: {
      c: 'James Rhodes',
      o: 'Shoulder Mounted Mini-Gun'
    },
    Q: {
      c: 'Trinity',
      o: 'Red Black Leotard'
    },
    K: {
      c: 'Brett Favre',
      o: 'Cheese Head'
    }
  },
  a3: {
    P: {
      c: 'Ernie',
      o: 'Large Orange',
    },
    R: {
      c: 'Pierce Brosnon',
      o: 'Tank'
    },
    N: {
      c: 'Ujio',
      o: 'Wooden Sparring Sword'
    },
    B: {
      c: 'Nick Fury',
      o: 'Black Eye Patch'
    },
    Q: {
      c: 'Morpheus',
      o: 'Red Leather Chair'
    },
    K: {
      c: 'Peyton Manning',
      o: 'Colts Helmet'
    }
  },
  a4: {
    P: {
      c: 'Big Bird',
      o: 'Bird Cage',
    },
    R: {
      c: 'Timothy Dalton',
      o: 'Skis'
    },
    N: {
      c: 'Omura',
      o: 'Old Mini Gun'
    },
    B: {
      c: 'Howard Stark',
      o: 'World Fair Globe'
    },
    Q: {
      c: 'Oracle',
      o: 'Chocolate Chip Cookies'
    },
    K: {
      c: 'Ben Roethlisberger',
      o: 'Steelers Helmet'
    }
  },
  a5: {
    P: {
      c: 'The Count',
      o: 'Blood Packs',
    },
    R: {
      c: 'M, Judi Dench',
      o: 'Office Desk'
    },
    N: {
      c: 'Emporer Meiji',
      o: 'White Gloves'
    },
    B: {
      c: 'Obadiah Stane',
      o: 'Silver Armor'
    },
    Q: {
      c: 'Agent Smith',
      o: 'Tuxedo & talking into wrist'
    },
    K: {
      c: 'Dan Marino',
      o: 'Dolphins Helmet'
    }
  },
  a6: {
    P: {
      c: 'Calvin',
      o: 'Red Wagon',
    },
    R: {
      c: 'Le Chiffre',
      o: 'Wrope & Ball'
    },
    N: {
      c: 'Colonel Bagley',
      o: 'Civil War Hat'
    },
    B: {
      c: 'Ivan Vanko',
      o: 'Electrical Whip'
    },
    Q: {
      c: 'Naiobi',
      o: 'Purple Mustang'
    },
    K: {
      c: 'Troy Aikman',
      o: 'Dallas Star on Grass'
    }
  },
  a7: {
    P: {
      c: 'Hobbes',
      o: 'Stuffed Tiger Animal',
    },
    R: {
      c: 'Raoul Silva',
      o: 'Metal Mask'
    },
    N: {
      c: 'Zebulon (Zeb)',
      o: 'Winchester Rifle'
    },
    B: {
      c: 'Mandarin',
      o: 'Green Hoodie'
    },
    Q: {
      c: 'Cypher',
      o: 'Steak'
    },
    K: {
      c: 'Tony Romo',
      o: 'Cowboys Helmet'
    }
  },
  a8: {
    P: {
      c: 'Snoopy',
      o: 'Dog HOuse',
    },
    R: {
      c: 'Gustav Graves',
      o: 'Robot Armor'
    },
    N: {
      c: 'Simon Graham',
      o: 'Old Photo'
    },
    B: {
      c: 'Killian',
      o: 'Atomic Bomb'
    },
    Q: {
      c: 'Spoon Boy',
      o: 'Silver Spoon'
    },
    K: {
      c: 'John Elway',
      o: 'Broncos Helmet'
    }
  },
  b1: {
    P: {
      c: 'Sheriff Woody',
      o: 'Cowboy Hat & Star',
    },
    R: {
      c: 'Barney Ross',
      o: 'Large Knife'
    },
    N: {
      c: 'Blade',
      o: 'Leather Trench Coat'
    },
    B: {
      c: 'Thor',
      o: 'Hammer'
    },
    Q: {
      c: 'Marty McFly',
      o: 'Guitar'
    },
    K: {
      c: 'Lebron James',
      o: 'King Crown'
    }
  },
  b2: {
    P: {
      c: 'Buzz Lightyear',
      o: 'Space Helmet',
    },
    R: {
      c: 'Gunnar',
      o: 'American Flag Boxing Shorts'
    },
    N: {
      c: 'Whistler',
      o: 'Wooden Leg'
    },
    B: {
      c: 'Hella',
      o: 'Black Antlers'
    },
    Q: {
      c: 'Doc Brown',
      o: 'Delorean'
    },
    K: {
      c: 'Michael Jordan',
      o: '23 Bulls Jersey'
    }
  },
  b3: {
    P: {
      c: 'Rex',
      o: 'Dinosaur Bones',
    },
    R: {
      c: 'Lee Xmas',
      o: 'Black Beret'
    },
    N: {
      c: 'Deacon Frost',
      o: 'Blood Syringe'
    },
    B: {
      c: 'Executioner',
      o: 'M-16 Rifles'
    },
    Q: {
      c: 'Biff',
      o: 'Hover Board'
    },
    K: {
      c: 'Kobe Bryant',
      o: '24 Lakers Jersey'
    }
  },
  b4: {
    P: {
      c: 'Hamm',
      o: 'Large Ham Leg',
    },
    R: {
      c: 'Yin Yang',
      o: 'Ninja Stars'
    },
    N: {
      c: 'Nomak',
      o: 'Opening Vampire Mouth'
    },
    B: {
      c: 'Loki',
      o: 'Golden Horned Helmet'
    },
    Q: {
      c: 'George McFly',
      o: 'Strawberries Milkshake'
    },
    K: {
      c: 'Magic Johnson',
      o: 'Basketball'
    }
  },
  b5: {
    P: {
      c: 'Slinky Dog',
      o: 'Slinky',
    },
    R: {
      c: 'Trench',
      o: 'Mauser Pistol'
    },
    N: {
      c: 'Drake',
      o: 'Vampire Bats'
    },
    B: {
      c: 'Odin',
      o: 'Golden Spear'
    },
    Q: {
      c: 'Mr Strickland',
      o: 'Bullhorn'
    },
    K: {
      c: 'Larry Bird',
      o: 'Celtics Jersey'
    }
  },
  b6: {
    P: {
      c: 'Mr. Potato Head',
      o: 'Sack of Potatoes',
    },
    R: {
      c: 'Caesar',
      o: 'Rapid Fire Shotgun'
    },
    N: {
      c: 'Hannibal King',
      o: 'Metal Wrist Chains'
    },
    B: {
      c: 'Malekith',
      o: 'Black Stone & Red Aura'
    },
    Q: {
      c: 'Lorain',
      o: 'Text books held in front'
    },
    K: {
      c: 'Allen Iverson',
      o: '76ers Jersey'
    }
  },
  b7: {
    P: {
      c: 'Aliens',
      o: 'UFO',
    },
    R: {
      c: 'Dan Paine',
      o: 'Beers'
    },
    N: {
      c: 'Whistlers Daughter',
      o: '21st Century Bow'
    },
    B: {
      c: 'Heimdall',
      o: 'Bifrost Sword'
    },
    Q: {
      c: 'Marvin Berry',
      o: 'Singing Microphone'
    },
    K: {
      c: 'Dwayne Wade',
      o: 'Miami #3 Jersey'
    }
  },
  b8: {
    P: {
      c: 'Sid',
      o: 'Pirate Flag',
    },
    R: {
      c: 'General Garza',
      o: 'Red Beret'
    },
    N: {
      c: 'Reinhardt',
      o: 'Head Probe'
    },
    B: {
      c: 'Grandmaster',
      o: 'Electrical Probe Staff'
    },
    Q: {
      c: 'Goldie Wilson',
      o: 'Broom & Cook Hat'
    },
    K: {
      c: 'Birdman',
      o: 'Mohawk with Headband'
    }
  },
  c1: {
    P: {
      c: 'Mr. Incredible',
      o: 'Black Eye Mask',
    },
    R: {
      c: 'John Mason',
      o: 'Black Hummer'
    },
    N: {
      c: 'Leonidas',
      o: 'Spartan Helmet'
    },
    B: {
      c: 'Captain America',
      o: 'Shield'
    },
    Q: {
      c: 'Luke Skywalker',
      o: 'Blaster Helmet & Blue Lightsaber'
    },
    K: {
      c: 'Barrack Obama',
      o: 'Corvette Stingray'
    }
  },
  c2: {
    P: {
      c: 'Elastigirl',
      o: 'Silly Puddy',
    },
    R: {
      c: 'Stanley Goodspeed',
      o: 'Rocket'
    },
    N: {
      c: 'Ephialtes',
      o: 'Red Cape & Spear'
    },
    B: {
      c: 'Winter Soldier',
      o: 'Metal Arm w/Red Star'
    },
    Q: {
      c: 'Han Solo',
      o: 'Ton Ton Animal'
    },
    K: {
      c: 'Donald Trump',
      o: 'Trump Tower'
    }
  },
  c3: {
    P: {
      c: 'Frozone',
      o: 'Surf Board',
    },
    R: {
      c: 'The General',
      o: 'Silver Pistol'
    },
    N: {
      c: 'Xerxes',
      o: 'Throne Platform'
    },
    B: {
      c: 'Red Skull',
      o: 'Tesseract'
    },
    Q: {
      c: 'Chewie',
      o: 'Metal Chained Shoulder Strap'
    },
    K: {
      c: 'George H.W. Bush',
      o: 'Horseshoes'
    }
  },
  c4: {
    P: {
      c: 'Dash',
      o: 'Treadmill',
    },
    R: {
      c: 'FBI Director Womack',
      o: 'FBI Blazer Jacket'
    },
    N: {
      c: 'Persian Emissary',
      o: 'Skull Chain'
    },
    B: {
      c: 'General Chester Lee',
      o: 'Corn Pipe'
    },
    Q: {
      c: 'C3PO',
      o: 'C3PO Body Parts'
    },
    K: {
      c: 'George Bush Sr.',
      o: 'Military Helmet & M-16 Rifle'
    }
  },
  c5: {
    P: {
      c: 'Violet',
      o: 'Purple Koolaid',
    },
    R: {
      c: 'Captain Frye',
      o: 'Poison Gass Ball'
    },
    N: {
      c: 'Daxos',
      o: 'Farming Pitchfork'
    },
    B: {
      c: 'Falcon',
      o: 'Metal Wings'
    },
    Q: {
      c: 'R2-D2',
      o: 'Hologram Projector'
    },
    K: {
      c: 'Ronald Reagan',
      o: 'American Flag'
    }
  },
  c6: {
    P: {
      c: 'Jack Jack',
      o: 'Stinky Diaper',
    },
    R: {
      c: 'Captain Darrow',
      o: 'Black & White Camo'
    },
    N: {
      c: 'Dilios',
      o: 'Eye Patch & Spartan Shield'
    },
    B: {
      c: 'Quicksilver',
      o: 'Walkman Headset & Goggles'
    },
    Q: {
      c: 'Leigh Organna',
      o: 'Bondage Neck Chain'
    },
    K: {
      c: 'Bill Clinton',
      o: 'Saxaphone'
    }
  },
  c7: {
    P: {
      c: 'Syndrome',
      o: 'Lazer Pointer',
    },
    R: {
      c: 'Major Baxter',
      o: 'Army Radio'
    },
    N: {
      c: 'Uber Immortal',
      o: 'Sword in the Arm'
    },
    B: {
      c: 'Scarlet Witch',
      o: 'Read Energy coming from hands'
    },
    Q: {
      c: 'Darth Vader',
      o: 'Red Lightsaber'
    },
    K: {
      c: 'Hillary Clinton',
      o: 'Laptop'
    }
  },
  c8: {
    P: {
      c: 'Edna',
      o: 'Extremely Large Black Glasses',
    },
    R: {
      c: 'Special Agent Paxton',
      o: 'Barber Apron'
    },
    N: {
      c: 'Immortal',
      o: 'Metal Noh Mask'
    },
    B: {
      c: 'Agent Carter',
      o: 'Red Fedora'
    },
    Q: {
      c: 'Yoda',
      o: 'Green Lightsaber'
    },
    K: {
      c: 'John F. Kennedy',
      o: 'Rocket'
    }
  },
  d1: {
    P: {
      c: 'James Sullivan',
      o: 'Blue Furry Carpet',
    },
    R: {
      c: 'Neil',
      o: 'Hockey Mask'
    },
    N: {
      c: 'Gandalf',
      o: 'Wizard Hat'
    },
    B: {
      c: 'Star Lord',
      o: 'Star Lord Mask'
    },
    Q: {
      c: 'Captain Picard',
      o: 'Chest Transponder'
    },
    K: {
      c: 'Andrew Bickley',
      o: 'Eagle Statue'
    }
  },
  d2: {
    P: {
      c: 'Mike Wazowski',
      o: 'Large Eyeball',
    },
    R: {
      c: 'Lt Vincent',
      o: 'Police Car Light'
    },
    N: {
      c: 'Aragon',
      o: 'Broken Sword'
    },
    B: {
      c: 'Groot',
      o: 'Potted Tree'
    },
    Q: {
      c: 'Commander Riker',
      o: 'Poker Table'
    },
    K: {
      c: 'Justin',
      o: 'Hawaiin Coconut Necklace'
    }
  },
  d3: {
    P: {
      c: 'Randall Boggs',
      o: 'Scream Door',
    },
    R: {
      c: 'Chris (Val Kilmer)',
      o: 'Corvette'
    },
    N: {
      c: 'Frodo',
      o: 'Mithrael & Blue Sword'
    },
    B: {
      c: 'Gamora',
      o: 'Green Skin'
    },
    Q: {
      c: 'Data',
      o: 'Android Skull w/Blinking Lights'
    },
    K: {
      c: 'Justin Burke',
      o: 'BBQ Grill'
    }
  },
  d4: {
    P: {
      c: 'Roz',
      o: 'Snails',
    },
    R: {
      c: 'Waingro',
      o: 'Semi Truck'
    },
    N: {
      c: 'Legolas',
      o: 'Bow & Elvin Hoodie'
    },
    B: {
      c: 'Drax the Destroyer',
      o: 'Silver Orb'
    },
    Q: {
      c: 'Worf',
      o: 'Klingon Sword'
    },
    K: {
      c: 'Bill Barnett',
      o: 'Golf Set'
    }
  },
  d5: {
    P: {
      c: 'Boo',
      o: 'Sleeping Bed',
    },
    R: {
      c: 'Cheritto',
      o: 'Binoculars'
    },
    N: {
      c: 'Nazgul',
      o: 'Black Hoodie & Horse'
    },
    B: {
      c: 'Ronin',
      o: 'Ronins Hammer'
    },
    Q: {
      c: 'Beverly Crusher',
      o: 'Tri-Corder'
    },
    K: {
      c: 'Ian Barnett',
      o: 'Nintendo 64'
    }
  },
  d6: {
    P: {
      c: 'The Abominable Snowman',
      o: 'Snowman',
    },
    R: {
      c: 'Lauren',
      o: 'Cut Wrists'
    },
    N: {
      c: 'Gollum',
      o: 'The One Ring'
    },
    B: {
      c: 'Thanos',
      o: 'Golden Hand'
    },
    Q: {
      c: 'Captain Kirk',
      o: 'Handheld Transponder'
    },
    K: {
      c: 'Adam Parker',
      o: 'Risk Board game'
    }
  },
  d7: {
    P: {
      c: 'Henry Waternoos',
      o: 'Scream Cannister',
    },
    R: {
      c: 'Trejo',
      o: 'Blood Face'
    },
    N: {
      c: 'Sauron',
      o: 'Great Eye Tower'
    },
    B: {
      c: 'Rocket Racoon',
      o: 'Racoon Tail Hat'
    },
    Q: {
      c: 'Spock',
      o: 'Vulcan Meditation Candle'
    },
    K: {
      c: 'Ben Parker',
      o: 'Police Uniform'
    }
  },
  d8: {
    P: {
      c: 'Celia',
      o: 'Medusa Head',
    },
    R: {
      c: 'Nate',
      o: 'Snake Boots'
    },
    N: {
      c: 'Boromir',
      o: 'Viking Shield'
    },
    B: {
      c: 'Yondu',
      o: 'Red Plastic Mohawk'
    },
    Q: {
      c: 'Commander Sulu',
      o: 'Phaser Gun'
    },
    K: {
      c: 'Brad Parker',
      o: 'Commander Hat'
    }
  },
  e1: {
    P: {
      c: 'Hook',
      o: 'Large Hook',
    },
    R: {
      c: 'Dominic Toretto',
      o: 'White Tank Top'
    },
    N: {
      c: 'Jon Snow',
      o: 'White Wolf'
    },
    B: {
      c: 'Spiderman',
      o: 'Web Shooters'
    },
    Q: {
      c: 'Terminator',
      o: 'Harley Davidson'
    },
    K: {
      c: 'Yuri Kudou',
      o: 'Hamster'
    }
  },
  e2: {
    P: {
      c: 'Peter Pan',
      o: 'Peter Pan Sword',
    },
    R: {
      c: 'Brian OConnor',
      o: 'Toyota Supra'
    },
    N: {
      c: 'Arya Stark',
      o: 'Mask of a face of Jaken Hagar'
    },
    B: {
      c: 'Green Goblin',
      o: 'Orange Goblin Grenade'
    },
    Q: {
      c: 'Sarah Connor',
      o: 'Bazooka'
    },
    K: {
      c: 'Amaris Bickley',
      o: 'Tent'
    }
  },
  e3: {
    P: {
      c: 'Rufio',
      o: 'Wooden Glider',
    },
    R: {
      c: 'Letty',
      o: 'Aviator Sunglasses'
    },
    N: {
      c: 'Little Finger',
      o: 'Valerian Steel Blade'
    },
    B: {
      c: 'Doc Oc',
      o: 'Tentacle Arms'
    },
    Q: {
      c: 'Kyle Reese',
      o: 'Pipe Bomb'
    },
    K: {
      c: 'Penuel Bickley',
      o: 'Hijab'
    }
  },
  e4: {
    P: {
      c: 'Smee',
      o: 'Hammer & Clock',
    },
    R: {
      c: 'Han',
      o: 'Lolli Pop'
    },
    N: {
      c: 'Tyrion',
      o: 'Bags of Gold'
    },
    B: {
      c: 'Harry',
      o: 'Glider'
    },
    Q: {
      c: 'T-1000',
      o: 'Liquid Sword from the Hand'
    },
    K: {
      c: 'Cathy Barnett',
      o: 'Pill Bottles'
    }
  },
  e5: {
    P: {
      c: 'Jack Banning',
      o: 'Baseball & Glove',
    },
    R: {
      c: 'Roman',
      o: 'Ankle Bracelet & Spiked Gloves'
    },
    N: {
      c: 'Cersei',
      o: 'Goblet of Wine'
    },
    B: {
      c: 'Mary Jane',
      o: 'Plate of Pancakes'
    },
    Q: {
      c: 'Miles Dyson',
      o: 'Robot Arm'
    },
    K: {
      c: 'Fran Stuart',
      o: 'Coffee Cake'
    }
  },
  e6: {
    P: {
      c: 'Thud Butt',
      o: 'Slingshot Seat',
    },
    R: {
      c: 'Mia',
      o: 'Baked Muffins'
    },
    N: {
      c: 'Danaerys',
      o: 'Dragon'
    },
    B: {
      c: 'Flash',
      o: 'Lunch Tray'
    },
    Q: {
      c: 'John Connor',
      o: 'Shotgun'
    },
    K: {
      c: 'Michelle Hennigar',
      o: 'Volleyball'
    }
  },
  e7: {
    P: {
      c: 'Tootles',
      o: 'Marbles',
    },
    R: {
      c: 'Luke Hobbs',
      o: 'Large Connex Box'
    },
    N: {
      c: 'The Hound',
      o: 'Shovel'
    },
    B: {
      c: 'Uncle Ben',
      o: 'Red Cadillac'
    },
    Q: {
      c: 'Dr. Silberman',
      o: 'Lab Coat & Pencil in Ear'
    },
    K: {
      c: 'Cindy Parker',
      o: 'Salad Bowl'
    }
  },
  e8: {
    P: {
      c: 'Tinker Bell',
      o: 'Pixy Dust',
    },
    R: {
      c: 'Tej',
      o: 'Sexy Bikini Girls'
    },
    N: {
      c: 'The Night King',
      o: 'Iced Dragon'
    },
    B: {
      c: 'Aunt May',
      o: 'Hospital bed'
    },
    Q: {
      c: 'Kate Brewster',
      o: 'Vet Truck'
    },
    K: {
      c: 'Micha Tortorici',
      o: 'Straight Jacket'
    }
  },
  f1: {
    P: {
      c: 'Indiana Jones',
      o: 'Whip',
    },
    R: {
      c: 'Jason Bourne',
      o: 'Telephone Ear Piece'
    },
    N: {
      c: 'Harry Potter',
      o: 'Nimbus 2000'
    },
    B: {
      c: 'Batman',
      o: 'Batmobile'
    },
    Q: {
      c: 'Rey',
      o: 'Dust Mask'
    },
    K: {
      c: 'Ryer',
      o: 'Gold Chain Necklace'
    }
  },
  f2: {
    P: {
      c: 'Henry Jones',
      o: 'Umbrella',
    },
    R: {
      c: 'Nicky Parsons',
      o: 'Cafe Table'
    },
    N: {
      c: 'Hagrid',
      o: 'Motorbike'
    },
    B: {
      c: 'Joker',
      o: 'Joker Card'
    },
    Q: {
      c: 'Kylo Ren',
      o: 'Metal Helmet'
    },
    K: {
      c: 'Robinson',
      o: 'Pack of Cigarettes'
    }
  },
  f3: {
    P: {
      c: 'Sallah',
      o: 'Monkey',
    },
    R: {
      c: 'Marie',
      o: 'Mo-Ped'
    },
    N: {
      c: 'Dumbledore',
      o: 'Phoenix'
    },
    B: {
      c: 'Catwoman',
      o: 'Black Leotard'
    },
    Q: {
      c: 'Finn',
      o: 'Storm Trooper Helmet'
    },
    K: {
      c: 'Dawson',
      o: 'Bowling Ball'
    }
  },
  f4: {
    P: {
      c: 'Marion Ravenwood',
      o: 'Silver Medallion',
    },
    R: {
      c: 'Noah Vosen',
      o: 'File Safe'
    },
    N: {
      c: 'Hermoine',
      o: 'Sorting Hat'
    },
    B: {
      c: 'Scarecrow',
      o: 'Mask'
    },
    Q: {
      c: 'Poe',
      o: 'X-Wing'
    },
    K: {
      c: 'Hoffman',
      o: 'Grizzly Bear'
    }
  },
  f5: {
    P: {
      c: 'Mola Ram',
      o: 'Skulls',
    },
    R: {
      c: 'Ward Abbott',
      o: 'Tape Recorder'
    },
    N: {
      c: 'Snape',
      o: 'Potion Bottle'
    },
    B: {
      c: 'Commissioner Gordon',
      o: 'Batman Light'
    },
    Q: {
      c: 'General Hux',
      o: 'Black Boots'
    },
    K: {
      c: 'Dixon',
      o: 'Champagne Bottle'
    }
  },
  f6: {
    P: {
      c: 'Elsa Schneider',
      o: 'Swatstika Diary',
    },
    R: {
      c: 'Wombosi',
      o: 'Yacht'
    },
    N: {
      c: 'Strange Witch',
      o: 'Death Eater Hat'
    },
    B: {
      c: 'Raz Algul',
      o: 'Blue Flower'
    },
    Q: {
      c: 'Captain Phasma',
      o: 'Silver Helmet'
    },
    K: {
      c: 'Oates',
      o: 'Chiefs Jersey'
    }
  },
  f7: {
    P: {
      c: 'General Vogel',
      o: 'SS Officer Hat',
    },
    R: {
      c: 'Dr. Hirsch',
      o: 'Water Tank'
    },
    N: {
      c: 'Voldemort',
      o: 'Large Snake'
    },
    B: {
      c: 'Bane',
      o: 'Bane Mask'
    },
    Q: {
      c: 'Maz Kanata',
      o: 'Wooden Chest'
    },
    K: {
      c: 'Polinsky',
      o: 'BBQ Dogs'
    }
  },
  f8: {
    P: {
      c: 'Irina Spalko',
      o: 'Saber',
    },
    R: {
      c: 'Karl Urbans Assassin',
      o: 'Sniper Rifle'
    },
    N: {
      c: 'Ron Weasley',
      o: 'Talking Telegram'
    },
    B: {
      c: 'Alfred',
      o: 'Silver Tray & Drinks'
    },
    Q: {
      c: 'Snoke',
      o: 'BB-8'
    },
    K: {
      c: 'Jarnagin',
      o: 'Chewing Dip'
    }
  },
  g1: {
    P: {
      c: 'Sloth',
      o: 'Mars Bars',
    },
    R: {
      c: 'Charlie Croker',
      o: 'Speed Boat'
    },
    N: {
      c: 'Maximus',
      o: 'Gladiator Helmet'
    },
    B: {
      c: 'Daredevil',
      o: 'Blind Walking Stick'
    },
    Q: {
      c: 'Anakin Skywalker',
      o: 'Yellow Fighter'
    },
    K: {
      c: 'Hattaway',
      o: 'Brass Bell'
    }
  },
  g2: {
    P: {
      c: 'Chunk',
      o: 'Hawaiin Shirt',
    },
    R: {
      c: 'John Bridger',
      o: 'Large Safe'
    },
    N: {
      c: 'Proximo',
      o: 'Wooden Sword'
    },
    B: {
      c: 'Bullseye',
      o: 'Dart Board'
    },
    Q: {
      c: 'Qui Gon Jinn',
      o: 'Blue Dice'
    },
    K: {
      c: 'Lehman',
      o: 'Microphone'
    }
  },
  g3: {
    P: {
      c: 'Mikey',
      o: 'Compass',
    },
    R: {
      c: 'Steve',
      o: 'helicopter'
    },
    N: {
      c: 'Commodus',
      o: 'Thumb Down'
    },
    B: {
      c: 'Elektra',
      o: 'Daggers'
    },
    Q: {
      c: 'Obi Wan Kenobi',
      o: 'Ship Hologram'
    },
    K: {
      c: 'Intoccia',
      o: 'Clipboard'
    }
  },
  g4: {
    P: {
      c: 'Data',
      o: 'Punching Gloves',
    },
    R: {
      c: 'Stella',
      o: 'Mini Cooper'
    },
    N: {
      c: 'Tigris',
      o: 'Tiger'
    },
    B: {
      c: 'Kingpin',
      o: 'Crystal Ball Cane'
    },
    Q: {
      c: 'Darth Maul',
      o: 'Two Bladed Lightsaber'
    },
    K: {
      c: 'CSO Myers',
      o: 'Walkie Talkie'
    }
  },
  g5: {
    P: {
      c: 'Mouth',
      o: 'Pearl Necklace',
    },
    R: {
      c: 'Left Ear',
      o: 'Explosive Charges'
    },
    N: {
      c: 'Juba',
      o: 'Net & Spear'
    },
    B: {
      c: 'Daredevil (Netflix)',
      o: 'Black Headband'
    },
    Q: {
      c: 'Emporer Palpatine',
      o: 'Black Throne'
    },
    K: {
      c: 'WEPS',
      o: 'Harpoon Launcher'
    }
  },
  g6: {
    P: {
      c: 'Stef',
      o: 'Large stack of Books',
    },
    R: {
      c: 'Wrench',
      o: 'Big Wrench'
    },
    N: {
      c: 'Marcus Aurelius',
      o: 'Stone Statue'
    },
    B: {
      c: 'Kingpin',
      o: 'White Suit Jacket'
    },
    Q: {
      c: 'Queen Amidala',
      o: 'Silver Handgun'
    },
    K: {
      c: 'Frisbee Officer',
      o: 'Frisbee'
    }
  },
  g7: {
    P: {
      c: 'Brand',
      o: 'Workout Straps',
    },
    R: {
      c: 'Lyle',
      o: 'Luggage Cart'
    },
    N: {
      c: 'Lucius Verus',
      o: 'Wooden Horse'
    },
    B: {
      c: 'Punisher',
      o: 'Bullet Proof Vest'
    },
    Q: {
      c: 'Jar Jar Binks',
      o: 'Blue Gungan Grenades'
    },
    K: {
      c: 'Subgru 7 Admiral',
      o: 'Polycom Microphone'
    }
  },
  g8: {
    P: {
      c: 'Mama Fratelli',
      o: 'Range Rover',
    },
    R: {
      c: 'Mashkov',
      o: 'Axe'
    },
    N: {
      c: 'Cassius',
      o: 'Golden Head Wreath'
    },
    B: {
      c: 'Stick',
      o: 'Army Hat & Stick'
    },
    Q: {
      c: 'Mace Windu',
      o: 'Purple Lightsaber'
    },
    K: {
      c: 'Chief of Staff',
      o: 'Standing Desk'
    }
  },
  h1: {
    P: {
      c: 'Pocahontas',
      o: 'Canoe',
    },
    R: {
      c: 'Ethan Hunt',
      o: 'Chewing Gum'
    },
    N: {
      c: 'Hellboy',
      o: 'Red Stone Hand'
    },
    B: {
      c: 'Superman',
      o: 'Kryptonite Rock'
    },
    Q: {
      c: 'Mando',
      o: 'Jet Pack'
    },
    K: {
      c: 'Brendan',
      o: 'Hockey Stick'
    }
  },
  h2: {
    P: {
      c: 'Capt John Smith',
      o: 'Spanish Armor',
    },
    R: {
      c: 'Luther',
      o: 'FireFighter Outfit'
    },
    N: {
      c: 'Selma',
      o: 'Blue Fire'
    },
    B: {
      c: 'Wonder Woman',
      o: 'Golden Whip'
    },
    Q: {
      c: 'Bobba Fett',
      o: 'Carbonite Slap'
    },
    K: {
      c: 'Joey',
      o: 'Motorcycle Helmet'
    }
  },
  h3: {
    P: {
      c: 'Governor Ratcliffe',
      o: 'Mountain of Gold',
    },
    R: {
      c: 'Benji',
      o: 'Rubiks Cube'
    },
    N: {
      c: 'Rasputin',
      o: 'Green Floating Energy Ball'
    },
    B: {
      c: 'Aquaman',
      o: 'Trident'
    },
    Q: {
      c: 'Cara Dune',
      o: 'Blaster Pistol'
    },
    K: {
      c: 'Fabio',
      o: 'Glass of Wine'
    }
  },
  h4: {
    P: {
      c: 'Kokoum',
      o: 'Tomohawk',
    },
    R: {
      c: 'Jim Phelps',
      o: 'Bible'
    },
    N: {
      c: 'Karl Kroenen',
      o: 'Ticking Breastplate'
    },
    B: {
      c: 'Batman',
      o: 'Kryptonite Spear'
    },
    Q: {
      c: 'Moff Gideon',
      o: 'Black Saber'
    },
    K: {
      c: 'Ruggero',
      o: 'Cheese Plater'
    }
  },
  h5: {
    P: {
      c: 'Percy Dog',
      o: 'Bowl of Cherries',
    },
    R: {
      c: 'Agent Kittridge',
      o: 'Khakki Spy Jacket'
    },
    N: {
      c: 'Abe',
      o: 'Webbed Hands'
    },
    B: {
      c: 'General Zod',
      o: 'Kryptonian Spaceship'
    },
    Q: {
      c: 'Greef',
      o: 'Bounty Pack'
    },
    K: {
      c: 'Vasisht',
      o: 'Bose Headphones'
    }
  },
  h6: {
    P: {
      c: 'Wiggins',
      o: 'Feather Duster',
    },
    R: {
      c: 'Owen Davian',
      o: 'Silver Metal Briefcase'
    },
    N: {
      c: 'Agent Tom',
      o: 'Cigar'
    },
    B: {
      c: 'Lois Lane',
      o: 'Journalist Notebook'
    },
    Q: {
      c: 'The Client',
      o: 'Chest of Baskar'
    },
    K: {
      c: 'Bruno',
      o: 'Black Tesla X'
    }
  },
  h7: {
    P: {
      c: 'Meeko',
      o: 'Biscuits',
    },
    R: {
      c: 'Franz',
      o: 'Black Knife'
    },
    N: {
      c: 'Sammael Creature',
      o: 'Tongue Shooter'
    },
    B: {
      c: 'Mama Kent',
      o: 'Lemonade Pitcher'
    },
    Q: {
      c: 'Kuill',
      o: '4 Legged Sand Creature'
    },
    K: {
      c: 'Ruth',
      o: 'White Wine'
    }
  },
  h8: {
    P: {
      c: 'Grandmother Willow',
      o: 'Vines',
    },
    R: {
      c: 'Claire Phelps',
      o: 'Bloody Disk'
    },
    N: {
      c: 'Broom',
      o: 'Rosary'
    },
    B: {
      c: 'Papa Kent',
      o: 'Bale of Hay'
    },
    Q: {
      c: 'The Child',
      o: 'Baby Carriage'
    },
    K: {
      c: 'Jun',
      o: 'Chihuahua Dog'
    }
  }
};
