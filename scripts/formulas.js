function PMT({ rate, term, loan }) {
    rate = rate / 12;
    return rate * (-loan) * Math.pow((1 + rate), term) / (1 - Math.pow((1 + rate), term))
}

function interestValueCalculation(balance, interestRate) {
    return balance * (interestRate / 12);
}

function principalCalculation(payment, interestValue = 0) {
    if (payment == 0) return 0; 

    return payment
        ? payment - interestValue
        : DEFAULT_PAYMENT;
}
