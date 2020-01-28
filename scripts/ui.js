function clearTextBoxes() {
    _("input#txtLoans").value = "";
    _("input#txtInterest").value = "";
    _("input#txtInterestAnnum").value = "";
    _("input#txtYears").value = "";
    _("input#txtTotalInterest").value = "";
    _("input#txtTotalPrincipal").value = "";
    _("input#txtTotalPayment").value = "";
}

function updateAnnum(control) {
    let value = (stringToNumber(control.value) || DEFAULT.INTEREST) * 12;

    _("input#txtInterestAnnum").value = numberFormat(value, 2);
}

function updateInterest(control) {
    let value = (stringToNumber(control.value) || DEFAULT.ANNUM) / 12;

    _("input#txtInterest").value = numberFormat(value, 2);
}

function equalizePayments(monthIndex) {
    let monthly = stringToNumber(_(`td#payment${monthIndex}`).innerText);
    _(`input#payment${monthIndex}`).value = monthly;
    paymentTextChange(_(`input#payment${monthIndex}`), monthIndex);
}

let toastCounter = 0;
function showToastNotification(message, title = "Notification") {
    let toastString = `
    <div class="toast" id="toast-${toastCounter}" role="alert" aria-live="assertive" aria-atomic="true" data-delay="2500" data-animation="true">
        <div class="toast-header">
            <strong class="mr-auto" id="toast-title">${title}</strong>
            <small>${toastCounter}</small>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="toast-body">${message}</div>
    </div>
    `;

    $("div#toasts-container").append(toastString);

    $(`div#toast-${toastCounter}`).toast("show");

    toastCounter += 1;
}

var firstFalse = true;
function appendToTable({
    month,
    balance,
    toPay,
    interestValue,
    principal,
    newBalance,
    payment,
    hasPayment,
}) {
    let isRowDisplayed = true;
    let isHighlighted = false;

    let prevValue = _(`input#payment${month - 1}`);

    if (prevValue !== null) {
        isRowDisplayed = prevValue.value === "" ? false : true;
    }

    if (hasPayment != true) {
        isHighlighted = true;
    }

    $("tbody#tblLoans").append(`
        <tr 
            id="rowMonth${month}" 
            style="
                display: ${isRowDisplayed ? "table-row" : "none"}; 
                background-color: ${
                    isHighlighted ? "rgba(0,255,0,0.5)" : "#FFF"
                };
            "
        >
            <td class="text-center">${month + 1}</td>
            <td class="text-right" 
                id="balance${month}">
                ${numberFormat(balance)}
            </td>
            <td class="text-right" 
                id="payment${month}">
                ${numberFormat(toPay)}
            </td>
            <td class="text-right">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <button 
                            class="btn btn-outline-secondary" 
                            type="button"
                            onClick="equalizePayments(${month});">
                            &gt;&gt;
                        </button>    
                    </div>
                    <input 
                        type="text" 
                        class="form-control text-right" 
                        placeholder="Enter payment" 
                        id="payment${month}"
                        value="${payment > -1 ? payment : ""}"
                        onchange="paymentTextChange(this,${month})"
                    >
                </div>                        
            </td>
            <td class="text-right" 
                id="interest${month}">
                ${numberFormat(interestValue)}
            </td>
            <td class="text-right" 
                id="principal${month}">
                ${numberFormat(principal)}
            </td>
            <td class="text-right" 
                id="newBalance${month}">
                ${numberFormat(newBalance)}
            </td>
        </tr>
    `);
}

function updateTableDisplay(monthIndex) {
    for (let i = monthIndex; i < monthsCount; i++) {
        let data = profiles[selectedProfile].getMonthData(i);

        _(`td#balance${i}`).innerText = numberFormat(data.balance);
        _(`td#payment${i}`).innerText = numberFormat(data.toPay);
        _(`td#interest${i}`).innerText = numberFormat(data.interest);
        _(`td#principal${i}`).innerText = numberFormat(data.principal);
        _(`td#newBalance${i}`).innerText = numberFormat(data.newBalance);
    }
}

function numberFormat(number, places = 2) {
    let rounded =
        Math.round(number * Math.pow(10, places)) / Math.pow(10, places);

    let num = parseFloat(rounded).toLocaleString(undefined, {
        maximumFractionDigits: places,
    });

    let decimals = num.toString().split(".")[1];
    if (decimals === undefined) {
        num += ".".padEnd(places + 1, 0);
    } else if (decimals.length < places) {
        num += "0".padEnd(places - decimals.length);
    }

    return num;
}

function stringToNumber(data) {
    str = data.toString();

    if (str.indexOf(".") > -1) {
        split = str.split(".");

        if (split[1] === undefined) return 0;

        split[0] = split[0].replace(/\D+/g, "");
        split[1] = split[1].replace(/\D+/g, "");

        return parseFloat(`${split[0]}.${split[1]}`);
    } else {
        return str.replace(/\D+/g, "");
    }
}

function updateLoanInformation() {
    let interest = profiles[selectedProfile].getTotalInterest();
    let principal = profiles[selectedProfile].getTotalPrincipal();
    let payment = profiles[selectedProfile].getTotalPayment();

    _("input#txtTotalInterest").value = numberFormat(interest);
    _("input#txtTotalPayment").value = numberFormat(payment);
    _("input#txtTotalPrincipal").value = numberFormat(principal);
}

function showNextRow(monthIndex) {
    let bgWhite = "#FFF";
    let bgGreen = "rgba(0,255,0,0.5)";

    _(`tr#rowMonth${monthIndex}`).style.backgroundColor = bgWhite;

    let nextRow = _(`tr#rowMonth${monthIndex + 1}`);

    if (nextRow !== null && nextRow.style.display != "table-row") {
        nextRow.style.backgroundColor = bgGreen;
        nextRow.style.display = "table-row";
    }
}
