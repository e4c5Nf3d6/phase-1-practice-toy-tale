let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// Fetch Requests
fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then(data => {
    data.forEach(toy => renderToy(toy))
  })

function pushToy(obj) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(obj)
  })
  .then(res => res.json())
  .then(toy => renderToy(toy))
}

function updateLikes(toy) {
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      "likes": toy.likes
    })
  })  
  .then(res => res.json())
  .then(toy => {
    document.querySelector(`[toyId = '${toy.id}']`).textContent = `${toy.likes} likes`
  })
}

// Render Toy
function renderToy(toy) {
  const toysDiv = document.querySelector('#toy-collection')
  const toyCard = document.createElement('div')
  toyCard.className = 'card'
   
  const toyName = document.createElement('h2')
  toyName.textContent = toy.name
  toyCard.appendChild(toyName)

  const toyImage = document.createElement('img')
  toyImage.src = toy.image
  toyImage.className = 'toy-avatar'
  toyCard.appendChild(toyImage)

  const toyLikes = document.createElement('p')
  toyLikes.textContent = `${toy.likes} likes`
  toyLikes.setAttribute('toyId', toy.id)
  toyCard.appendChild(toyLikes)

  const likeBtn = document.createElement('button')
  likeBtn.className = 'like-btn'
  likeBtn.setAttribute('id', toy.id)
  likeBtn.textContent = 'like'
  likeBtn.addEventListener('click', () => {
    toy.likes += 1
    updateLikes(toy)
  })
  toyCard.appendChild(likeBtn)

  toysDiv.appendChild(toyCard)
}

// Create Toy
function createToy(e) {
  e.preventDefault()
  const toyObj = {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0
  }

  pushToy(toyObj)

  document.querySelector('.add-toy-form').reset()
}

// Event Listeners
document.querySelector('.add-toy-form').addEventListener('submit', createToy)