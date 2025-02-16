// ====================
// FIREBASE SETUP
// ====================

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDEs_RqVTEwUJFhYoj2vCeYwwAqjzT4jgQ",
    authDomain: "spendly-6196a.firebaseapp.com",
    projectId: "spendly-6196a",
    storageBucket: "spendly-6196a.firebasestorage.app",
    messagingSenderId: "608251877252",
    appId: "1:608251877252:web:be58435a8768585c1defd1",
    measurementId: "G-VHN7RBR2NL"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// ====================
// AUTH UI
// ====================

// Create auth HTML elements
document.body.insertAdjacentHTML('afterbegin', `
    <div class="auth-container" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: white;
      z-index: 1000;
      padding: 2rem;
      text-align: center;
    ">
      <h2>Welcome to Spendly!</h2>
      <button id="googleSignIn" style="padding: 10px; margin: 10px;">Continue with Google</button>
      <form id="emailAuth" style="display: inline-block;">
        <input type="email" placeholder="Email" required style="display: block; margin: 10px;">
        <input type="password" placeholder="Password" required style="display: block; margin: 10px;">
        <button type="submit" style="padding: 10px;">Sign In / Sign Up</button>
      </form>
    </div>
  `);

// Get auth elements
const authContainer = document.querySelector('.auth-container');
const googleSignInBtn = document.querySelector('#googleSignIn');
const emailAuthForm = document.querySelector('#emailAuth');

// ====================
// AUTH EVENT LISTENERS
// ====================

// Google Sign-In
googleSignInBtn.addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert('Google sign-in failed: ' + error.message);
    }
  });
  
  // Email/Password Auth
  emailAuthForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert('Authentication failed: ' + error.message);
    }
  });



// ====================
// AUTH STATE LISTENER
// ====================

auth.onAuthStateChanged(async (user) => {
    if (user) {
      // login
      authContainer.style.display = 'none';
      document.querySelector('.main-content').style.display = 'block';
  
      // new user or no
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName || "New User",
          email: user.email,
          createdAt: serverTimestamp()
        });
      }
  
      // jarvis load this in
      loadUserData(user.uid);
      
    } else {
      // byebye
      authContainer.style.display = 'block';
      document.querySelector('.main-content').style.display = 'none';
    }
  });


//================
//BUDGETING LOGIC
//balanceForm
//================

document.getElementById("balanceForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const user = auth.currentUser;
    
    if (!user) {
      alert('Please sign in first!');
      return;
    }
  
    const balance = parseFloat(document.getElementById("startingBalance").value);
  
    if (!isNaN(balance)) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          startingBalance: balance
        }, { merge: true });
  
        alert(`Your starting balance is $${balance.toFixed(2)}!`);
        document.querySelector(".starting-balance").style.display = "none";
        document.querySelector(".expense-tracker").style.display = "block";
        
      } catch (error) {
        alert('Error saving balance: ' + error.message);
      }
    }
  });



// ====================
//BUDGETING LOGIC
// EXPENSE FORM
// ====================

document.getElementById("expenseForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const user = auth.currentUser;
  
    if (!user) {
      alert('Please sign in first!');
      return;
    }
  
    const expenseName = document.getElementById("expenseName").value;
    const expenseAmount = parseFloat(document.getElementById("expenseAmount").value);
  
    if (expenseName && !isNaN(expenseAmount)) {
      try {
        await addDoc(collection(db, 'expenses'), {
          userId: user.uid,
          name: expenseName,
          amount: expenseAmount,
          date: serverTimestamp()
        });
  
        loadUserData(user.uid);
        alert('Expense added successfully!');
        
      } catch (error) {
        alert('Error saving expense: ' + error.message);
      }
    }
  });

  // ====================
// LOAD USER DATA
// ====================

async function loadUserData(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const balance = userDoc.data()?.startingBalance || 0;
  
      const q = query(collection(db, 'expenses'), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
  
      const tableBody = document.querySelector("#expenseTable tbody");
      tableBody.innerHTML = '';
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const date = new Date(data.date.seconds * 1000).toLocaleDateString();
        
        tableBody.innerHTML += `
          <tr>
            <td>${date}</td>
            <td>${data.name}</td>
            <td>$${data.amount.toFixed(2)}</td>
            <td>$${(balance - data.amount).toFixed(2)}</td>
          </tr>
        `;
      });
  
    } catch (error) {
      alert('Error loading data: ' + error.message);
    }
  }