const sign_up = document.querySelector('.sign_up');
const sign_in = document.querySelector('.sign_in');
const main = document.querySelector('.main');
const profile = document.querySelector('.profile');
const notification = document.querySelector('.notification');

const toSignIn = document.getElementById('toSignIn');
toSignIn.addEventListener('click', () => {
  sign_up.style.display = 'none';
  sign_in.style.display = 'block';
});

const toSignUp = document.getElementById('toSignUp');
toSignUp.addEventListener('click', () => {
  sign_in.style.display = 'none';
  sign_up.style.display = 'block';
});

const toProfile = document.getElementById('toProfile');
toProfile.addEventListener('click', () => {
  main.style.display = 'none';
  profile.style.display = 'block';
});

const fromProfile = document.getElementById('fromProfile');
fromProfile.addEventListener('click', () => {
  profile.style.display = 'none';
  main.style.display = 'block';
});

const fromNotification = document.getElementById('fromNotification');
fromNotification.addEventListener('click', () => {
  notification.style.display = 'none';
  main.style.display = 'block';
});


const dpv = document.querySelector('.dpv');
const deposit = document.getElementById('deposit');
const dpBack = document.getElementById('dpBack');
dpBack.addEventListener('click', () => {
  dpv.style.display = 'none';
  profile.style.display = 'block';
})

const wtv = document.querySelector('.wtv');
const withdraw = document.getElementById('withdraw');
const wtBack = document.getElementById('wtBack');
wtBack.addEventListener('click', () => {
  wtv.style.display = 'none';
  profile.style.display = 'block';
})

const trv = document.querySelector('.trv');
const transfer = document.getElementById('transfer');
const trBack = document.getElementById('trBack');
transfer.addEventListener('click', () => {
  profile.style.display = 'none';
  trv.style.display = 'block';
});
trBack.addEventListener('click', () => {
  trv.style.display = 'none';
  profile.style.display = 'block';
})

