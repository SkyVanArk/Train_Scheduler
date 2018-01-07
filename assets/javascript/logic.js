$(document).ready(function () {

    var config = {
    apiKey: "AIzaSyDUiWsc9gNm9FqDbHfRnFPs-jRlAXR62N4",
    authDomain: "trainscheduler-ab73c.firebaseapp.com",
    databaseURL: "https://trainscheduler-ab73c.firebaseio.com",
    // projectId: "trainscheduler-ab73c",
    storageBucket: "trainscheduler-ab73c.appspot.com",
    messagingSenderId: 540240630123
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $("#newTrain").on("click", function (event) {
    event.preventDefault();
    var destination = $("#destination").val().trim();
    var trainName = $("#Name").val().trim();
    var firstTrain = $("#arrival").val().trim();
    var freq = $("#frequency").val().trim();
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: freq
    });
  });
  database.ref().on("child_added", function (childSnapshot) {
    var newTrain = childSnapshot.val().trainName;
    var newLocation = childSnapshot.val().destination;
    var newFirstTrain = childSnapshot.val().firstTrain;
    var newFreq = childSnapshot.val().frequency;
    var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");
    var tRemainder = diffTime % newFreq;
    var tMinutesTillTrain = newFreq - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var catchTrain = moment(nextTrain).format("HH:mm");
    $("#Train-Schedule").append(
      ' <tr><td>' + newTrain +
      ' </td><td>' + newLocation +
      ' </td><td>' + newFreq +
      ' </td><td>' + catchTrain +
      ' </td><td>' + tMinutesTillTrain + ' </td></tr>');
    $("#trainName, #destination, #firstTrain, #interval").val("");
    return false;
  },
    function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

});

