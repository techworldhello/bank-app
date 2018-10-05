console.log('bank app');

// Keeping track of the checking and savings balances

const BALANCE_CHECKING = 'checking';
const BALANCE_SAVINGS = 'savings';

const balances = {
	[BALANCE_CHECKING]: 0,  
	[BALANCE_SAVINGS]: 0
};

const checkingElements = {
	input: document.querySelector('.checking-input'),
	balance: document.querySelector('.checking-result'),
	btnDeposit: document.getElementById('checking-deposit'),
	btnWithdraw: document.getElementById('checking-withdraw'),
	btnTransfer: document.getElementById('checking-transfer'),
	background: document.querySelector('.checking-acc')
};

const savingsElements = {
	input: document.querySelector('.savings-input'),
	balance: document.querySelector('.savings-result'),
	btnDeposit: document.getElementById('savings-deposit'),
	btnTransfer: document.getElementById('savings-transfer'),
	background: document.querySelector('.savings-acc')
};

let message = document.getElementById('message');

// Add functionality so that a user can deposit money into one of the bank accounts.

function deposit(account, amount) {
	balances[account] += parseFloat(amount);
	updateDisplay();
}

// Add functionality so that a user can withdraw money from one of the bank accounts.
// Make sure the balance in an account can't go negative. If a user tries to withdraw more money than exists in the account, ignore the transaction.

function withdrawFromChecking() {
	const withdrawalAmount = parseFloat(checkingElements.input.value);
	const amountLeft = balances[BALANCE_CHECKING] - withdrawalAmount;
	if (amountLeft <= 0) {
		// Savings has enough funds
		if (balances[BALANCE_SAVINGS] > amountLeft) {
			balances[BALANCE_SAVINGS] += amountLeft;
			balances[BALANCE_CHECKING] = 0;
			message.innerHTML = 'You have just withdrawn $' + withdrawalAmount
		} else {
			message.innerHTML = `Insufficient funds I'm afraid`;
		}
	} else {
		balances[BALANCE_CHECKING] = amountLeft;
	}
	updateDisplay();
}

// Make sure you are updating the display and manipulating the HTML of the page so a user can see the change.
// When the balance of the bank account is $0 the background of that bank account should be red. It should be gray when there is money in the account

function updateDisplay() {
	savingsElements.balance.innerHTML = '$' + balances[BALANCE_SAVINGS].toFixed(2);
	checkingElements.balance.innerHTML = '$' + balances[BALANCE_CHECKING].toFixed(2);
	
	balances[BALANCE_CHECKING] <= 0 ? checkingElements.background.style.backgroundColor = '#d95555' 
	: checkingElements.background.style.backgroundColor = '#C0C0C0';
}

function transferFunds(accountFrom, accountTo, accountFromElem, accountToElem, amount) {
	if (balances[accountFrom] >= parseFloat(amount)) {
		balances[accountFrom] -= parseFloat(amount);
		accountFromElem.balance.innerHTML = '$' + balances[accountFrom].toFixed(2);
		balances[accountTo] += parseFloat(amount);
		accountToElem.balance.innerHTML = '$' + (balances[accountTo].toFixed(2));

		message.innerHTML = 'You are transferring $' + amount + ' from ' + accountFrom + ' to ' + accountTo;
	} else {
		message.innerHTML = 'You have insufficient funds';
	}
}

//increase by 10% interest every 5 sec to encourage saving

function savingsAccInterest() {
	let interestIncrement = balances[BALANCE_SAVINGS] * 2;

	if (balances[BALANCE_SAVINGS] > 0) {
		setInterval(() => {
			balances[BALANCE_SAVINGS] = balances[BALANCE_SAVINGS].toFixed(2) * 1.1;
			savingsElements.balance.innerHTML = '$' + balances[BALANCE_SAVINGS].toFixed(2);
			// console.log(balances[BALANCE_SAVINGS])
			if (balances[BALANCE_SAVINGS] > interestIncrement) {
				savingsElements.background.style.backgroundColor = 'gold'
			}
		}, 5000);
	}
}

checkingElements.btnDeposit.addEventListener('click', () => {
	deposit(BALANCE_CHECKING, checkingElements.input.value);
});

checkingElements.btnWithdraw.addEventListener('click', () => { 
	withdrawFromChecking();
});

checkingElements.btnTransfer.addEventListener('click', () => {
	transferFunds(BALANCE_CHECKING, BALANCE_SAVINGS, checkingElements, savingsElements, checkingElements.input.value);
});

savingsElements.btnDeposit.addEventListener('click', () => { 
	deposit(BALANCE_SAVINGS, savingsElements.input.value);
	savingsAccInterest();
});

savingsElements.btnTransfer.addEventListener('click', () => {
	transferFunds(BALANCE_SAVINGS, BALANCE_CHECKING, savingsElements, checkingElements, savingsElements.input.value);
});
