import Item from './Item.js';
import Inventory from './Inventory.js'; // Tanpa { } karena default export

const inventory = new Inventory();

const item1 = new Item(1, 'Laptop', 10, 1000);
const item2 = new Item(2, 'Mouse', 50, 20);

inventory.addItem(item1);
inventory.addItem(item2);

console.log('Initial Inventory:');
console.log(inventory.listItems());

item1.updateDetails('Laptop', 8, 950);
console.log('\nInventory after update:');
console.log(inventory.listItems());

inventory.removeItem(2);
console.log('\nInventory after removal:');
console.log(inventory.listItems());
