console.log("You are currently looking at the console. app.js is active.");

function _(query) {
    // If you don't want jQuery selector, use this
    // slightly faster than jQuery, kinda
    return document.querySelector(query);
}

const DEFAULT = {
    LOAN_AMOUNT: 10000,
    INTEREST: 2.5,
    YEARS: 3,
    PAYMENT: 0,
}

var profiles = {};

var selectedProfile, loanAmount, interestRate, monthsCount;

function controlsEventBind() {
    $("button#btnUpdateTable").on("click", function () {
        let childCount = $("select#loanProfile")[0].childElementCount;

        if (childCount < 1) {
            alert("Create a profile first!");
            return;
        }

        selectedProfile = $("select#loanProfile").val();
        createLoanProfile(selectedProfile);
    });

    $("select#loanProfile").on("change", function () {
        _("input#txtLoans").value = "";
        _("input#txtInterest").value = "";
        _("input#txtYears").value = "";

        selectedProfile = $("select#loanProfile").val();

        let profileData = profiles[selectedProfile];

        if (profileData !== undefined && profileData !== null) {
            loadSelectedProfile(profileData);
        } else {
            tableDisplay();
        }

    });

    $("button#btnNewProfile").on("click", function () {
        let newName = $("input#newProfile").val();

        if (!newName) {
            alert("Enter a name!");
            return;
        }

        if (profiles[newName] !== undefined) {
            alert(`Profile ${newName} already exists!`);
            return;
        }

        $("select#loanProfile").append(`
            <option value="${newName}">${newName}</option>
        `).val(newName).trigger("change");

        profiles[newName] = null;
    });
}

function createLoanProfile(selectedProfile) {
    loanAmount = $("input#txtLoans").val() || DEFAULT.LOAN_AMOUNT;
    interestRate = ($("input#txtInterest").val() || DEFAULT.INTEREST) / 100;
    monthsCount = ($("input#txtYears").val() || DEFAULT.YEARS) * 12;

    let profileData = new LoanProfile({
        loanAmount: loanAmount,
        interestRate: interestRate,
        term: monthsCount,
    });

    profiles[selectedProfile] = profileData;

    tableDisplay(profileData);
}

function loadSelectedProfile(profileData) {
    $("input#txtLoans").val(profileData.loanAmount);
    $("input#txtInterest").val(profileData.interestRate * 100);
    $("input#txtYears").val(profileData.term / 12);

    tableDisplay(profileData);
}

function tableDisplay(profileData) {
    _("tbody#tblLoans").innerHTML = "";

    if (profileData === undefined) return;

    for (let i = 0; i < profileData.term; i += 1) {
        const row = profileData.getMonthData(i);
        appendToTable({
            month: i,
            balance: row.balance,
            toPay: row.toPay,
            interestValue: row.interest,
            principal: row.principal,
            newBalance: row.newBalance,
            payment: row.payment
        });
    }
}

function appendToTable({ month, balance, toPay, interestValue, principal, newBalance, payment }) {
    $("tbody#tblLoans").append(`
        <tr id="rowMonth${month}">
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
                        placeholder="0.00" 
                        id="payment${month}"
                        value="${payment||""}"
                        onKeyUp="paymentTextChange(this,${month})"
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

        _(`td#balance${i}`)   .innerText = (numberFormat(data.balance));
        _(`td#payment${i}`)   .innerText = (numberFormat(data.toPay));
        _(`td#interest${i}`)  .innerText = (numberFormat(data.interest));
        _(`td#principal${i}`) .innerText = (numberFormat(data.principal));
        _(`td#newBalance${i}`).innerText = (numberFormat(data.newBalance));
    }
}

function numberFormat(number, places = 2) {
    let rounded = Math.round(number * Math.pow(10, places)) / Math.pow(10, places);

    let num = parseFloat(rounded).toLocaleString(undefined, { maximumFractionDigits: places });

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

function paymentTextChange(control, monthIndex) {
    let value = stringToNumber(_(`input#payment${monthIndex}`).value);

    profiles[selectedProfile].setMonthData(value, monthIndex);

    updateTableDisplay(monthIndex);
}

function updateAnnum(control) {
    let value = stringToNumber(control.value) * 12;

    _("input#txtInterestAnnum").value = numberFormat(value, 2);
}

function updateInterest(control) {
    let value = stringToNumber(control.value) / 12;

    _("input#txtInterest").value = numberFormat(value, 2);
}

function equalizePayments(monthIndex) {
    let monthly = stringToNumber(_(`td#payment${monthIndex}`).innerText);
    _(`input#payment${monthIndex}`).value = monthly;
    paymentTextChange(_(`input#payment${monthIndex}`), monthIndex);
}