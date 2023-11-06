function sayHello() { }
//sayHello();
//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log('logging out user');
    })
    .catch((error) => {
      // An error happened.
    });
}

function writeVendors() {
  //define a variable for the collection you want to create in Firestore to populate data
  var VendorsRef = db.collection("vendors");

  VendorsRef.add({
    code: "kokoro",
    name: "Kokoro Tokyo mazesoba",
    address: "551 Seymour St, Vancouver, BC V6B3H6",
    hours_of_operation: "11:30am - 9:30pm",
    contact: "(604) 559-8872",
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  VendorsRef.add({
    code: "a&w",
    name: "A&W",
    address: "603 Dunsmuir St, Vancouver, BC V6B 1Y7",
    hours_of_operation: "Open 24/7",
    contact: "(604) 648-0333",
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  VendorsRef.add({
    code: "shoppers",
    name: "Shoppers Drug Mart",
    address: "586 Granville St, Vancouver, BC V6C 1X5",
    hours_of_operation: "Differs by days - Need to fix",
    contact: "(604) 683-4063",
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  VendorsRef.add({
    code: "timhortons",
    name: "Tim Hortons",
    address: "607 Dunsmuir St, Vancouver, BC V6B 1Y7",
    hours_of_operation: "Differs by days - Need to fix",
    contact: "(604) 559-8872",
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

}


function writeReservations() {
  //define a variable for the collection you want to create in Firestore to populate data
  var ReservationsRef = db.collection("Reservations");

  ReservationsRef.add({
    Reserved_time: "2023-11-05 12:25:40",
    user_id: "164wVPeepnP71Ov3N65zFRJ35PD3",
    vendor_id: "6DBRmLCnSSBggluZ5H5u",
    umbrella_id: "0dtH9y3v4yN3zlkBmuDt",
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  ReservationsRef.add({
    Reserved_time: "2023-11-05 10:27:22",
    user_id: "1YYjt6KTVgce3iu1o4PUso0vjza53",
    vendor_id: "Vfllt9nP7BWmc6RYdJhf",
    umbrella_id: "dSd1CeJZ9e6EOF2ciCNz",
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  ReservationsRef.add({
    Reserved_time: "2023-11-05 09:45:49",
    user_id: "MrrhKUGVlLVPbroT7r13Sy3njuX2",
    vendor_id: "ybruxGV5yQ4zrLuaWfOJ",
    umbrella_id: "0dtH9y3v4yN3zlkBmuDt",
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  ReservationsRef.add({
    Reserved_time: "2023-11-06 07:25:20",
    user_id: "6z0GuPuB4DMxQF734GdWYCVqD0g2",
    vendor_id: "6DBRmLCnSSBggluZ5H5u",
    umbrella_id: "iPe5SXxpapsAc9pkuw2h",
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  ReservationsRef.add({
    Reserved_time: "2023-11-03 17:55:35",
    user_id: "MrrhKUGVlLVPbroT7r13Sy3njuX2",
    vendor_id: "nbj8MBuPq4gAVRzkDycD",
    umbrella_id: "lo4s4P9tqE0hReNTYRpG",
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

}