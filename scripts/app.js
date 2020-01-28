function _(query) {
    // If you don't want jQuery selector, use this
    // slightly faster than jQuery, kinda
    return document.querySelector(query);
}

const DEFAULT = {
    LOAN_AMOUNT: 10000,
    INTEREST: 2.5,
    ANNUM: 30,
    YEARS: 3,
    PAYMENT: 0,
};

var profiles = {};

var selectedProfile, loanAmount, interestRate, monthsCount;

var saveDelay = {}; var btnTableUpdate;

function controlsEventBind() {
    clearTextBoxes();

    $("button#btnUpdateTable").on("click", function() {
        let childCount = $("select#loanProfile")[0].childElementCount;

        if (childCount < 1) {
            alert("Create a profile first!");
            return;
        }

        selectedProfile = $("select#loanProfile").val();

        let profileData = profiles[selectedProfile];

        if (profileData === undefined || profileData === null) {
            createLoanProfile(selectedProfile);
            collectDataToSave("add", selectedProfile);
        } else {            
            createLoanProfile(selectedProfile);

            clearTimeout(btnTableUpdate);
            btnTableUpdate = setTimeout(() =>
                collectDataToSave("update", selectedProfile),
                500
            );
        }
    });

    $("select#loanProfile").on("change", function() {
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

    $("button#btnNewProfile").on("click", function() {
        let newName = $("input#newProfile").val();

        clearTextBoxes();

        if (!newName) {
            alert("Enter a name!");
            return;
        }

        if (profiles[newName] !== undefined) {
            alert(`Profile ${newName} already exists!`);
            return;
        }

        createBlankProfile(newName);
    });
}

function createBlankProfile(newName) {
    $("select#loanProfile")
        .append(`<option value="${newName}">${newName}</option>`)
        .val(newName)
        .trigger("change");

    profiles[newName] = null;
}

function createLoanProfile(selectedProfile) {
    loanAmount = $("input#txtLoans").val() || DEFAULT.LOAN_AMOUNT;
    interestRate = $("input#txtInterest").val() || DEFAULT.INTEREST;
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
    $("input#txtInterest").val(numberFormat( profileData.interestRate ));
    $("input#txtInterestAnnum").val(numberFormat( profileData.interestRate * 12 ));
    $("input#txtYears").val(profileData.term / 12);

    //var selectedProfile, loanAmount, interestRate, monthsCount;
    loanAmount = profileData.loanAmount;
    interestRate = profileData.interestRate;
    monthsCount = profileData.term;

    tableDisplay(profileData);
}

function loadProfilesFromServer(data) {
    let profileArrayData = JSON.parse(data);

    profileArrayData.forEach(item => {
        createBlankProfile(item.name);

        profiles[item.name] = new LoanProfile({
            loanAmount: item.loan.Loan_Amount,
            interestRate: item.loan.Interest_Rate,
            payments: item.loan.PaymentLog,
            term: item.loan.Terms,
        });
    });

    showToastNotification("Loaded data from server!");
    $("select#loanProfile").trigger("change");
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
            payment: row.payment,
            hasPayment: row.hasPayment,
        });
    }

    updateLoanInformation();
}

function collectDataToSave(method, profile) {
    if (!isActive) return;

    let profileData = profiles[profile];
    let paymentValueArray = [];

    if (method == "update") {
        profileData.loanTable.forEach(item => {
            paymentValueArray.push(item.payment);
        });
    }

    showToastNotification(`Saving "${profile}"...`);

    saveDataToServer({
        method: method,
        name: profile,
        amount: profileData.loanAmount,
        interest: profileData.interestRate,
        terms: profileData.term,
        payment: paymentValueArray,
    });
}

function paymentTextChange(control, monthIndex) {
    let value = _(`input#payment${monthIndex}`).value;

    if (value == "") {
        _(`input#payment${monthIndex}`).value = 0;
        value = -1;
    }

    profiles[selectedProfile].setMonthData(value, monthIndex);

    updateTableDisplay(monthIndex);
    updateLoanInformation();
    showNextRow(monthIndex);

    let currentProfile = selectedProfile;

    clearTimeout(saveDelay[currentProfile]);
    saveDelay[currentProfile] = setTimeout(
        () => collectDataToSave("update", currentProfile),
        2500
    );
}
