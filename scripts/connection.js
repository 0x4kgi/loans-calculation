var isActive = null;
var reconnectTime = 60000;

function isServerActive(callback) {
    $.ajax("data/check.php", {
        async: false,
        success: callback,
        error: callback,
    });
}

function grabDataFromServer() {
    if (!isActive) return;
    $.ajax("data/Routes/FetchData.php", {
        success: data => loadProfilesFromServer(data),
        error: () => {
            showToastNotification("Something went wrong");
        },
    });
}

function saveDataToServer(params) {
    if (!isActive) return;

    $.ajax("data/Routes/StoreData.php", {
        method: "POST",
        data: params,
        success: data => {
            showToastNotification(`Profile "${params.name}" has been saved!`);
        },
        error: data => {
            showToastNotification(
                `Could not save "${params.name}". ${data.responseText}`
            );
        },
    });
}

function serverCheck(data, status) {
    if (data.status === 200) {
        isActive = true;
        showToastNotification("Retrieving data from server...");
        grabDataFromServer();
    } else if (status === "error") {
        if (isActive == null) {
            createBlankProfile("Default Profile");
        }
        isActive = false;

        showToastNotification(`
            Cannot connect to the server, no data will be saved this session. 
            Retrying in ${reconnectTime / 60000} minute${
                reconnectTime > 60000 ? "s" : ""
            }.
        `);

        tryToReconnect();
    } else {
        showToastNotification(
            "Running in server-less mode, everything will reset upon reload."
        );
        isActive = false;
    }
}

function tryToReconnect() {
    reconnect = setTimeout(() => {
        isServerActive(serverCheck);
    }, reconnectTime);

    reconnectTime *= 2;
}
