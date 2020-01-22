console.log("You are currently looking at the console. connection.js is active.");

function isServerActive() {
    $.ajax("data/check.php", {
        success: function (data) {
            console.log(data);
        },
        error: function (xhr, statcode, error) {
            console.log(xhr)
            console.log(statcode)
            console.log(error)
        },
    });
}

function grabDataFromServer() {

}

function saveDataToServer() {
    
}