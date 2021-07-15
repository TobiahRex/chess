const letters = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'
]
const numbers = [
  1, 2, 3, 4, 5, 6, 7, 8
]

const pieces = [
  'K', 'Q', 'B', 'N', 'R', '',
]

const generateSquares = (size) => {
  const memo = {};
  let answers = '';
  let white = '';
  let black = '';
  for (let i = 0; i < size; i++) {
    const lIx = Math.floor(Math.random() * 8);
    const nIx = Math.floor(Math.random() * 8);

    const letter = letters[lIx];
    const num = numbers[nIx];
    const combo = `${letter}${num}, `;

    const isBlack = [
      lIx % 2 === 0 && nIx % 2 === 0,
      lIx % 2 !== 0 && nIx % 2 !== 0,
    ].some(Boolean);

    if (isBlack) {
      black += combo;
    } else {
      white += combo;
    }

    if (combo in memo) {
      memo[combo] += 1;
    } else {
      memo[combo] = 1;
    }
    answers += combo;
  }
  // console.log(black)
  // console.log(white)
  // console.log(memo);
  console.log('SQUARES: \n', answers);
}
// generateSquares(2000);

const generatePieceSquares = (size) => {
  const memo = {};
  let answers = [];
  let white = [];
  let black = [];
  for (let i = 0; i < size; i++) {
    const lIx = Math.floor(Math.random() * 8);
    const nIx = Math.floor(Math.random() * 8);
    const pIx = Math.floor(Math.random() * 6);

    const letter = letters[lIx];
    const num = numbers[nIx];
    const piece = pieces[pIx];
    let combo = `${piece}${letter}${num}`;

    const isBlack = [
      lIx % 2 === 0 && nIx % 2 === 0,
      lIx % 2 !== 0 && nIx % 2 !== 0,
    ].some(Boolean);

    if (isBlack) {
      black.push(combo);
    } else {
      white.push(combo);
    }

    if (combo in memo) {
      memo[combo] += 1;
    } else {
      memo[combo] = 1;
    }
    if (i % 10 === 0 && i > 1) combo += '\n'
    if (white.length % 10 === 0 && white.length > 1) white.push('\n');
    if (black.length % 10 === 0 && black.length > 1) black.push('\n');
    answers.push(combo);
  }
  // console.log(black)
  console.log(white.join(', '))
  // console.log(memo);
  // console.log('Pieces: \n', answers);
}
generatePieceSquares(1000)

const allSquares_2000_map = {
  'a6, ': 29,
  'e6, ': 30,
  'e4, ': 36,
  'c5, ': 37,
  'f6, ': 39,
  'f5, ': 27,
  'f3, ': 34,
  'e2, ': 36,
  'e3, ': 31,
  'e5, ': 23,
  'h6, ': 25,
  'c2, ': 41,
  'g3, ': 30,
  'b3, ': 30,
  'd4, ': 30,
  'c4, ': 24,
  'b4, ': 34,
  'a4, ': 43,
  'a7, ': 31,
  'e8, ': 32,
  'c6, ': 30,
  'f1, ': 33,
  'g6, ': 24,
  'g8, ': 33,
  'g2, ': 35,
  'd3, ': 37,
  'b5, ': 27,
  'h7, ': 31,
  'h8, ': 35,
  'e7, ': 40,
  'g7, ': 30,
  'h4, ': 22,
  'd2, ': 27,
  'f8, ': 33,
  'd5, ': 23,
  'b6, ': 28,
  'd1, ': 26,
  'd7, ': 20,
  'f2, ': 35,
  'a3, ': 32,
  'g1, ': 21,
  'a2, ': 26,
  'e1, ': 26,
  'a1, ': 37,
  'b2, ': 41,
  'c8, ': 29,
  'h1, ': 30,
  'c3, ': 36,
  'h3, ': 31,
  'h2, ': 33,
  'd8, ': 34,
  'f7, ': 32,
  'g5, ': 32,
  'd6, ': 30,
  'b8, ': 32,
  'f4, ': 33,
  'a8, ': 33,
  'a5, ': 33,
  'h5, ': 27,
  'c1, ': 30,
  'b7, ': 30,
  'b1, ': 35,
  'g4, ': 33,
  'c7, ': 33
};
const allSquares_2000 = 'a6, e6, e4, c5, f6, f5, f3, e2, e3, e5, h6, c2, e5, g3, b3, d4, c4, b4, a4, d4, b3, a7, e8, c6, f1, g6, g8, g2, d3, g8, g8, b5, h7, h8, g3, e7, e2, e8, g7, h4, d2, c6, f8, d5, h8, b6, b4, b4, f8, d1, d7, h7, f2, a3, b4, a3, c2, g1, c2, a2, e1, a1, a2, e5, b2, c8, g3, b6, f1, g6, d2, a7, h1, c3, h3, h2, d2, d8, e5, d4, e5, f7, g5, g6, a3, g1, e2, f2, f2, d6, g7, h8, e7, b8, f4, a2, h2, c8, h7, c5, e8, h2, e2, c3, d8, a8, e2, b5, c8, a2, h3, e2, e2, e3, h2, e6, e7, g1, a5, c8, d1, e2, f5, b6, g7, a3, c8, c5, d6, d3, e5, a3, a5, f1, g5, g2, f5, e1, c8, a4, e4, e3, f4, b8, b6, h5, g7, c1, e2, g6, a2, c5, b7, b3, a3, f1, b1, h2, g3, d3, c1, a7, b2, h6, g2, g3, d1, d3, b6, a5, h7, f8, f3, h8, e3, b5, f3, d8, h5, g7, h4, c3, f8, h2, a8, d8, h3, b4, f4, h3, d1, d8, e7, f4, d6, g4, b3, h3, h6, d3, h7, c7, b3, c3, c8, h8, g7, h3, d2, c1, c5, c1, d1, c3, g2, h7, c2, c7, c6, c2, d3, e8, d6, c2, d6, c1, f6, f1, d3, b8, c3, h6, g4, d4, e2, f2, b1, c2, h2, c3, g4, c1, g8, d4, g7, c6, a4, d7, a3, b6, h8, a4, g1, c1, b1, g2, d4, a1, c7, g8, e3, b1, h1, f3, e3, d6, d3, g6, b8, c7, c2, g4, b2, a5, b2, f5, g6, a1, f5, g4, b7, f6, d8, f1, f7, e7, f4, b6, b6, h1, a5, b5, g7, b5, e2, d5, f8, d3, b7, f6, a5, h7, c3, c1, c4, g7, f5, f1, g7, h7, c1, e7, f2, e6, f1, f3, e5, c1, d2, f3, d4, d5, c7, f8, f5, b1, b3, d7, e1, c3, h6, b7, h4, e6, f2, h6, b4, d1, e2, g8, f5, c8, a4, b1, d4, g3, c4, d8, c7, a2, e7, e4, c3, c4, e7, d8, h6, d7, f5, b8, e8, d3, e8, b1, h8, a8, d6, d8, e5, h6, a2, b7, d4, h2, c3, e7, a1, g2, c1, e8, c5, h1, c1, h8, e2, c2, f7, a1, a5, f2, f7, d5, a3, h2, b2, h4, b6, e7, h6, f1, c5, c7, g7, b1, a7, f2, e2, d8, b3, g2, d4, g2, g8, e4, b5, f2, d2, b3, e7, b1, b2, h8, c7, a2, c5, a3, c2, a4, c2, f6, c5, e7, d3, d4, d2, b2, e4, d3, g3, a3, e1, b8, f2, e2, f6, g6, b6, d7, d3, h3, d2, h8, e6, e6, a4, c8, b2, e6, d3, g4, a2, h5, a8, a4, h4, b5, g1, c8, e3, e8, h2, c5, b4, g2, a1, c3, g3, b4, d3, g8, h5, f8, b3, g2, e1, a4, e2, f5, d4, b6, b3, d7, b3, f5, b4, c6, b7, d5, f5, g1, c1, b8, d3, d4, c7, f4, a5, a4, h8, b2, b8, a8, d7, b7, g8, e1, c6, b1, c5, g5, a4, g4, c3, g5, h2, f7, b6, b7, h7, b1, d7, a7, e7, b2, g2, d2, d5, h8, g6, h2, d6, a1, b2, d3, e7, h2, g5, b6, d1, c8, b4, g2, c4, f6, g5, g1, a7, g8, c7, a6, g2, f8, d3, f4, f2, c7, c2, e8, a7, b6, h7, b1, b2, b3, e4, f7, b2, g1, c1, d2, f8, e4, f7, c3, d4, h4, c3, h7, h3, a5, a5, c3, g1, a7, b5, c7, d8, f6, e8, e3, c8, b2, h7, f2, b4, d2, d6, b6, b1, c5, h6, g8, c4, b8, b5, b7, f3, d6, c4, f7, g2, h1, h6, a4, g4, f4, f6, c1, b8, f1, f6, b7, f6, e8, h8, f4, c7, c7, a4, d2, g7, b1, f4, c2, h1, a5, b4, f1, h8, g5, e4, g3, e4, f6, h2, g3, c3, d2, b8, b8, d1, f8, a8, a7, f1, e1, f4, h1, c5, d3, f3, h6, b1, c7, d3, c6, a8, a1, f3, f4, h7, c1, g1, a2, h5, b8, c6, h1, b8, h3, c3, f8, f6, h8, g6, a5, c8, c4, c8, a1, g2, e2, f3, f1, g5, a6, g3, d8, g7, c7, h8, g2, a2, b7, g6, a1, c2, a3, a5, f5, g4, a1, a6, c7, e6, h7, a7, c7, f5, e5, e4, h3, f6, e8, h3, f1, g1, h6, b5, d3, b1, d3, c7, e3, e4, a3, f4, d2, b3, g7, a6, d8, h3, f4, e7, b2, b2, b8, a3, c4, e3, h7, e1, d7, b6, g2, c3, g4, a1, e1, a4, h1, d4, e3, b3, f4, f4, c4, f8, b2, d4, a1, b7, g6, d7, a7, a4, e1, g8, d8, e7, d1, g4, a2, a5, g3, d6, f5, g5, c6, a8, b4, b7, e3, b1, c5, g2, h5, c5, h1, f6, f6, b7, h6, b5, a6, b4, b2, d3, g4, h1, c6, h5, b2, c1, f3, a4, b4, a8, g4, b2, a1, h1, c1, f3, a4, c7, a1, e6, a8, e7, b8, b2, a8, a8, h1, b8, g2, b4, h7, e2, d2, a6, f5, d6, f3, g3, a4, a7, g4, e4, e8, h3, d5, h8, b8, a5, d4, a4, c4, c6, h2, b8, f3, e8, f7, g4, g3, e3, g5, b5, d5, f1, h7, f2, h7, b5, a8, a6, f2, c2, h3, g5, e4, g5, a1, c6, e5, a8, h5, d5, h4, c8, e4, a5, d8, h6, c2, b2, c4, e3, e7, d2, h5, d4, a1, c8, f4, e6, b3, d2, a7, f3, e7, d6, c6, b2, d3, h8, e7, h1, b8, h3, d6, f8, a7, h7, a4, c8, d6, c2, f1, e6, g6, a4, c8, f3, a1, b1, d7, g6, e7, c2, e6, d2, c3, e7, g1, e7, c1, f8, g6, c3, d6, g7, g4, b3, d5, g5, d5, h5, f7, g7, c5, a6, a3, h6, h4, c2, d3, c2, f1, e3, a5, a3, d4, f2, a7, e4, a6, g2, e8, f7, c2, a6, h8, a4, a1, f4, e7, d8, g5, b3, e8, b4, f8, h4, h6, a3, f6, e7, b7, a1, b2, f6, d3, d7, a7, c5, g8, d1, b4, g8, g3, f1, g3, b6, a7, e2, e4, f1, e5, f1, g4, d6, b4, h5, f7, f2, g7, h1, b2, e7, c2, c1, a1, a2, d8, g1, b1, f3, b1, g5, f5, a6, c5, g2, h2, a7, h1, d4, f7, h3, a1, a8, b4, e1, g8, b4, h2, h2, c6, g1, f3, b6, h4, f1, h6, d8, b2, g3, h8, a5, a3, g1, g6, f5, e6, a3, g8, a2, f6, g7, a6, d8, g8, e6, a7, f7, f3, e5, f7, h2, h8, b7, f5, b7, h8, f4, f1, a1, f8, h7, f7, b5, g6, h4, f3, g2, c1, f6, a8, e2, a8, a6, f2, d8, f2, c6, d5, f4, f4, f4, a1, e2, b5, d5, f2, f1, c6, e5, f5, e4, g8, f4, d6, d8, e2, c7, e4, b4, g6, e2, a4, g7, b8, g2, b1, h2, a1, d4, g5, b6, e5, g2, e6, a5, g6, b2, c2, e1, e3, c5, g2, g1, e3, c4, h1, h8, d8, d1, b4, h6, c5, h3, e3, b5, e1, g8, f2, g6, e4, d8, h3, a8, g4, d5, f2, g3, d7, h8, f8, g3, e6, a1, b5, c5, b2, f4, b8, e5, f6, d1, h4, e5, g4, b8, h1, c7, h1, f6, c5, e3, a7, c1, g3, f7, c2, d6, b7, g7, a3, g8, g3, c3, d4, b2, f2, f8, h1, e8, c5, c6, g3, c2, c5, a2, b1, e7, c6, e1, b5, c5, h7, e3, e4, b7, a7, a1, c2, h1, a3, b7, d8, h2, f8, g2, a4, a3, e4, c8, c7, c2, a6, b8, b1, g4, e7, b1, a6, f6, f2, c1, g8, b3, d4, e6, h5, a8, h5, b4, e2, b5, b6, f1, c2, f1, h6, f4, a6, c4, b1, c2, h7, b5, d1, h6, b5, b2, f8, c7, g4, e1, c6, g4, c4, a6, g3, e7, d1, a5, f7, c5, f7, c5, a7, d7, g5, f6, c7, c1, e6, g2, e2, g2, e8, b4, f8, e6, g5, f1, g5, d6, g6, a5, e8, g5, c3, h1, f2, h1, e3, a4, a4, f7, c7, a5, a3, b2, f6, b2, h3, h2, h4, g7, b6, f8, a6, h3, g2, f7, g6, d2, d7, g8, f5, c5, d3, h1, e7, h2, f8, f7, g5, e7, a7, d1, e5, d4, c1, f3, h8, d8, a3, h5, d4, b4, c8, a1, c1, g7, f2, e8, a7, a7, h1, b8, g1, h3, c5, e3, f4, h2, f6, d6, f7, b2, f3, e4, f4, f8, e6, e2, f6, e2, e3, e1, e8, a2, b3, b3, d3, a4, f2, g7, h6, a8, c3, a5, b8, f3, f4, c6, g5, c6, c3, h7, c3, e7, a5, a1, d1, b2, d4, g7, c6, c2, h8, e3, c2, f7, c4, g7, b7, g8, b1, b6, h4, f4, g8, g6, h7, h2, h3, g2, h4, a5, f6, d4, a7, c3, c2, f2, b6, a6, a4, d1, c4, h5, f8, c4, a4, h6, d5, g5, b3, c8, c4, d1, g5, h5, f5, g3, e1, g7, e5, f6, e6, g4, f6, c7, a2, h5, d1, a2, d7, h3, e2, f6, h5, d7, b1, e8, b1, f7, g4, h5, f5, c6, a6, b8, b7, a5, d5, c7, d3, h3, h7, g5, h1, e4, g6, a3, h5, f8, h4, b2, h3, g5, d2, g8, e6, e6, a1, a5, c7, b5, c8, h2, d5, f3, e4, c5, b7, c4, a8, a4, f4, d3, d3, a4, c7, e6, a8, a4, b5, f3, c5, b1, d3, g5, h7, g4, c6, c1, g7, h8, b1, e4, f8, a1, e7, a3, e3, d5, d3, a2, h4, e2, b7, h8, f4, c8, d3, a6, c6, e6, b1, f7, e4, f1, a4, c8, f8, b1, c1, b3, h8, h5, g4, b6, f2, c1, f1, e5, h4, e7, d6, c1, e8, a2, g5, g1, b5, c5, a1, h3, d8, b8, f7, c3, a1, d6, f2, c3, c4, a8, a4, e4, f2, d8, f7, b3, b5, a8, h2, f3, f2, a6, d6, h1, e4, a6, g8, f8, b4, e3, d7, d3, f6, d8, b5, c3, h4, a3, e5, a8, f3, h4, a1, a2, g3, c2, e2, c2, c3, g8, f3, f3, a8, d3, g8, e1, h2, e1, b1, e4, f6, b2, d4, g7, d8, a7, e3, b5, a8, e2, a7, b3, f8, e6, a2, d2, c8, g4, e4, e4, e4, g8, c7, c4, f8, g3, f6, a6, h3, c6, c4, g5, d4, h8, a4, h5, h1, c3, h3, b6, g4, e5, d7, g4, a8, c5, e6, g1, d5, e2, d2, b7, g8, a5, e4, e7, b4, b7, d5, c4, e2, b8, g2, c3, a1, e1, b4, c7, g4, b1, e1, f4, c5, g8, c5, e7, g4, h6, d2, e7, c7, e2, g3, a3, e7, a6, a2, b2, h4, c5, a5, e8, d2, a8, f3, d8, a2, c2, f8, h3, f3, c2, a6, h2, g1, h4, c5, g2, f2, f1, a8, d4, a1, f5, d3, b8, g5, c8, f6, b4, e8, e4, h2, d6, f8, a4, c3, g2, g8, f1, h7, b2, b3, e6, f4, d7, c8, e3, h6, a6, g2, b3, f7, e8, b4, a7, b7, e6, b7, h5, e1, d8, e1, a1, a2, b8, h8, d2, d1, b7, f6, g4, a8, f5, c2, d6, e1, c6, a7, e8, e8, d1, e8, a5, b6, a3, d2, e1, g8, g7, a4, a4, g2, d5, f7, b2, b2, h2, e4, e5, b1, f6, e5, c8, e2, a5, d8, a6, h5, b3, f5, b4, c6, c2, h2, h3, b3, h8, e4, d1, d6, h7, e7, a3, h8, e2, d5, c2, c2, f2, g4, f5, a3, g5, g7, a4, f3, f3, f1, c6, a4, c8, g3, g3, b2, f7, c2, e3, a4, d1, g5, d2, d1, h7, e7, c3, a4, h1, b6, a4, h3, d1, f6, d8, f3, h7, e8, f1, f1, b3, f6, f2, h5, f2, c6, b4, e8, d6, a3, e8, a5, e1, d6, h8, h1, a2, d5, d6, h7, b4, g3, b3, h8, e3, a5, h2, d1, e3, g6, h5, a8, e6, b8, g1, a3, a8, h5, b6, c3, f7, b7, d8, a7,'