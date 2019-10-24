BASEURL = "http://localhost:3000"
FOOD_URL = BASEURL + "/restaurants"
GAME_URL = BASEURL + "/games"
USER_URL = BASEURL + "/users"

USER = {}
CARD_DATA = {}

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
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify()
    })
    .then(response => response.json())
    .then(data => {
        CARD_DATA = data
        renderPlayGame(CARD_DATA)
    })
}

function fetchLeaderboard() {
    fetch(GAME_URL, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify()
    })
    .then(response => response.json())
    .then(data => loadLeaderboard(data))
}

function gameFetchCreate(userID) {
    fetch(GAME_URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({score: 0, user_id: userID})
    })
    .then(response => response.json())
}

////////// GAME //////////

function renderPlayGame(data) {
    const playButton = document.createElement('button')
    playButton.className = "massive ui button"
    playButton.style = "width: 250px; margin: 100px;"
    playButton.innerText = "Play Now!"
    pageBody.appendChild(playButton)

    playButton.addEventListener('click', () => { 
        clearNode(pageBody)
        renderUserInfo(data) 
    })
}

function renderUserInfo(data) {
    //creates and appends form div to body
    const formDiv = document.createElement('div')
    formDiv.style="width: 400px; margin: auto; padding: 50px;"
    pageBody.appendChild(formDiv)

    //creates and appends header and description to body
    const h2 = document.createElement('h2')
    h2.className = "ui header"
    h2.innerText = "Enter Username Below"
    formDiv.appendChild(h2)

    const h4 = document.createElement('h4')
    h4.className = "ui header"
    h4.innerText = "If you have previously logged in, enter the username from before!"
    formDiv.appendChild(h4)

    formDiv.appendChild(document.createElement('br'))

    //creates form and appends to div
    const form = document.createElement('form')
    form.className = "ui form"
    formDiv.appendChild(form)

    //creates input div and appends to form
    const inputDiv1 = document.createElement('div')
    inputDiv1.className = "field"
    form.appendChild(inputDiv1)

    //creates username text and appends to form
    const usernameDescr = document.createElement('label')
    usernameDescr.innerText = "Username: "
    usernameDescr.style = "text-align: left;"
    inputDiv1.appendChild(usernameDescr)

    //creates username box and appends to form
    const usernameBox = document.createElement('input')
    usernameBox.type = "text"
    usernameBox.id = "user-input"
    usernameBox.name = "username"
    usernameBox.placeholder = "Username"
    inputDiv1.appendChild(usernameBox)

    formDiv.appendChild(document.createElement('br'))

    //creates login button
    const loginbutton = document.createElement('input')
    loginbutton.type = "submit"
    loginbutton.value = "Log In"
    loginbutton.className = "ui button"
    form.appendChild(loginbutton)  

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const userInput = document.querySelector('#user-input').value

        //check database for user, or create a new one
        fetch(USER_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({username: userInput})
        })
        .then(response => response.json())
        .then(currentUser => sortAllFood(data, currentUser))
    })
}

function sortAllFood(data, userObject) {
    USER = userObject
    gameFetchCreate(userObject)
    //takes all items from database and puts them into the allItems array before calling on randomizer
    let allItems = []
    for (let i = 0; i < data.length; i++) {
        let restaurant = data[i].name
        let foods = data[i].foods
        for (let x = 0; x < foods.length; x++) {
            item = {
                name: foods[x].name,
                image: foods[x].image,
                calories: foods[x].calories,
                restaurant: restaurant
            }
            allItems.push(item)
        }
    }
    randomizer(allItems)
}

function randomizer(array) {
    //checks to see if array is empty
    //this is for crazy people who get all 500+ pairs correct
    if (array !== []) {
        const allItems = array
        const gameItems = [...allItems]

        //grabs first item and removes it from gameItems array
        let item1 = gameItems[Math.floor(Math.random() * gameItems.length)]
        let index1 = gameItems.indexOf(item1)
        if (index1 > -1) {
            gameItems.splice(index1, 1)
        }

        //grabs second item and removes it from gameItems array
        let item2 = gameItems[Math.floor(Math.random() * gameItems.length)]
        let index2 = gameItems.indexOf(item2)
        if (index2 > -1) {
            gameItems.splice(index2, 1)
        }
        clearNode(pageBody)
        createDisplayCards(item1, item2)
    } else {
        fetchCards()
    }
}

function createDisplayCards(data1, data2) {
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

    //creates first card's photo img and appends to card1photo
    const card1img = document.createElement('img')
    card1img.src = data1.img_url
    card1img.alt = data1.name
    card1img.src = data1.image
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
    card1span.className = "right floated"
    card1extra.appendChild(card1span)

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
    card2img.src = data2.img_url
    card2img.alt = data2.name
    card2img.src = data2.image
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
    card2span.className = "right floated"
    card2extra.appendChild(card2span)
}


/////////// LEADERBOARD //////////

function loadLeaderboard(data) {
    console.log(data)
}

function renderLeaderboard() {
    console.log("leaderboard content loaded")
}


////////// ABOUT //////////////

function renderAboutInfo() {
    console.log("about info content loaded")
}


////////// CLEAR NODE //////////

function clearNode(node) {
    while(node.firstChild) {
        node.removeChild(node.firstChild)
    }
}