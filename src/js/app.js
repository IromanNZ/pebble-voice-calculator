const UI = require('ui');
const Voice = require('ui/voice');
const Feature = require('platform/feature');

var a = 0;
var operation = '';
var b = 0;
var c = null;

const operations = {
  '+': ['+', 'plus', 'add', 'плюс', 'прибав'],
  '-': ['-', 'minus', 'subtr', 'мин', 'выч'],
  'x': [' x ', 'times', ' X ', '*', 'множ', ' Х ', ' х '],
  '÷': ['/', 'divi', 'дели']
}

var main = new UI.Card({
  status: false,
  title: '   Voice Calc',
  subtitle: Feature.microphone('Say the expression', 'No mic'),
  body: Feature.microphone('by pressing on "select".', 'This app requires a microphone.'),
});

main.show();

main.on('click', 'select', function(e) {
  if (!Feature.microphone())
    return console.log('No microphone');
  Voice.dictate('start', false, function(e) {
    if (e.err) {
        console.log('Error: ' + e.err);
        return;
    }
    console.log('Dictate: ' + e.transcription);

    parsing(e.transcription);

    if (isNaN(a) && !isNaN(c)) {
      a = c;
    }

    c = calculate(a, operation, b);

    if (isNaN(c) || isNaN(b) || operation === '') {
      main.subtitle('Error! \nTry again.');
      main.body('Heard: ' + e.transcription);
    } else {
      main.subtitle(a + ' ' + operation + ' ' + b + ' = ' + c);
      main.body('');
    }
  });
});

function parsing(speech) {
  var words = speech.replace(/[0-9]/g, '');
  var digits = speech.split(words);

  operation = findInOperations(words);
  a = parseInt(digits[0]);
  b = parseInt(digits[1]);
}

function findInOperations(words) {
  words = words.toLowerCase()
  for (property in operations) {
    for (var i = 0; i < operations[property].length; i++) {
      if (words.indexOf(operations[property][i]) != -1) {
        console.log("Match found: " + operations[property][i]);
        return property;
      }
    }
  }
  console.log("No match found!");
  return '';
}

function calculate(a, operation, b) {
  var c = 0;

  if (operation === '+') {
    c = a + b
  } else if (operation === '-') {
    c = a - b
  } else if (operation === 'x') {
    c = a * b
  } else if (operation === '÷') {
    c = a / b
  }

  console.log('Calculate = ' + c);
  return c;
}