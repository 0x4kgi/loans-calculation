var isActive = null;
var reconnectTime = 4000;

function isServerActive(callback) {
    $.ajax("data/check.php", {
        async: false,
        success: callback,
        error: callback,
    });
}

function grabDataFromServer() {
    if (!isActive) return;

    //$.ajax();
}

function saveDataToServer(params) {
    if (!isActive) return;

    $.ajax("data/update.php", {
        method: "POST",
        data: params,
        success: function (data) {
            showToastNotification(`Profile "${selectedProfile}" has been saved!`);
        },
    });
}

function serverCheck(data, status) {
    console.log(data.status);
    if (data.status === 200) {
        isActive = true;
        showToastNotification("Connected to the server!");
    } else if (status === "error") {
        if (isActive == null) {
            createBlankProfile("Default Profile");
        }
        isActive = false;

        showToastNotification(`
            Cannot connect to the server, no data will be saved this session. 
            Retrying in ${reconnectTime / 1000} seconds
        `);

        reconnect = setTimeout(() => {
            isServerActive(serverCheck);
        }, reconnectTime);

        reconnectTime *= 2;
    } else {
        showToastNotification("Cannot identify if the server is alive or not, try reloading the page again");
        isActive = false;
    }
}