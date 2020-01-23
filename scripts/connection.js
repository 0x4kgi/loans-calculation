var isActive;
var reconnectTime = 4000;

function isServerActive(callback) {
    $.ajax("data/check.php", {
        async: false,
        success: callback,
        error: callback,
    });
}

function grabDataFromServer() {
    
}

function saveDataToServer(profile, data) {
    if(!isActive) return;

    $.ajax("data/update.php", {
        method: "POST",
        data: {
            profile,
            data
        },
        success: function(data) {
            console.log(data);
            showToastNotification("Saved!");
        },
    });
}

function serverCheck(data, status) {
    if (status === "success") {
        isActive = true;
        showToastNotification("Connected to the server!");
    } else if (status === "error") {
        if (isActive == undefined || isActive == null) {
            createBlankProfile("Default Profile");
        }
        isActive = false;

        showToastNotification(`
            You are currently offline, no data will be saved this session. 
            Reconnecting in ${reconnectTime / 1000} seconds
        `);

        reconnect = setTimeout(() => {
            isServerActive(serverCheck);
        }, reconnectTime);

        reconnectTime *= 2;
    } else {
        showToastNotification("Cannot identify if the server is alive or not, try again");
    }
}