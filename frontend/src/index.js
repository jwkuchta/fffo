BASEURL = "http://localhost:3000"
FOOD_URL = BASEURL + "/restaurants"
GAME_URL = BASEURL + "/games"
USER_URL = BASEURL + "/users"

USER = {}
CARD_DATA = {}
GAME = {}
LEADERBOARD = {}

const pageBody = document.querySelector('#body-segment')
const gameTab = document.querySelector('#game-tab')
const leaderboardTab = document.querySelector('#leaderboard-tab')
const aboutTab = document.querySelector('#about-tab')

document.addEventListener('DOMContentLoaded', () => {
    fetchCards()
    fetchLeaderboard()

    //switches to game tab and updates active status
    gameTab.addEventListener('click', () => {
        clearNode(pageBody)
        gameTab.className = "active item"
        leaderboardTab.className = "item"
        aboutTab.className = "item"
        renderPlayGame(CARD_DATA)
    })
    //switches to leaderboard tab and updates active status
    leaderboardTab.addEventListener('click', () => {
        clearNode(pageBody)
        gameTab.className = "item"
        leaderboardTab.className = "item active"
        aboutTab.className = "item"
        renderLeaderboard()
    })
    //switches to about tab and updates active status
    aboutTab.addEventListener('click', () => {
        clearNode(pageBody)
        gameTab.className = "item"
        leaderboardTab.className = "item"
        aboutTab.className = "item active"
        renderAboutInfo()
    })
})


//////// FETCHES /////////////

function fetchCards() {
  fetch(FOOD_URL, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify()
  })
    .then(response => response.json())
    .then(data => {
      CARD_DATA = data;
      renderPlayGame();
    });
}

function fetchLeaderboard() {
  fetch(GAME_URL, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify()
  })
    .then(response => response.json())
    .then(data => LEADERBOARD = data)
}

function gameFetchCreate(userID) {
    fetch(GAME_URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ score: 0, user_id: userID })
    })
    .then(response => response.json())
    .then(data => {
        GAME = data
        displayScore()
        document.querySelector('#current-game-score').innerText = data['score']
    })
}

function gameScoreUpdateFetch() {
    fetch(GAME_URL + "/" + GAME['id'], {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify()
    })
    .then(response => response.json())
    .then(data => {
        GAME = data
        document.querySelector('#current-game-score').innerText = data['score']
    })
}

////////// GAME //////////

function renderPlayGame() {
  const playButton = document.createElement("button");
  playButton.className = "massive ui button";
  playButton.style = "width: 250px; margin: 100px;";
  playButton.innerText = "Play Now!";
  pageBody.appendChild(playButton);

  playButton.addEventListener("click", () => {
    clearNode(pageBody);
    renderUserInfo();
  });
}

function renderUserInfo() {
  //creates and appends form div to body
  const formDiv = document.createElement("div");
  formDiv.style = "width: 400px; margin: auto; padding: 50px;";
  pageBody.appendChild(formDiv);

  //creates and appends header and description to body
  const h2 = document.createElement("h2");
  h2.className = "ui header";
  h2.innerText = "Enter Username Below";
  formDiv.appendChild(h2);

  const h4 = document.createElement("h4");
  h4.className = "ui header";
  h4.innerText =
    "If you have previously logged in, enter the username from before!";
  formDiv.appendChild(h4);

  formDiv.appendChild(document.createElement("br"));

  //creates form and appends to div
  const form = document.createElement("form");
  form.className = "ui form";
  formDiv.appendChild(form);

  //creates input div and appends to form
  const inputDiv1 = document.createElement("div");
  inputDiv1.className = "field";
  form.appendChild(inputDiv1);

  //creates username text and appends to form
  const usernameDescr = document.createElement("label");
  usernameDescr.innerText = "Username: ";
  usernameDescr.style = "text-align: left;";
  inputDiv1.appendChild(usernameDescr);

  //creates username box and appends to form
  const usernameBox = document.createElement("input");
  usernameBox.type = "text";
  usernameBox.id = "user-input";
  usernameBox.name = "username";
  usernameBox.placeholder = "Username";
  inputDiv1.appendChild(usernameBox);

  formDiv.appendChild(document.createElement("br"));

  //creates login button
  const loginbutton = document.createElement("input");
  loginbutton.type = "submit";
  loginbutton.value = "Log In";
  loginbutton.className = "ui button";
  form.appendChild(loginbutton);

  form.addEventListener("submit", e => {
    e.preventDefault();
    const userInput = document.querySelector("#user-input").value;

    //check database for user, or create a new one
    fetch(USER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ username: userInput })
    })
      .then(response => response.json())
      .then(currentUser => sortAllFood(CARD_DATA, currentUser));
  });
}

function sortAllFood(data, userObject) {
  USER = userObject;
  gameFetchCreate(userObject);
  //takes all items from database and puts them into the allItems array before calling on randomizer
  let allItems = [];
  for (let i = 0; i < data.length; i++) {
    let restaurant = data[i].name;
    let foods = data[i].foods;
    for (let x = 0; x < foods.length; x++) {
      item = {
        name: foods[x].name,
        image: foods[x].image,
        calories: foods[x].calories,
        restaurant: restaurant
      };
      allItems.push(item);
    }
  }
  randomizer(allItems);
}

function randomizer(array) {
  //checks to see if array is empty
  //this is for crazy people who get all 500+ pairs correct
  if (array !== []) {
    const allItems = array;
    const gameItems = [...allItems];

    //grabs first item and removes it from gameItems array
    let item1 = gameItems[Math.floor(Math.random() * gameItems.length)];
    let index1 = gameItems.indexOf(item1);
    if (index1 > -1) {
      gameItems.splice(index1, 1);
    }

    //grabs second item and removes it from gameItems array
    let item2 = gameItems[Math.floor(Math.random() * gameItems.length)];
    let index2 = gameItems.indexOf(item2);
    if (index2 > -1) {
      gameItems.splice(index2, 1);
    }
    clearNode(pageBody);
    createDisplayCards(item1, item2, gameItems);
  } else {
    allItems = CARD_DATA;
    randomizer(allItems);
  }
}

function createDisplayCards(data1, data2, array) {
    ///////// First CARD /////////

    //creates div for both cards
    const cardDiv = document.createElement('div')
    cardDiv.className = "ui two link cards"
    cardDiv.style = "margin-left: 10%; margin-right: 10%;"
    pageBody.appendChild(cardDiv)

    //creates first card's div and appends to main div
    const card1Div = document.createElement('div')
    card1Div.id = "card1"
    card1Div.className = "ui centered card"
    cardDiv.appendChild(card1Div)

    //creates first card's photo div and appends to card1 div
    const card1photo = document.createElement('div')
    card1photo.id = "card1-photo"
    card1photo.className = "image"
    card1Div.appendChild(card1photo)

    //creates first card's photo img and appends to visible content div
    const card1img = document.createElement('img')
    card1img.alt = data1.name
    card1img.src = data1.image
    card1img.style = "height: 300px;"
    card1photo.appendChild(card1img)

    //creates first card's content div and appends to card1 div
    const card1content = document.createElement('div')
    card1content.className = "content center"
    card1Div.appendChild(card1content)

    //creates first card's food name and appends to card1content div
    const card1foodName = document.createElement('div')
    card1foodName.id = "card1-food-name"
    card1foodName.className = "header"
    card1foodName.innerText = data1.name
    card1content.appendChild(card1foodName)

    //creates first card's divider and appends to card1content div
    const card1meta = document.createElement('div')
    card1meta.className = "meta"
    card1meta.innerText = "---"
    card1content.appendChild(card1meta)

    //creates first card's restaurant name and appends to card1content div
    const card1restaurant = document.createElement('div')
    card1restaurant.id = "card1-restaurant-name"
    card1restaurant.className = "description"
    card1restaurant.innerText = data1.restaurant
    card1content.appendChild(card1restaurant)

    //creates first card's extra bottom piece and appends to card1 div
    const card1extra = document.createElement('div')
    card1extra.className = "extra content"
    card1Div.appendChild(card1extra)

    //creates first card's span and appends to card1extra div
    const card1span = document.createElement('span')
    card1span.id = "card1-bottom-bar"
    card1span.className = "center floated"
    card1extra.appendChild(card1span)

    //creates first card's calorie h3
    const card1calorieReveal = document.createElement('h3')
    card1calorieReveal.className = "ui header"
    card1calorieReveal.id = "card1calories"
    card1calorieReveal.innerText = "-"
    card1span.appendChild(card1calorieReveal)

    ///////// SECOND CARD /////////

    //creates second card's div and appends to main div
    const card2Div = document.createElement('div')
    card2Div.id = "card2"
    card2Div.className = "ui centered card"
    cardDiv.appendChild(card2Div)

    //creates second card's photo div and appends to card2 div
    const card2photo = document.createElement('div')
    card2photo.id = "card2-photo"
    card2photo.className = "image"
    card2Div.appendChild(card2photo)
    
    //creates second card's photo img and appends to card2photo
    const card2img = document.createElement('img')
    card2img.alt = data2.name
    card2img.src = data2.image
    card2img.style = "height: 300px;"
    card2photo.appendChild(card2img)

    //creates second card's content div and appends to card2 div
    const card2content = document.createElement('div')
    card2content.className = "content center"
    card2Div.appendChild(card2content)

    //creates second card's food name and appends to card2content div
    const card2foodName = document.createElement('div')
    card2foodName.id = "card2-food-name"
    card2foodName.className = "header"
    card2foodName.innerText = data2.name
    card2content.appendChild(card2foodName)

    //creates second card's divider and appends to card1content div
    const card2meta = document.createElement('div')
    card2meta.className = "meta"
    card2meta.innerText = "---"
    card2content.appendChild(card2meta)

    //creates second card's restaurant name and appends to card1content div
    const card2restaurant = document.createElement('div')
    card2restaurant.id = "card2-restaurant-name"
    card2restaurant.className = "description"
    card2restaurant.innerText = data2.restaurant
    card2content.appendChild(card2restaurant)

    //creates second card's extra bottom piece and appends to card1 div
    const card2extra = document.createElement('div')
    card2extra.className = "extra content"
    card2Div.appendChild(card2extra)

    //creates second card's span and appends to card1extra div
    const card2span = document.createElement('span')
    card2span.id = "card2-bottom-bar"
    card2span.className = "center floated"
    card2extra.appendChild(card2span)

    //creates second card's calorie h3
    const card2calorieReveal = document.createElement('h3')
    card2calorieReveal.className = "ui header"
    card2calorieReveal.id = "card2calories"
    card2calorieReveal.innerText = "-"
    card2span.appendChild(card2calorieReveal)

    //adds event listeners on winning/losing cards depending on calorie #'s
    if (data1["calories"] > data2["calories"]) {
        //data1 = card1 (winning card)
        card1.addEventListener('click', () => {
            document.querySelector('#card1calories').innerText = data1['calories']
            document.querySelector('#card1calories').style = "color: green;"
            document.querySelector('#card2calories').innerText = data2['calories']
            setTimeout( () => {
                gameScoreUpdateFetch()
                fetchLeaderboard()
                randomizer(array)
                displayScore()
            }, 2000)
        })
        card2.addEventListener('click', () => {
            document.querySelector('#card1calories').innerText = data1['calories']
            document.querySelector('#card2calories').innerText = data2['calories']
            document.querySelector('#card2calories').style = "color: red;"
            setTimeout( () => {
                clearNode(pageBody)
                fetchLeaderboard()
                gameOver()
            }, 2000)
        })
    } else {
        //data2 = card2 (winning card)
        card2.addEventListener('click', () => {
            document.querySelector('#card1calories').innerText = data1['calories']
            document.querySelector('#card2calories').innerText = data2['calories']
            document.querySelector('#card2calories').style = "color: green;"
            setTimeout( () => {
                gameScoreUpdateFetch()
                fetchLeaderboard()
                randomizer(array)
                displayScore()
            }, 2000)
        })
        card1.addEventListener('click', () => {
            document.querySelector('#card1calories').innerText = data1['calories']
            document.querySelector('#card1calories').style = "color: red;"
            document.querySelector('#card2calories').innerText = data2['calories']
            setTimeout( () => {
                clearNode(pageBody)
                fetchLeaderboard()
                gameOver()
            }, 2000)
        })
    }
}

function displayScore() {
    //creates div to contain all labels
    const allScores = document.createElement('div')
    allScores.style = "margin-top: 25px;"
    pageBody.appendChild(allScores)

    //creates personal highest record score div and appends to pagebody
    const userHighScoreDiv = document.createElement('div')
    userHighScoreDiv.className = "ui huge label"
    userHighScoreDiv.innerText = "Personal High Score: "
    allScores.appendChild(userHighScoreDiv)

    //calculates personal highest score
    users_games = LEADERBOARD.filter(game => game.user_id === USER['id'])
    user_highest_score = users_games.sort((a, b) => b['score'] - a['score'])

    //adds personal high score to psersonalHighScoreDiv
    const userHighScoreDetail = document.createElement('div')
    userHighScoreDetail.className = "detail"
    userHighScoreDetail.id = "user-high-score"
    userHighScoreDetail.innerText = user_highest_score[0]['score']
    userHighScoreDiv.appendChild(userHighScoreDetail)

    //creates highest record score div and appends to pagebody
    const highScoreDiv = document.createElement('div')
    highScoreDiv.className = "ui huge label"
    highScoreDiv.innerText = "Record High Score: "
    allScores.appendChild(highScoreDiv)

    //calculates leaderboard highest score
    highest_score = LEADERBOARD.sort((a, b) => b['score'] - a['score'])

    //adds high score to highScoreDiv
    const highScoreDetail = document.createElement('div')
    highScoreDetail.className = "detail"
    highScoreDetail.id = "record-high-score"
    highScoreDetail.innerText = highest_score[0]['score']
    highScoreDiv.appendChild(highScoreDetail)

    //creates score div and appends to pagebody
    const scoreDiv = document.createElement('div')
    scoreDiv.className = "ui huge label"
    scoreDiv.innerText = "Score: "
    allScores.appendChild(scoreDiv)

    //adds current game score to scoreDiv
    const scoreDetail = document.createElement('div')
    scoreDetail.className = "detail"
    scoreDetail.id = "current-game-score"
    scoreDiv.appendChild(scoreDetail)
}

function gameOver() {

  console.log("you loose!");
}

/////////// LEADERBOARD //////////

function loadLeaderboard(data) {
  console.log(data);
}

function renderLeaderboard() {
  console.log("leaderboard content loaded");
}

////////// ABOUT //////////////

function renderAboutInfo() {
  console.log("about info content loaded");
}

////////// CLEAR NODE //////////

function clearNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
