function createTables() {
    db.transaction(function (tx) {

        var ordersSql = "CREATE TABLE IF NOT EXISTS orders (" +
            "order_id           INTEGER        PRIMARY KEY," +
	        "first_name			VARCHAR(80)		NOT NULL," +
	        "last_name			VARCHAR(80)		NOT NULL," +
	        "email				VARCHAR(100)	NOT NULL," +
	        "phone_number		INTEGER(10)		NOT NULL," +
	        "delivery			BOOL			NOT NULL," +
	        "address			VARCHAR(255)," +
	        "unit   			VARCHAR(80)," +
	        "city				VARCHAR(80)," +
	        "postal				VARCHAR(6) );";

        var itemsSql = "CREATE TABLE IF NOT EXISTS items (" +
            "item_id			INTEGER         PRIMARY KEY," +
            "item_name			VARCHAR(140)	NOT NULL," +
            "item_description	VARCHAR(255)	NOT NULL," +
            "list_price			DECIMAL(5,2)	NOT NULL );";

        var orderItemsSql = "CREATE TABLE IF NOT EXISTS  order_items (" +
            "order_id			INTEGER," +
            "item_id			INTEGER," +
            "quantity			INTEGER			NOT NULL," +
            "FOREIGN KEY (order_id) REFERENCES orders (order_id)," +
            "FOREIGN KEY (item_id) REFERENCES items (item_id) );";

        var cartSql = "CREATE TABLE IF NOT EXISTS cart (" +
            "item_id           INTEGER      NOT NULL     UNIQUE," +
            "quantity          INTEGER      NOT NULL," +
            "FOREIGN KEY (item_id) REFERENCES items (item_id) );";

        tx.executeSql(ordersSql, [], null, errorHandler);
        tx.executeSql(itemsSql, [], null, errorHandler);
        tx.executeSql(orderItemsSql, [], null, errorHandler);
        tx.executeSql(cartSql, [], null, errorHandler);

    }, errorHandler);


    db.transaction(function (tx) {

        tx.executeSql("SELECT * FROM items WHERE item_name = ?", ['Ciao Ciao'],
            function (tx, res) {
                if (res.rows.length === 0) {
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Campione', 'Cooked ham, salami, mozzarella, mushrooms, black olives, parsley', 8.60)");
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Ciao Ciao', 'Pieces of Musto beef, mushrooms, cheese, Berne sauce, oil and garlic sauce, oregano', 8.60)");
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Cili', 'Ground beef, boiled ham, bacon, onion, green pepper, cheese, tomato sauce, oil and garlic sauce, oregano', 9.20)");
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Crudo', 'Serrano cured pork ham, mozzarella, grilled zucchini, Brie blue cheese', 9.20)");
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Degli Uomini', 'Chicken, smoked bacon, canned peaches, mango-jalapeno sauce, tomato sauce, cheese, pepper, oil and garlic sauce, oregano', 8.60)");
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Della Mafia', 'Ground beef, Guinea pepper, onion, green pepper, canned bulbs, chilli, cheese, tomato sauce, oil and garlic sauce, oregano', 8.60)");
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Di Malta', 'Ground beef, mozzarella, red onions, taco sauce, taco, canned onions, green chili', 8.60)");
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Fior Di Latte', 'Mozzarella, pesto sauce, cherry tomatoes, fresh mozzarella, basil', 7.80)");
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Pesto Amore', 'Goat cheese, spinach, sour cream and garlic sauce, tomato sauce, cheese, oil and garlic sauce, oregano', 7.50)");
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Pesto Con Collo', 'Mushrooms, tomato sauce, cheese, oil and garlic sauce, oregano', 5.50)");
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Guinness Foreign Extra 500ml', 'Blackish brown colour; rich roasted grains and bitter chocolate aromas and flavours', 4.45)");
                    tx.executeSql("INSERT INTO items(item_name, item_description, list_price) VALUES ('Coca-Cola Zero 500ml', '', 1.80)");
                    getItems();
                }
                else {
                    getItems();
                }
            });
    });
}

function dropCartTable() {
    db.transaction(function (tx) {
        tx.executeSql("DROP TABLE cart;");
    });
}

// PLACE YOUR ORDER
function addOrder(first_name, last_name, email, phone_number, delivery, address, unit, city, postal) {
    var sqlString = "INSERT INTO orders (first_name, last_name, email, phone_number, delivery, address, unit, city, postal)" +
    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.transaction(function (tx) {
        tx.executeSql(sqlString, [first_name, last_name, email, phone_number, delivery, address, unit, city, postal],
		function (tx, res) {
		    console.debug("DEBUG: Order added");
		    alert("Your order is successfully placed!");
		}, errorHandler);
    });
}

function getItems() {
    db.transaction(function (tx) {

        tx.executeSql("SELECT items.item_id, item_name, item_description, list_price, cart.quantity FROM items LEFT JOIN cart ON items.item_id = cart.item_id", null,
		function (tx, res) {
		    var code = "";
		    if (res.rows.length == 0) {
		        code = code + '<span class="text-muted">No menu items have been found.</span>';
		    }
		    else {
		        var len = res.rows.length;

		        for (var i = 0; i < len; i++) {

		            code = code +

		            '<div class="col-sm-6 col-lg-4 col-md-4">' +
                        '<div class="thumbnail">' +
                            '<img src="images/menu/' + res.rows.item(i).item_id + '.jpg" alt="' + res.rows.item(i).item_name + '" class="menu">' +
                            '<div class="caption">' +
                                '<h4 class="pull-right">$' + res.rows.item(i).list_price.toFixed(2) + '</h4>' +
                                '<h4>' + res.rows.item(i).item_name + '</h4>' +
                                '<p>' + res.rows.item(i).item_description + '</p>' +
                                '<div class="menu-size">';
		                            if (res.rows.item(i).quantity == null) {
		                                code = code +
                                        '<button type="submit" id="btnAdd' + res.rows.item(i).item_id + '" onclick="javascript:addToCart(' +
                                            res.rows.item(i).item_id + ')" class="btn btn-warning btn-lg">Add to Cart</button>';
		                            } else {
		                                code = code + 
                                        '<button type="submit" id="btnAdd' + res.rows.item(i).item_id + '" onclick="javascript:window.location.href = \'cart.html\'" class="btn btn-success btn-lg">' +
                                            '<span class="glyphicon glyphicon-ok"></span> Added to Cart</button>';
		                            }
                                    code = code +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
		        }
		    }
		    $("#menu").html(code);
		});
    });
}

function getCart() {
    db.transaction(function (tx) {

        tx.executeSql("SELECT * FROM cart INNER JOIN items ON cart.item_id = items.item_id", null,
		function (tx, res) {

		    var code = "";
		    var quantity = 0;

		    var subtotal = 0;
		    var tax = 0;
		    var total = 0;

		    if (res.rows.length == 0) {
		        code = code + '<span class="text-muted">The cart is empty.</span>';
		        $('#checkout').attr("disabled", true);
		    }
		    else {
		        var len = res.rows.length;

		        for (var i = 0; i < len; i++) {
                    
		            code = code +
                    '<div class="row">' +
                        '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">' +
                            '<img class="img-responsive" src="images/menu/' + res.rows.item(i).item_id + '.jpg">' +
                        '</div>' +
                        '<div class="col-xs-5 col-sm-6 col-md-7 col-lg-7">' +
                            '<h4 class="product-name">' + res.rows.item(i).item_name + '</h4>' +
                            '<p>' + res.rows.item(i).item_description + '</p>' +
                        '</div>' +
                        '<div class="col-xs-5 col-sm-4 col-md-3 col-lg-3 text-center">' +

                            '<h4>' +
                                '<strong>$' + res.rows.item(i).list_price.toFixed(2) + ' </strong><span class="text-muted">x</span> ' +
                            '</h4>' +
                            '<p>' +
                                '<div class="input-group">' +
                                    '<span class="input-group-btn">' +
                                        '<button class="btn btn-default" onclick="javascript:changeQuantity(' + res.rows.item(i).item_id + ', ' + res.rows.item(i).quantity + ', -1);" type="button">–</button>' +
                                    '</span>' +
                                    '<input type="text" id="quantity' + res.rows.item(i).item_id + '" disabled class="form-control input text-center" value="' + res.rows.item(i).quantity + '">' +
                                    '<span class="input-group-btn">' +
                                        '<button class="btn btn-default" onclick="javascript:changeQuantity(' + res.rows.item(i).item_id + ', ' + res.rows.item(i).quantity + ', 1)" type="button">+</button>' +
                                    '</span>' +
                                '</div>' +
                            '</p>' +

                            '<p><form action="javascript:removeFromCart(' + res.rows.item(i).item_id + ');" class="form-inline">' +
                                '<button type="submit" class="btn btn-danger nav-justified">Remove</button>' +
                            '</form></p>' +
                        '</div>' +
                    '</div>' +
                    '<hr>';

		            quantity = quantity + res.rows.item(i).quantity;
		            subtotal = subtotal + (res.rows.item(i).list_price * res.rows.item(i).quantity);
		        }

		        $('#checkout').attr("disabled", false);
		    }

		    tax = subtotal * 0.13;
		    total = subtotal + tax;

		    $("#cart").empty();
		    $("#cart").append(code);

		    if (quantity > 0) {
		        $("#cartQuantity").html(quantity);
		    }

		    $("#subtotal").html("$" + subtotal.toFixed(2));
		    $("#tax").html("$" + tax.toFixed(2));
		    $("#total").html("$" +total.toFixed(2));
		});        
    });
}

function addToCart(item_id) {
    var sqlString = "INSERT INTO cart (item_id, quantity) VALUES (?, ?)";

    db.transaction(function (tx) {
        tx.executeSql(sqlString, [item_id, 1],
		function (tx, res) {
		    $("#btnAdd" + item_id).attr('class', 'btn btn-success btn-lg');
		    $("#btnAdd" + item_id).attr('onclick', 'javascript:window.location.href = "cart.html"');
		    $("#btnAdd" + item_id).html('<span class="glyphicon glyphicon-ok"></span> Added to Cart');
		    getCart();
		}, errorHandler);
    });
}

function removeFromCart(item_id) {
    var sqlString = "DELETE FROM cart WHERE item_id = " + item_id + ";";

    db.transaction(function (transaction) {
        transaction.executeSql(
                sqlString,
                [],
                function (transaction, response) {
                    getCart();
                },
                errorHandler
            );
    });
}

function changeQuantity(item_id, currQuantity, changeBy) {

    if (!(currQuantity == 1 && changeBy == -1))
    {
        var newQuantity = currQuantity + changeBy;
        var sqlString = "UPDATE cart SET quantity = '" + newQuantity
            + "' WHERE item_id = " + item_id + ";";

        db.transaction(function (tx) {
            tx.executeSql(
                    sqlString,
                    [],
                    function (tx, res) {
                        getCart();
                    },
                    errorHandler
                );
        });
    }
}
