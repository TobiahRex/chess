const fs = require('fs');
const { MoveMap, majorPieces } = require('./moveDictionary');

fs.readFile('moveParser/testFile.txt', 'utf-8', (err, data) => {
  if (err) return;
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
  console.log(mappedMoves);
});

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
    if (info.turn === 'white')  {
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
