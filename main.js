const webLogo = document.querySelector('.webLogo');
const main = document.querySelector('.main');
const pop_up = document.querySelector('.pop_up');
webLogo.style.display = 'flex';

let upTrend = `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512" style="height: 30px;"><path fill="none" stroke="#2DBC84" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M352 144h112v112"/><path d="M48 368l121.37-121.37a32 32 0 0145.26 0l50.74 50.74a32 32 0 0045.26 0L448 160" fill="none" stroke="#2DBC84" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"/></svg>`;

let downTrend = `<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512" style="height: 30px;"><path fill="none" stroke="#F5455C" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M352 368h112V256"/><path d="M48 144l121.37 121.37a32 32 0 0045.26 0l50.74-50.74a32 32 0 0145.26 0L448 352" fill="none" stroke="#F5455C" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"/></svg>`

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDocs, getDoc, collection, updateDoc, onSnapshot, arrayUnion, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBoAmD_G9ryPYeTOyfeJdhHga9Xwn6VqhY",
  authDomain: "ilixa-c0d56.firebaseapp.com",
  projectId: "ilixa-c0d56",
  storageBucket: "ilixa-c0d56.firebasestorage.app",
  messagingSenderId: "1070895981449",
  appId: "1:1070895981449:web:c3909aca24fe62376ab758"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
console.log('ok')

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userData = (await getDoc(doc(db, 'users', user.uid))).data();
    if (userData.verified) {
      const pName = document.querySelector('.Pname');
      pName.textContent = userData.name;
      const pEmail = document.querySelector('.pEmail');
      pEmail.textContent = userData.email;
      const pPhone = document.querySelector('.pPhone');
      pPhone.textContent = userData.phoneNumber;
      const balance = document.querySelector('.balance');
      balance.textContent = userData.balance;
      const my_balance = document.querySelector('.my_balance');
      my_balance.textContent = userData.balance;

      const notiFunc = async () => {
        const notificationContainer = document.querySelector('.notificationContainer');
        notificationContainer.innerHTML = '';
        const newUserData = (await getDoc(doc(db, 'users', userData.uid))).data();
        const notifications = newUserData.notification;
        notifications.forEach(async (m) => {
          if (m) {
            notificationContainer.innerHTML += `<div class="notice"><div class="noti_head"><span class="noti_heading">${m.heading}</span><span class="noti_date">${m.date}</span></div><div class="noti_data">${m.msg}</div></div>`;
          }
        });
        await updateDoc(doc(db, 'users', userData.uid), {
          notificationInd: false,
        })
      }
      const notiInd = document.querySelector('.notiInd');
      if (userData.notificationInd) {
        notiInd.classList.add('active')
      }

      const notiBox = document.querySelector('.notiBox');
      const notification = document.querySelector('.notification');

      const toNotification = document.getElementById('toNotification');
      toNotification.addEventListener('click', async () => {
        main.style.display = 'none';
        notification.style.display = 'block';
        notiFunc()
      })

      await onSnapshot(doc(db, 'users', userData.uid), async () => {
        const newUserData = (await getDoc(doc(db, 'users', user.uid))).data();
        balance.textContent = newUserData.balance;
        my_balance.textContent = newUserData.balance;
        if (newUserData.notificationInd) {
          notiInd.classList.add('active')
        } else {
          notiInd.classList.remove('active')
        }
      })

      let uID = document.getElementById('uID');
      uID.value = userData.uid;

      document.getElementById('uidCopy').addEventListener('click', () => {
        const input = document.querySelector('input.uidText');
        input.select()
        document.execCommand("copy");
        pop_up.textContent = 'Copied';
        pop_up.classList.add('pop_up_active');
        setTimeout(() => {
          pop_up.classList.remove('pop_up_active');
        }, 1000)
        window.getSelection().removeAllRanges();
      })

      const companies = document.querySelector('.companies');
      const companyCol = (await getDocs(collection(db, 'Companies '))).docs.map(doc => doc.data());
      companyCol.forEach(async (item) => {
        companies.innerHTML += `<button class="company" value="${item.Name}"><span class="com_left"><span title=${item.Name} class="com_status" id="${item.Name}_status"></span>${item.Name}</span><span class="com_right"><span class="com_per" title="${item.Name}" id="${item.Name}_com_per"></span><span class="my_per" title="${item.Name}" id="${item.Name}_my_per"></span></span></button>`;
      });

      const com_status = document.querySelectorAll('.com_status');
      com_status.forEach(async (i) => {
        const companyData = (await getDoc(doc(db, 'Companies ', i.title))).data();
        if (companyData.status) {
          document.getElementById(i.id).innerHTML = upTrend;
        } else {
          document.getElementById(i.id).innerHTML = downTrend;
        }
      })

      const com_per = document.querySelectorAll('.com_per');
      com_per.forEach(async (i) => {
        const companyData = (await getDoc(doc(db, 'Companies ', i.title))).data();
        const myData = (await getDoc(doc(db, 'Companies ', i.title, 'Investors', user.uid))).data()
        document.getElementById(`${i.title}_com_per`).textContent = companyData.Percentage + '%';

        if (myData) {
          if (myData.profit >= 0) {
            document.getElementById(`${i.title}_my_per`).style.background = '#2DBC84';
          } else {
            document.getElementById(`${i.title}_my_per`).style.background = '#F5455C';
          }
          document.getElementById(`${i.title}_my_per`).textContent = ((myData.profit / myData.investment) * 100).toFixed(2) + '%';
          if (myData.profit == 0) {
            document.getElementById(`${i.title}_my_per`).textContent = 0 + '%';
          }
        } else {
          document.getElementById(`${i.title}_my_per`).textContent = 0 + '%';
          document.getElementById(`${i.title}_my_per`).style.background = '#fff';
        }
      })

      const comPage = document.querySelector('.comPage');
      const company_name = document.querySelector('.company_name');
      const total_money = document.querySelector('.total_money');
      const my_inv = document.querySelector('.my_inv');
      const my_profit_percentage = document.querySelector('.my_profit_percentage');
      const dHigh = document.querySelector('.dHigh');
      const dLow = document.querySelector('.dLow');

      const compName = document.querySelector('.compName');
      const compDescription = document.querySelector('.compDescription');
      const compFounded = document.querySelector('.compFounded');
      const compHeadquarters = document.querySelector('.compHeadquarters');

      const company = document.querySelectorAll('.company')
      company.forEach((b) => {
        b.addEventListener('click', async () => {
          main.style.display = 'none';
          webLogo.style.display = 'flex';
          comPage.style.display = 'block';
          const companyData = (await getDoc(doc(db, 'Companies ', b.value))).data();
          const myData = (await getDoc(doc(db, 'Companies ', b.value, 'Investors', user.uid))).data();

          company_name.textContent = companyData.Name;

          compName.textContent = companyData.fName;
          compDescription.textContent = companyData.description;
          compFounded.textContent = companyData.founded;
          compHeadquarters.textContent = companyData.headquarters;

          if (myData) {
            total_money.textContent = (myData.investment + myData.profit).toFixed(2);
            my_inv.textContent = (myData.investment).toFixed(2);
            my_profit_percentage.textContent = `${(((myData.profit)/myData.investment)*100).toFixed(2)}%`;
            dHigh.textContent = (myData.investment + myData.profit + myData.investment * companyData.Percentage * 0.01).toFixed(2);
            dLow.textContent = (myData.investment + myData.profit - myData.investment * companyData.Percentage * 0.01).toFixed(2);
          } else {
            total_money.textContent = 0;
            my_inv.textContent = 0;
            my_profit_percentage.textContent = `${0}%`;
            dHigh.textContent = 0;
            dLow.textContent = 0;
          }
          await onSnapshot(doc(db, 'Companies ', company_name.textContent, 'Investors', userData.uid), async () => {
            const companyData = (await getDoc(doc(db, 'Companies ', company_name.textContent))).data();
            const myData = (await getDoc(doc(db, 'Companies ', company_name.textContent, 'Investors', user.uid))).data();
            if (myData.profit >= 0) {
              total_money.style.color = '#2DBC84';
              my_profit_percentage.style.color = '#2DBC84';
            } else {
              total_money.style.color = '#F5455C';
              my_profit_percentage.style.color = '#F5455C';
            }
            if (myData.profit >= 0) {
              document.getElementById(`${company_name.textContent}_my_per`).style.background = '#2DBC84';
            } else {
              document.getElementById(`${company_name.textContent}_my_per`).style.background = '#F5455C';
            }
            document.getElementById(`${company_name.textContent}_my_per`).textContent = ((myData.profit / myData.investment) * 100).toFixed(2) + '%';

            total_money.textContent = (myData.investment + myData.profit).toFixed(2);
            my_inv.textContent = (myData.investment).toFixed(2);
            my_profit_percentage.textContent = `${(((myData.profit)/myData.investment)*100).toFixed(2)}%`;
            if (myData.profit == 0) {
              my_profit_percentage.textContent = 0 + '%';
              document.getElementById(`${company_name.textContent}_my_per`).textContent = 0 + '%';
            }
            dHigh.textContent = (myData.investment + myData.profit + myData.investment * companyData.Percentage * 0.01).toFixed(2);
            dLow.textContent = (myData.investment + myData.profit - myData.investment * companyData.Percentage * 0.01).toFixed(2);
          })
          webLogo.style.display = 'none';
        })
      })

      const buy = document.getElementById('buy');
      buy.addEventListener('click', async () => {
        const newUserData = (await getDoc(doc(db, 'users', userData.uid))).data();
        const myData = (await getDoc(doc(db, 'Companies ', company_name.textContent, 'Investors', user.uid))).data();
        const companyData = (await getDoc(doc(db, 'Companies ', company_name.textContent))).data();
        const investment_amount = parseFloat(document.getElementById('investment_amount').value);
        if (investment_amount <= newUserData.balance) {
          webLogo.style.display = 'flex';
          if (myData) {
            await updateDoc(doc(db, 'Companies ', company_name.textContent, 'Investors', userData.uid), {
              profit: 0,
              investment: parseFloat((myData.investment + myData.profit + investment_amount).toFixed(2)),
            })
            await updateDoc(doc(db, 'Companies ', company_name.textContent), {
              capital: companyData.capital + investment_amount + myData.profit,
            })
          } else {
            await setDoc(doc(db, 'Companies ', company_name.textContent, 'Investors', userData.uid), {
              uid: userData.uid,
              profit: 0,
              investment: parseFloat((investment_amount).toFixed(2)),
            })
            await updateDoc(doc(db, 'Companies ', company_name.textContent), {
              capital: companyData.capital + investment_amount,
            })
          }
          await updateDoc(doc(db, 'users', userData.uid), {
            balance: newUserData.balance - investment_amount,
          })
        } else {
          pop_up.textContent = 'You don’t have enough money to buy';
          pop_up.classList.add('pop_up_active');
          setTimeout(() => {
            pop_up.classList.remove('pop_up_active');
          }, 2000)
        }
        webLogo.style.display = 'none';
      })

      const sell = document.getElementById('sell');
      sell.addEventListener('click', async () => {
        const newUserData = (await getDoc(doc(db, 'users', userData.uid))).data();
        const myData = (await getDoc(doc(db, 'Companies ', company_name.textContent, 'Investors', user.uid))).data();
        const companyData = (await getDoc(doc(db, 'Companies ', company_name.textContent))).data();
        const investment_amount = parseFloat(document.getElementById('investment_amount').value);
        if (myData) {
          webLogo.style.display = 'flex';
          if (investment_amount <= myData.profit + myData.investment) {
            await updateDoc(doc(db, 'Companies ', company_name.textContent, 'Investors', userData.uid), {
              profit: 0,
              investment: parseFloat((myData.investment + myData.profit - investment_amount).toFixed(2)),
            })
            await updateDoc(doc(db, 'users', userData.uid), {
              balance: parseFloat((newUserData.balance + investment_amount).toFixed(2)),
            })
            await updateDoc(doc(db, 'Companies ', company_name.textContent), {
              capital: parseFloat((companyData.capital - investment_amount + myData.profit).toFixed(2)),
            })
          } else {
            pop_up.textContent = 'You don’t have enough money to sell';
            pop_up.classList.add('pop_up_active');
            setTimeout(() => {
              pop_up.classList.remove('pop_up_active');
            }, 2000)
          }
        } else {
          pop_up.textContent = 'You have not invested in this company yet.';
          pop_up.classList.add('pop_up_active');
          setTimeout(() => {
            pop_up.classList.remove('pop_up_active');
          }, 2000)
        }
        webLogo.style.display = 'none';
      })


      const fromCom = document.getElementById('fromCom');
      fromCom.addEventListener('click', () => {
        comPage.style.display = 'none';
        main.style.display = 'block';

        company_name.textContent = '';
        total_money.textContent = '';
        my_inv.textContent = '';
        my_profit_percentage.textContent = '';
        dHigh.textContent = '';
        dLow.textContent = '';
      })

      const profile = document.querySelector('.profile');
      const dpCheck = (await getDoc(doc(db, 'deposits', userData.uid))).data();
      const dpv = document.querySelector('.dpv');
      const deposit = document.getElementById('deposit');
      deposit.addEventListener('click', () => {
        if (!dpCheck) {
          profile.style.display = 'none';
          dpv.style.display = 'block';
        } else {
          pop_up.textContent = 'Already applied for deposit.';
          pop_up.classList.add('pop_up_active');
          setTimeout(() => {
            pop_up.classList.remove('pop_up_active');
          }, 2000)
        }
      });

      const dp = document.getElementById('dp');
      dp.addEventListener('click', async () => {
        const dpAmount = parseFloat(document.getElementById('dpAmount').value);
        const dpTrId = document.getElementById('dpTrId').value;
        await setDoc(doc(db, 'deposits', userData.uid), {
          uid: userData.uid,
          amount: dpAmount,
          transactionID: dpTrId,
        })
        location.reload();
      })

      const wtCheck = (await getDoc(doc(db, 'withdraws', userData.uid))).data();
      const wtv = document.querySelector('.wtv');
      const withdraw = document.getElementById('withdraw');
      withdraw.addEventListener('click', () => {
        if (!wtCheck) {
          profile.style.display = 'none';
          wtv.style.display = 'block';
        } else {
          pop_up.textContent = `Already applied for withdraw.`;
          pop_up.classList.add('pop_up_active');
          setTimeout(() => {
            pop_up.classList.remove('pop_up_active');
          }, 2000)
        }
      });

      const wt = document.getElementById('wt');
      wt.addEventListener('click', async () => {
        const newUserData = (await getDoc(doc(db, 'users', userData.uid))).data();
        const wtAmount = parseFloat(document.getElementById('wtAmount').value);
        const acNum = document.getElementById('acNum').value;
        if (wtAmount <= newUserData.balance) {
          await setDoc(doc(db, 'withdraws', userData.uid), {
            uid: userData.uid,
            amount: wtAmount,
            accountNumber: acNum,
          })
          await updateDoc(doc(db, 'users', userData.uid), {
            balance: newUserData.balance - wtAmount,
          })
          location.reload();
        } else {
          pop_up.textContent = `You dont have enough money to withdraw.`;
          pop_up.classList.add('pop_up_active');
          setTimeout(() => {
            pop_up.classList.remove('pop_up_active');
          }, 2000)
        }
      })

      const tr = document.getElementById('tr');
      tr.addEventListener('click', async () => {
        let trAmount = parseFloat(document.getElementById('trAmount').value);
        let trID = document.getElementById('trID').value;
        const fnd_not_found = document.querySelector('.fnd_not_found');
        fnd_not_found.textContent = '';
        const trIDcheck = (await getDoc(doc(db, 'users', trID))).data();

        if (trIDcheck) {
          if (trAmount <= userData.balance) {
            let dateToday = new Date();
            await updateDoc(doc(db, 'users', userData.uid), {
              balance: userData.balance - trAmount,
              notificationInd: true,
              notification: arrayUnion({
                msg: `You have sent ${trAmount} BDT to ${trIDcheck.name}`,
                heading: 'Transfer money',
                date: `${dateToday.getDate()}-${dateToday.getMonth()+1}-${dateToday.getFullYear()}`,
              }),
            })

            await updateDoc(doc(db, 'users', trID), {
              balance: trIDcheck.balance + trAmount,
              notificationInd: true,
              notification: arrayUnion({
                msg: `${userData.name} has sent you ${trAmount} BDT.`,
                heading: 'Transfer money',
                date: `${dateToday.getDate()}-${dateToday.getMonth()+1}-${dateToday.getFullYear()}`,
              }),
            })
            trAmount = '';
            trID = '';
            pop_up.textContent = `Transfer successfull.`;
            pop_up.classList.add('pop_up_active');
            setTimeout(() => {
              pop_up.classList.remove('pop_up_active');
            }, 2000)

          } else {
            pop_up.textContent = `You dont have enough money to send to your friend.`;
            pop_up.classList.add('pop_up_active');
            setTimeout(() => {
              pop_up.classList.remove('pop_up_active');
            }, 2000)
          }
        } else {
          fnd_not_found.textContent = 'Friend not found!';
        }
      })

      webLogo.style.display = 'none';
      main.style.display = 'block'
    } else {
      document.getElementById('emailAddressCopy').addEventListener('click', () => {
        const input = document.querySelector('input.emailAddressText');
        input.select()
        document.execCommand("copy");
        pop_up.textContent = 'Copied';
        pop_up.classList.add('pop_up_active');
        setTimeout(() => {
          pop_up.classList.remove('pop_up_active');
        }, 1000)
        window.getSelection().removeAllRanges();
      })

      document.getElementById('emailSubjectCopy').addEventListener('click', () => {
        const input = document.querySelector('input.emailSubjectText');
        input.select()
        document.execCommand("copy");
        pop_up.textContent = 'Copied';
        pop_up.classList.add('pop_up_active');
        setTimeout(() => {
          pop_up.classList.remove('pop_up_active');
        }, 1000)
        window.getSelection().removeAllRanges();
      })

      const emailText = document.querySelector('.emailText')
      emailText.textContent = `Dear Ilixa,
I am submitting my documents for verification as part of the account verification process. Please find attached the required documents:

[Photo of ID card (both sides)]

Kindly review them at your earliest convenience and let me know if any further information is required. I appreciate your assistance and look forward to your confirmation. Thank you.

[Your Name]
UID: ${userData.uid}`

      document.getElementById('emailCopy').addEventListener('click', () => {
        const input = document.querySelector('textarea.emailText');
        input.select()
        document.execCommand("copy");
        pop_up.textContent = 'Copied';
        pop_up.classList.add('pop_up_active');
        setTimeout(() => {
          pop_up.classList.remove('pop_up_active');
        }, 1000)
        window.getSelection().removeAllRanges();
      })
      webLogo.style.display = 'none';
      const documentVer = document.querySelector('.documentVer');
      documentVer.style.display = 'block';
    }
  } else {
    webLogo.style.display = 'none';
    const forms = document.querySelector('.forms');
    forms.style.display = 'flex';

    const su = document.getElementById('signUp');
    const signUp = async () => {
      const displayName = document.getElementById('displayName').value;
      const phoneNumber = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirm_password = document.getElementById('confirm_password').value;
      const wrongPass = document.querySelector('.wrongPass');
      wrongPass.textContent = '';

      if (password === confirm_password) {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", res.user.uid), {
          name: displayName,
          uid: res.user.uid,
          phoneNumber,
          email,
          password,
          balance: 0,
          notification: [],
          notificationInd: false,
          verified: false,
        });
        location.reload()
      } else {
        wrongPass.textContent = 'Wrong Password';
      }
    }
    su.addEventListener('submit', (e) => {
      e.preventDefault();
      signUp();
    });
    const si = document.getElementById('signIn');
    const signIn = async () => {
      const email = document.getElementById('signIn_email').value;
      const password = document.getElementById('signIn_password').value;
      const in_wrong_pass = document.querySelector('.in_wrong_pass');
      in_wrong_pass.textContent = '';
      try {
        await signInWithEmailAndPassword(auth, email, password);
        location.reload()
      } catch (e) {
        in_wrong_pass.textContent = 'Wrong password.';
      }
    }
    si.addEventListener('submit', (e) => {
      e.preventDefault();
      signIn();
    });
  }
});
