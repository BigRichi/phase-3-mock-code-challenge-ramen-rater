/************** GLOBAL VARIABLES **************/

const ramenMenu = document.querySelector('#ramen-menu')
const ramenDisplay = document.querySelector('#ramen-detail')

const ramenUpdateForm = document.querySelector('#ramen-rating')
const ramenCreateForm = document.querySelector('#new-ramen')

const deleteButton = document.createElement('button')
deleteButton.textContent = "X"
ramenDisplay.append(deleteButton)

const ramenUrl = 'http://localhost:3000/ramens'

// function renderAllRamen(){
fetch(ramenUrl)
    .then(res => res.json())
    .then(ramenMenu => {
        ramenMenu.forEach(ramen =>{
            displayRamen(ramen)
        })
    })
// } 

function displayRamen(ramen){
    const ramenImg = document.createElement('img')
    ramenImg.src = ramen.image
    ramenImg.dataset.id = ramen.id
    ramenImg.id = ramen.id
    ramenMenu.append(ramenImg)
}
function displayFirstRamen(){
    fetch(ramenUrl)
        .then(res => res.json())
        .then(ramenObj => {
            ramenDisplay.dataset.id = ramenObj[0].id
            ramenDisplay.querySelector('img').src = ramenObj[0].image
            ramenDisplay.querySelector('h2').textContent = ramenObj[0].name
            ramenDisplay.querySelector('h3').textContent = ramenObj[0].restaurant
            ramenUpdateForm.rating.value = ramenObj[0].rating
            ramenUpdateForm.comment.value = ramenObj[0].comment

        })
    }

    displayFirstRamen()

/************** Ramen Menu event Selector **************/
    
    ramenMenu.addEventListener('click', function(event){
    if (event.target.matches('img')){
        fetch(`${ramenUrl}/${event.target.dataset.id}`)
            .then(res => res.json())
            .then(ramenObj => {
                ramenDisplay.dataset.id = ramenObj.id
                ramenDisplay.querySelector('img').src = ramenObj.image
                ramenDisplay.querySelector('h2').textContent = ramenObj.name
                ramenDisplay.querySelector('h3').textContent = ramenObj.restaurant
                ramenUpdateForm.rating.value = ramenObj.rating
                ramenUpdateForm.comment.value = ramenObj.comment                
            })       
    }
})

/************** Ramen rating and comment update **************/

ramenUpdateForm.addEventListener('submit', function(event){
    event.preventDefault()

    const newRating = ramenUpdateForm.rating.value
    const newComment =ramenUpdateForm.comment.value

    fetch(`${ramenUrl}/${event.target.previousElementSibling.dataset.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ 
            rating: newRating,
            comment: newComment
         })
    })
        .then(response => response.json())
})

/************** Ramen create Form **************/

ramenCreateForm.addEventListener('submit', function(event){
    event.preventDefault()

    const name = ramenCreateForm.name.value
    const restaurant = ramenCreateForm.restaurant.value
    const image = ramenCreateForm.image.value
    const rating = ramenCreateForm.rating.value
    const comment = ramenCreateForm[4].value


    fetch(ramenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({name, restaurant, image, rating, comment})
    })
        .then(response => response.json())
        .then(ramenItem => {
            displayRamen(ramenItem)
        })
    ramenCreateForm.reset()
})

deleteButton.addEventListener('click', function(event){
    const parentDivId = event.target.closest('div').dataset.id
    fetch(`${ramenUrl}/${parentDivId}`,{
        method: 'DELETE'
    })
    ramenMenu.querySelector(`img[data-id='${parentDivId}']`).remove()
    displayFirstRamen()
})
