/**
 * @fileoverview
 * Handle creating hamburger menu items and footer navigation based on user's login status
 */

/**
 * Loads the skeleton of the page based on the user's authentication status.
 * @returns {void}
 */
function loadSkeleton() {
  firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
      //if the pointer to "user" object is not null, then someone is logged in
      // User is signed in.
      // Do something for the user here.
      console.log($("#navbar").load("./components/nav_after_login.html"));
      $("#footerNav")?.load("./components/footerNav.html");
    } else {
      // No user is signed in.
      console.log($("#navbar").load("./components/nav_before_login.html"));
    }
    const currentUser = await db.collection("users").doc(user.uid).get();
    const currentUserData = currentUser.data();
    sessionStorage.setItem("currentUser", JSON.stringify(currentUserData));
  });
}

loadSkeleton();
