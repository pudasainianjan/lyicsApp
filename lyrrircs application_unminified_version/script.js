const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const loading = document.querySelector('.loader');


//*song titles
const songs = ['Ed Sheeran - Perfect','Ed Sheeran - Shape of You','Ed Sheeran - Thinking Out Loud','Maroon 5 - Memories','Ed Sheeran - Photograph'];


//*keep track of song
let songIndex = 2;

//*initially load song details into DOM
loadSong(songs[songIndex]);

//*Update song details 
function loadSong(song){
    title.innerText = song;
    audio.src = `music/${song}.mp3`;
    cover.src = `images/${song}.jpg`;
}

//*Play song
function playSong(){
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');
    audio.play();
}

//*Pause song
function pauseSong(){
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    audio.pause();
}

//*Previous song
function prevSong(){
    songIndex--;

    if(songIndex<0){
        songIndex = songs.length - 1;
    }

    loadSong(songs[songIndex]);
    playSong();
}

//*next song
function nextSong(){
    songIndex++;

    if(songIndex>(songs.length-1)){
        songIndex = 0;
    }

    loadSong(songs[songIndex]);
    playSong();
}

//*Update progress
function updateProgress(e){
    // console.log(e.srcElement.currentTime);
    //destrurcturing
    const {duration, currentTime} = e.srcElement;
    // console.log(duration,currentTime);
    const progreessPerceent = (currentTime/duration)*100;
    progress.style.width = `${progreessPerceent}%`;

    
}

//* Set progrerss bar
function setProgress(e){
    const width = this.clientWidth;     //width of prrogreess containeer
    const clickX = e.offsetX;  //clicked width
    const duration = audio.duration;

    audio.currentTime = (clickX/width) * duration;
    
}

//*Event listeners 
playBtn.addEventListener('click',()=>{
    const isPlaying = musicContainer.classList.contains('play');
    if(isPlaying){
        pauseSong();
    }
    else{
        playSong();
    }
});

//*chnagee song
prevBtn.addEventListener('click',prevSong);
nextBtn.addEventListener('click',nextSong);

//*Time/song update
audio.addEventListener('timeupdate',updateProgress);

//*click on progress bar
progressContainer.addEventListener('click',setProgress);

//*Song ends
audio.addEventListener('ended',nextSong);



//*JAVASCRRIPT FOR CARD FUNCTIONALITY
// (function showCard(){
const cardsContainer = document.getElementById('cards-container');
const prevBtnCard = document.getElementById('prevCard');
const nextBtnCard = document.getElementById('nextCard');
const currentEl = document.getElementById('current');
const showBtn = document.getElementById('show');
const hideBtn = document.getElementById('hide');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const addCardBtn = document.getElementById('add-card');
const clearBtn = document.getElementById('clear');
const addContainer = document.getElementById('add-container');


//*keep track of curreent card
let curreentActiveCard = 0;

//* Store DOM cards
const cardsEl = [];

// //* store card data
// const cardsData = [
//     {
//       question: 'What must a variable begin with?',
//       answer: 'A letter, $ or _'
//     },
//     {
//       question: 'What is a variable?',
//       answer: 'Container for a piece of data'
//     },
//     {
//       question: 'Example of Case Sensitive Variable',
//       answer: 'thisIsAVariable'
//     }
//   ];
const cardsData = getCardsData();

  //* Create all cards
  function createCards(){
      cardsData.forEach((data,index)=>createCard(data,index));
  }
  
  //* Create a single card in the DOM
  function createCard(data,index){
    const card = document.createElement('div');
    card.classList.add('card');
    console.log(index);
    if (index === 0){
        card.classList.add('active');
    }

    card.innerHTML = `
        <div class="inner-card">
          <div class="inner-card-front">
            <p>
              ${data.question}
            </p>
          </div>
          <div class="inner-card-back">
            <p>
              ${data.answer}
            </p>
          </div>
        </div>
    `;

    card.addEventListener('click',()=> card.classList.toggle('show-answer'))

    //* Add to DOM cards
    cardsEl.push(card);

    cardsContainer.appendChild(card);

    updateCurrentText();
  }

  //*show number of cards
  function updateCurrentText(){
    currentEl.innerText = `${curreentActiveCard+1} / ${cardsEl.length}`
  }

  //* Get cards from localstorage
  function getCardsData(){
      const cards = JSON.parse(localStorage.getItem('cards'));
      return cards === null ? [] : cards;
  }

  //*add card to local storage
  function setCardsData(cards){
      localStorage.setItem('cards',JSON.stringify(cards));
      window.location.reload;
  }

  createCards();

  //*Event Listeners

  nextBtnCard.addEventListener('click',()=>{
    cardsEl[curreentActiveCard].className = 'card left';

    curreentActiveCard = curreentActiveCard + 1;
    if(curreentActiveCard > cardsEl.length-1){
        curreentActiveCard = cardsEl.length-1;
    }
    cardsEl[curreentActiveCard].className = 'card active';
    updateCurrentText();
  });

  //*Next card button
  prevBtnCard.addEventListener('click',()=>{
    cardsEl[curreentActiveCard].className = 'card right';

    curreentActiveCard = curreentActiveCard - 1;
    if(curreentActiveCard < 0){
        curreentActiveCard = 0;
    }
    cardsEl[curreentActiveCard].className = 'card active';
    updateCurrentText();
  });

  //*show and hide add container
  showBtn.addEventListener('click',()=>{addContainer.classList.add('show'); window.scrollTo(0, 0); });
  hideBtn.addEventListener('click',()=>addContainer.classList.remove('show'));

  //*add new card
  addCardBtn.addEventListener('click',()=>{
    const question = questionEl.value.trim();
    const answer = answerEl.value.trim();
    if(question && answer){
        const newCard = {question,answer};

        cardsData.length === 0? createCard(newCard,0):createCard(newCard);
        questionEl.value ='';
        answerEl.value ='';

        addContainer.classList.remove('show');

        cardsData.push(newCard);

        setCardsData(cardsData);  //* to localstorrage
    }
  });

  //*clear cards button
  clearBtn.addEventListener('click',()=>{
    localStorage.clear();
    cardsContainer.innerHTML ='';
    window.location.reload();
  });
  console.log(cardsData.length);
// })();







//*LYICS SEARCH AND LIST
const SearchForm = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

// Search by song or artist
async function searchSongs(term) {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showData(data);
}

// Show song and artist in DOM
function showData(data) {
  result.innerHTML = `
    <ul class="songs">
      ${data.data
        .map(
          song => `<li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Add Lyrics</button>
    </li>`
        )
        .join('')}
    </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
      ${
        data.prev
          ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
          : ''
      }
      ${
        data.next
          ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
          : ''
      }
    `;
  } else {
    more.innerHTML = '';
  }
}

// Get prev and next songs
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

//* Get lyrics for song
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

   if (data.error) {
        result.innerHTML = data.error;
   } else {
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

      const question = `<h2><stong>${artist}</strong>- ${songTitle}</h2>`;
      const answer = lyrics;
      if(lyrics){
        const newCard = {question,answer};

        cardsData.length === 0? createCard(newCard,0):createCard(newCard);
        questionEl.value ='';
        answerEl.value ='';

        addContainer.classList.remove('show');

        cardsData.push(newCard);

        setCardsData(cardsData);  //* to localstorrage
    }
    else{
      result.innerHTML =`<h2>Sorry we dont have lyrics for this song...</h2>`;
    }
  }

  more.innerHTML = '';
}

// Event listeners
SearchForm.addEventListener('submit', e => {
  // element which needs to be scrolled to
  var element = document.querySelector(".song-lists");
  // scroll to element
  element.scrollIntoView();

  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    // searchSongs(searchTerm);
    showLoading(searchTerm);
  }
});

// Get lyrics button click
result.addEventListener('click', e => {
  const clickedEl = e.target;

  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
});


// *Loader
//* show loader and fetch  posts

function showLoading(searchTerm) {
  console.log(loading);
  loading.classList.add('show');

  setTimeout(() => {
    loading.classList.remove('show');

    setTimeout(() => {
      searchSongs(searchTerm);
    }, 300);
  }, 1000);
}




 
  




