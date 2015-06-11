var db;

function errorHandler(transaction, error) {
    alert("SQL error: " + error.message);
}

$(document).ready(function () {
    db = openDatabase('ProspettoPizzeriaDb', '1.0', 'Prospetto Pizzeria Database', 5 * 1024 * 1024);
    createTables();

    getItems();

    getCart();

});