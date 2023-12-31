let params = new URL(window.location.href); //get URL of search bar
let toReturn = params.searchParams.get("return"); //get value for key "id"
let toReturnVendorID = params.searchParams.get("vendorID");
const pickUpBtn = document.getElementById("pickUpBtn");
const returnBtn = document.getElementById("returnBtn");
const cancelBtn = document.getElementById("cancelBtn");
const pendingPickUpMessage =
  '<h1 class="header-message">Time Remaining for Pick Up:</h1>';
const pendingReturnMessage =
  '<h1 class="header-message">Time Remaining for Return:</h1>';

/**
 * Renders the vendor card with the provided vendor ID and pick-up status.
 * @param {string} vendorID - The ID of the vendor.
 * @param {boolean} isPickedUp - Indicates whether the umbrella has been picked up.
 * @returns {Promise<void>}
 */
async function renderVendorCard(vendorID, isPickedUp) {
  // Get vendor information
  let vendorDoc = await db.collection("vendors").doc(vendorID).get();
  let vendorData = vendorDoc.data();
  let vendorThumbnail = vendorData.thumbnail;
  const vendorCard = document.getElementById("my-umbrella-card");
  document
    .querySelector(".hi-user-name")
    .insertAdjacentHTML(
      "afterend",
      isPickedUp ? pendingReturnMessage : pendingPickUpMessage,
    );

  vendorCard.querySelector("#card-title").innerHTML = isPickedUp
    ? "Pending Return"
    : "Pending Pick Up";
  vendorCard.querySelector("#card-vendor-name").innerHTML = vendorData.name;
  vendorCard.querySelector("#card-vendor-address").innerHTML =
    vendorData.address;
  vendorCard.querySelector("#card-vendor-link").innerHTML =
    `Find store<div class="material-symbols-outlined">location_on</div>`;
  vendorCard.querySelector("#card-vendor-link").href =
    `main.html?vendorCoord=${vendorData.lng},${vendorData.lat}`;
  vendorCard.querySelector("#card-vendor-google").innerHTML =
    `Get Direction<div class="material-symbols-outlined">assistant_direction</div>`;
  vendorCard.querySelector("#card-vendor-google").href =
    `http://maps.google.com?q=${vendorData.lat}, ${vendorData.lng}`;
  vendorCard.querySelector("#card-vendor-img").src =
    vendorThumbnail || `./images/vendors/${vendorData.code}.png`;

  vendorCard.style.display = "block";

  renderModal();
}

/**
 * Handles the cancellation of the current reservation for the current user.
 * @param {firebase.firestore.DocumentReference} currentUser - The reference to the current user document.
 * @returns {Promise<void>}
 */
async function handleCancelReservation(currentUser) {
  await currentUser.update({
    currentReservation: false,
  });

  // location.reload();
  delayedReloadForDemo();
}

/**
 * Handles the return of the umbrella for the current user's current reservation.
 * @param {firebase.firestore.DocumentReference} currentUser - The reference to the current user document.
 * @param {firebase.firestore.DocumentReference} currentReservation - The reference to the current reservation document.
 * @returns {Promise<void>}
 */
async function handleReturn(currentUser, currentReservation) {
  // get vendor id for current reservation
  const currentReservationDoc = await currentReservation.get();
  const { vendorId } = currentReservationDoc.data();
  // register return to current reservation
  const registerReturnToUser = currentReservation.update({
    returnVendorId: toReturnVendorID || vendorId,
    returnTime: firebase.firestore.FieldValue.serverTimestamp(),
    isReturned: true,
  });
  // increment umbrella count to vendor
  const incrementUmbrellaCount = db
    .collection("vendors")
    .doc(toReturnVendorID || vendorId)
    .update({
      umbrellaCount: firebase.firestore.FieldValue.increment(1),
    });

  // De-register current reservation from user
  const deregisterReservationToUser = currentUser.update({
    currentReservation: false,
  });

  await Promise.allSettled([
    registerReturnToUser,
    incrementUmbrellaCount,
    deregisterReservationToUser,
  ]);
  // location.reload();
  delayedReloadForDemo();
}

/**
 * Handles the pick-up of the umbrella for the current user's current reservation.
 * @param {firebase.firestore.DocumentReference} currentReservation - The reference to the current reservation document.
 * @returns {Promise<void>}
 */
async function handlePickUp(currentReservation) {
  // register pickup (isPickedUp) to current reservation
  const registerPickUpToUser = currentReservation.update({
    isPickedUp: true,
    pickedUpTime: firebase.firestore.FieldValue.serverTimestamp(),
  });

  // get vendor id for current reservation
  const currentReservationDoc = await currentReservation.get();
  const { vendorId } = currentReservationDoc.data();
  // decrement umbrella count to vendor
  const decrementUmbrellaCountToVendor = db
    .collection("vendors")
    .doc(vendorId)
    .update({
      umbrellaCount: firebase.firestore.FieldValue.increment(-1),
    });

  await Promise.allSettled([
    registerPickUpToUser,
    decrementUmbrellaCountToVendor,
  ]);
  // location.reload();
  delayedReloadForDemo();
}

/**
 * Main function for the My Umbrella page.
 * @returns {Promise<void>}
 */
async function myUmbrellaMain() {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      // get user's info and display name
      const currentUser = db.collection("users").doc(user.uid);
      const currentUserDoc = await currentUser.get();
      const { name: userFullName, currentReservation: currentReservationId } =
        currentUserDoc.data();
      document.getElementById("userFullName").innerText = userFullName;

      if (currentReservationId) {
        const currentReservation = db
          .collection("Reservations")
          .doc(currentReservationId);

        currentReservation.onSnapshot((doc) => {
          sessionStorage.setItem(
            "currentReservation",
            JSON.stringify({
              ...doc.data(),
              id: doc.id,
            }),
          );
          const {
            isPickedUp,
            isReturned,
            pickedUpTime,
            reservationTime,
            vendorId,
          } = doc.data();

          // If umbrella reserved but is not picked up
          if (!isPickedUp) {
            // get reservationTime for timer
            initTimer(reservationTime, false);
            renderVendorCard(vendorId, false);
            pickUpBtn.style.display = "block";
            pickUpBtn.addEventListener("click", () => {
              displayLoadingScreen("Confirming your pickup...");
              handlePickUp(currentReservation);
            });

            cancelBtn.style.display = "block";
            cancelBtn.addEventListener("click", () => {
              displayLoadingScreen("Canceling your reservation...");
              handleCancelReservation(currentUser);
            });

            return;
          } else {
            // if umbrella reserved and picked up
            initTimer(pickedUpTime, true);
            renderVendorCard(vendorId, true);
            pickUpBtn.style.display = "none";
            document.getElementById("return-details-btn").style.display =
              "block";
            document.getElementById("mainBtn").innerHTML = "Return";
            returnBtn.style.display = "block";
            returnBtn.addEventListener("click", () => {
              displayLoadingScreen("Confirming your return...");
              handleReturn(currentUser, currentReservation);
            });
          }

          if (isReturned) {
            pickUpBtn.style.display = "none";
            returnBtn.style.display = "none";
          }
        });
      } else {
        const noReservationCard =
          '<div class="my-umbrella-no-reservation" id="no-reservation-message"><h1>You Have No Reservation!</h1></div>';
        document
          .querySelector(".content-container")
          .insertAdjacentHTML("beforeend", noReservationCard);
      }
    } else {
      throw new Error("No user is logged in."); // Log a message when no user is logged in
    }
    removeLoader();
  });
}

/**
 * Renders and controls the behavior of a modal.
 * @returns {void}
 */
function renderModal() {
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("mainBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  };

  // When the user clicks on <span>, close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
  if (toReturn === "true") {
    modal.style.display = "block";
  }
  // document.addEventListener("DOMContentLoaded", (event) => {
  //   log.textContent += "DOMContentLoaded\n";
  // });
}

function delayedReloadForDemo() {
  setTimeout(() => {
    location.reload();
  }, 1500);
}

myUmbrellaMain();
renderReservationQRCode();
