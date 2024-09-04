const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const fromFlag = document.getElementById('fromFlag');
const toFlag = document.getElementById('toFlag');
const amountInput = document.getElementById('amount');
const resultElement = document.getElementById('result');
const searchbarFrom = document.getElementById('searchbarFrom');
const searchbarTo = document.getElementById('searchbarTo');
const swapButton = document.getElementById('swapButton');

const apiKey = 'aab6e7a9ef532d495452a706';
const apiURL = `https://v6.exchangerate-api.com/v6/${apiKey}`;

let allCurrencies = [];
let selectedFromCurrency = 'AZN';
let selectedToCurrency = 'USD';

window.addEventListener('load', () => {
    fetch(`${apiURL}/codes`)
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                allCurrencies = data.supported_codes;
                populateCurrencySelects(allCurrencies);
                updateFlags();
                convertCurrency();
            } else {
                alert('An error occurred while loading currencies.');
            }
        })
        .catch(error => {
            console.error('Hata:', error);
            alert('An error occurred while loading currencies.');
        });
});

function populateCurrencySelects(currencies) {
    currencies.forEach(currency => {
        const optionFrom = document.createElement('option');
        optionFrom.value = currency[0];
        optionFrom.textContent = `${currency[0]} - ${currency[1]}`;
        fromCurrencySelect.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = currency[0];
        optionTo.textContent = `${currency[0]} - ${currency[1]}`;
        toCurrencySelect.appendChild(optionTo);
    });

    fromCurrencySelect.value = selectedFromCurrency;
    toCurrencySelect.value = selectedToCurrency;
}

function updateFlags() {
    const fromCurrency = fromCurrencySelect.value.toLowerCase();
    const toCurrency = toCurrencySelect.value.toLowerCase();

    fromFlag.src = `https://flagcdn.com/w80/${fromCurrency.slice(0, 2)}.png`;
    toFlag.src = `https://flagcdn.com/w80/${toCurrency.slice(0, 2)}.png`;
}

function convertCurrency() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = amountInput.value;

    if (!amount || isNaN(amount) || amount <= 0) {
        resultElement.textContent = `0`;
        return;
    }

    fetch(`${apiURL}/pair/${fromCurrency}/${toCurrency}/${amount}`)
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                resultElement.textContent = `${data.conversion_result}`;
            } else {
                alert('An error occurred during conversion.');
            }
        })
        .catch(error => {
            console.error('Hata:', error);
            alert('An error occurred during conversion.');
        });
}

function filterCurrencies(searchTerm, selectElement) {
    const options = selectElement.querySelectorAll('option');
    const lowerTerm = searchTerm.toLowerCase();
    let found = false;
    let selectedOption = selectElement.value;

    options.forEach(option => {
        const text = option.textContent.toLowerCase();
        if (text.includes(lowerTerm)) {
            option.style.display = '';
            if (!found) {
                selectElement.value = option.value;
                found = true;
            }
        } else {
            option.style.display = 'none';
        }
    });

    if (!found) {
        selectElement.value = selectedOption;
    }

    updateFlags();
    convertCurrency();
}

searchbarFrom.addEventListener('input', () => {
    filterCurrencies(searchbarFrom.value, fromCurrencySelect);
});

searchbarTo.addEventListener('input', () => {
    filterCurrencies(searchbarTo.value, toCurrencySelect);
});

fromCurrencySelect.addEventListener('change', () => {
    selectedFromCurrency = fromCurrencySelect.value;
    updateFlags();
    convertCurrency();
});

toCurrencySelect.addEventListener('change', () => {
    selectedToCurrency = toCurrencySelect.value;
    updateFlags();
    convertCurrency();
});

amountInput.addEventListener('input', convertCurrency);

swapButton.addEventListener('click', () => {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;

    selectedFromCurrency = fromCurrencySelect.value;
    selectedToCurrency = toCurrencySelect.value;

    updateFlags();
    convertCurrency();
});

function continuouslyCheckAndUpdateFlags() {
    updateFlags();
}

setInterval(continuouslyCheckAndUpdateFlags, 500);