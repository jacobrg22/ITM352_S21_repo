require("./products_data.js");

num_products = 5

item_num = 1

while (item_num <= (num_products/2)) {
    console.log(`${item_num}. ${eval('name' + item_num)}`);
    item_num++;
}
    
console.log("That's all we have!");