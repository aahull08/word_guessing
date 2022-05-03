const ALLOWEDGUESSES = 6

document.addEventListener('DOMContentLoaded', event => {
  const message = document.querySelector("#message");
  const letters = document.querySelector("#spaces")
  const guesses = document.querySelector('#guesses')
  const apples = document.querySelector('#apples')
  const replay = document.querySelector('#replay')

  let randomWord = function(){
    wordArr = ['apple', 'banana', 'orange', 'pear'];
    return function() {
      let index = Math.floor(Math.random() * wordArr.length)
      let word = wordArr.splice(index, 1)[0]
      return word;
    }
  }();

  class Game{
    constructor(){
      this.incorrectGuesses = 0;
      this.lettersGuessed =[];
      this.correctSpaces = 0;
      this.word = randomWord();
      if (this.word === undefined){
        this.displayMessage("Sorry, I've run out of words!");
        return this;
      }
      this.word = this.word.split("");
      this.createBlanks()
    }

    createBlanks(){
      let spaces = (new Array(this.word.length + 1)).join("<span></span>");
      
      let spans = letters.querySelectorAll("span");
      spans.forEach(span => {
        span.parentNode.removeChild(span);
      });
      letters.insertAdjacentHTML('beforeend', spaces);
      this.spaces = document.querySelectorAll("#spaces span");
    }

    displayMessage(text){
      message.textContent = text
    }
  }

let game1;
  function newGame(){
    game1 = new Game();

    document.addEventListener("keydown", clickHandler);
  }

  function clickHandler(event){
    if (validLetter(event.key)){
      game1.lettersGuessed.push(event.key);
      if (game1.word.includes(event.key)){
        let correctIndexes = findIndexes(event.key)
        game1.correctSpaces += correctIndexes.length;
        spans = letters.querySelectorAll("span")
        correctIndexes.forEach(index => {
          spans[index].textContent = event.key
        });
        addGuess(event.key)
      } else {
        game1.incorrectGuesses += 1;
        addGuess(event.key)
        removeApple();
      }
    }

    if (game1.incorrectGuesses === ALLOWEDGUESSES) {
      document.querySelector("body").classList.add("lose")
      replay.classList.add("gameOver");
      message.textContent = "Sorry, You're out of guesses";
      document.removeEventListener('keydown', clickHandler);
    }

    if (game1.correctSpaces === game1.word.length){
      document.querySelector("body").classList.add("win")
      replay.classList.add("gameOver");
      message.textContent = "Good Job You Won!!!!";
      document.removeEventListener('keydown', clickHandler);
    }
  }
  function validLetter(letter){
    return (letter.toLowerCase() >= 'a' &&
            letter.toLowerCase() <= 'z' &&
            !game1.lettersGuessed.includes(letter))
  }

  function removeApple(){
    apples.classList.remove("guess_" + game1.incorrectGuesses - 1)
    apples.classList.add("guess_" + game1.incorrectGuesses)
  }

  function findIndexes(letter){
    let indexes = []
    for (let index = 0; index < game1.word.length; index++) {
      if (letter === game1.word[index]){
        indexes.push(index)
      };
    }
    return indexes
  }

  function addGuess(letter){
    let letterElement = document.createElement("span");
    letterElement.textContent = letter
    guesses.append(letterElement)
  }

  newGame();
  replay.addEventListener("click", event => {
    event.preventDefault();
    apples.className = "";
    document.querySelector("body").className = '';
    spans = guesses.querySelectorAll("span")
    spans.forEach(span => {
      span.remove();
    });
    newGame();
  })

});



