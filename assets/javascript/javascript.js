
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBB-BP1iKzCpHUGQmxcfbG-sqrg57m-cE8",
    authDomain: "train-scheduler-e0936.firebaseapp.com",
    databaseURL: "https://train-scheduler-e0936.firebaseio.com",
    projectId: "train-scheduler-e0936",
    storageBucket: "train-scheduler-e0936.appspot.com",
    messagingSenderId: "662548126526"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var trainName = "";
  var destination = "";
  var startTime = "";
  var frequency = 0;


// takes entered values and pushes them to firebase if all fields filled
$("#submit").on("click", function(event){
    event.preventDefault();

    if($("#train-imput").val().trim()===""||
    $("#destination-imput").val().trim()===""||
    $("#start-imput").val().trim()===""||
    $("#frequency-imput").val().trim()===""){
        alert("missing");
    } else {

        
        var trainName = $("#train-imput").val().trim();
        var destination = $("#destination-imput").val().trim();
        var startTime = $("#start-imput").val().trim();
        var frequency = $("#frequency-imput").val().trim();
        
        database.ref().push({
            trainName: trainName,
            destination: destination,
            startTime: startTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
            
        });
    }
});

// adds information from firebase to populate new row
database.ref().on(
    "child_added", function(childSnapShot){
        console.log(childSnapShot.val().trainName);

        var trainName = childSnapShot.val().trainName;
        var destination = childSnapShot.val().destination;
        var startTime = childSnapShot.val().startTime;
        var frequency = childSnapShot.val().frequency;
        key=childSnapShot.key;
        console.log(childSnapShot)

        var firstTrain = startTime;

        var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1,"y");
        var timeDiff = moment().diff(moment(firstTrainConverted), "minutes");
        var remainTime = timeDiff % frequency;
        var toArrival = frequency - remainTime;
        var nextTrain = moment().add(toArrival,"minutes");
        var theArrival = moment(nextTrain).format("hh:mm a");
        

        var newRow = $("<tr>");

        newRow.attr("data-key");
        // newRow.addClass("the-row");
        newRow.append("<td>"+trainName+"</td>");
        newRow.append("<td>"+childSnapShot.val().destination+"</td>");
        newRow.append("<td class='text-center'>"+frequency+"</td>");
        newRow.append("<td class='text-center'>"+theArrival+"</td>");
        newRow.append("<td class='text-center'>"+toArrival+"</td>");
        newRow.append("<td class='text-center'>"+"<button class='the-row btn btn-danger' data-key='"+key+"'>"+"remove"+"</button>"+"</td>");

        $("#train-table-rows").append(newRow);
    }
);

$("body").on("click", ".the-row", function(){
    console.log("remove clicked");
    keyref = $(this).attr("data-key");
  database.ref().child(keyref).remove();
  window.location.reload();
})