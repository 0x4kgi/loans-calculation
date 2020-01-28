class LoanFormulas {
    constructor(data) {
        this.loanAmount = data.loanAmount;
        this.interestRate = data.interestRate;
        this.payments = data.payments;
        this.term = data.term;
    }

    pmt({ rate, term, loan }) {
        rate = rate / 100;
        return (rate * loan) / (1 - Math.pow(1 + rate, -term));
    }

    interestValueCalculation(balance, interestRate) {
        return balance * (interestRate / 100);
    }

    principalCalculation(payment, interestValue = 0) {
        if (payment == 0) return 0;

        return payment ? payment - interestValue : 0;
    }
}

class LoanFunctions extends LoanFormulas {
    constructor(data) {
        super(data);
    }

    createEmptyList() {
        let balance = this.loanAmount;
        for (let i = 0; i < this.term; i += 1) {
            let toPay = this.pmt({
                rate: this.interestRate,
                term: this.term - i,
                loan: this.loanAmount,
            });

            let payment = this.payments === undefined ? 0 : this.payments[i];

            let interest = this.interestValueCalculation(
                balance,
                this.interestRate
            );

            let principal = 0;

            let newBalance = balance;

            this.loanTable.push({
                month: i,
                balance,
                toPay,
                payment,
                interest,
                principal,
                newBalance,
            });
        }

        if (this.payments !== undefined || this.payments !== null)
            this.updateTable();
    }

    updateTable() {
        let data = this.loanTable;
        let balance = data[0].balance;

        for (let i = 0; i < this.term; i++) {
            let toPay = this.pmt({
                rate: this.interestRate,
                term: this.term - i,
                loan: balance,
            });
            let payment = data[i].payment;
            let interest = this.interestValueCalculation(
                balance,
                this.interestRate
            );
            let principal = this.principalCalculation(payment, interest);
            let newBalance = balance - principal;
            data[i] = {
                month: i,
                balance,
                toPay,
                payment,
                interest,
                principal,
                newBalance,
            };
            balance = newBalance;
        }
    }
}

class LoanProfile extends LoanFunctions {
    constructor(data) {
        super(data);
        this.ID = data.ID;
        this.loanTable = [];
        this.createEmptyList();
    }

    setMonthData(payment, month) {
        let data = this.loanTable[month];
        data.payment = payment;
        data.interest = this.interestValueCalculation(
            data.balance,
            this.interestRate
        );
        data.principal = this.principalCalculation(payment, data.interest);
        data.newBalance = data.balance - data.principal;
        this.updateTable();
    }

    getMonthData(month) {
        return this.loanTable[month];
    }

    getTotalInterest() {
        let data = this.loanTable;
        let totalInterest = 0;

        data.forEach(item => {
            totalInterest += item.interest;
        });

        return totalInterest;
    }

    getTotalPrincipal() {
        let data = this.loanTable;
        let totalPrincipal = 0;

        data.forEach(item => {
            totalPrincipal += item.principal;
        });

        return totalPrincipal;
    }

    getTotalPayment() {
        let data = this.loanTable;
        let totalPayment = 0;

        data.forEach(item => {
            totalPayment += parseFloat(item.payment);
        });

        return totalPayment;
    }
}
