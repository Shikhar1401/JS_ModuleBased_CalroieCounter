// Storage Controller
const storageCtrl = (function(){

    //Public Methods
    return {
        storeItem : function(item){
            let items;
            
            //Check on in ls 
            if(localStorage.getItem('items') === null ){
                items = [];
                //Push the item
                items.push(item);

                //Set item in ls
                localStorage.setItem('items', JSON.stringify(items));

            }else{
                //Get items from LS
                items = JSON.parse(localStorage.getItem('items'));

                items.push(item);
                
                //Reset LS
                localStorage.setItem('items',JSON.stringify(items));

            }
        },

        getStoreItems: function(){
            let items;
            if(localStorage.getItem('items') === null ){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            
            return items;
        },

        updateItemStorage: function(updatedItem){

            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if (item.id === updatedItem.id){
                    items.splice(index, 1, updatedItem)
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        removeItemFromStorage: function(id){

            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if (item.id === id){
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        removeAllItemInStorage: function(){
            localStorage.removeItem('items');
        }

    }

})();

// Item Controller
const itemCtrl = (function(){

    // Constructor Item

    const Item = function(id, name, calorie) {
        this.id = id;
        this.name = name;
        this.calories = calorie;
    }

    //Data Structure / State 
    const data = {
        items: storageCtrl.getStoreItems(),
        currentItem: null,
        totalCalorie: 0
    }

    return {
        logdata: function(){
            return data;
        },

        getItems: function(){
            return data.items;
        },

        addItem: function(name, calories){
            let ID;
            let length = data.items.length;

            if(length > 0){
                ID = data.items[length-1].id + 1;
            }else {
                ID = 0;
            }

            calories = parseInt(calories);
            // Create New Item 
            const newItem = new Item(ID,name,calories);

            //Add to Items Array
            data.items.push(newItem);

            return newItem;
        },
        getItemById : function(id){
            let found = null;

            data.items.forEach(function(item){
                if(item.id === id ){
                    found = item;
                }
            });

            return found;
        },

        updateItem: function(name, calories){
            //Calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories= calories;
                    found = item;
                }
            });

            return found;

        },

        deleteItem: function(id){
            //First Way

            // let index;
            // data.items.forEach(function(item, index){
            //     if(item.id === id){
            //         index = index
            //     }
            // });

            //Second Way
            const ids = data.items.map(function(item){
                return item.id;
            });

            // Get Index
            const index = ids.indexOf(id)

            //Remove Item
            data.items.splice(index,1);
        },

        clearAllItems: function(){

            data.items = [];
            console.log(data.items)
        },


        setCurrentItem : function(item){
            data.currentItem = item;
        },

        getCurrentItem: function(){
            return data.currentItem;
        },

        getTotalCalories: function(){
            let totalCal = 0;

            data.items.forEach(function(item){
                totalCal += item.calories;
            });

            data.totalCalorie = totalCal;
            return data.totalCalorie;
        },
        

    }

})();
// Ui Controller

const uiCtrl = (function(){
    const UISelectors = {
        itemList : '#item-list',
        itemName:'#item-name',
        itemCalories:'#item-calories',
        addBtn:'.add-btn',
        updateBtn:'.update-btn',
        deleteBtn:'.delete-btn',
        backBtn:'.back-btn',
        clearBtn:'.clear-btn',
        totalCalorie:'.total-calories',
        listItems: '#item-list li'
    }

    return {


        populateItemList: function(items){
            document.querySelector(UISelectors.itemList).style.display = 'block';

            let html ='';

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`;
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
           return {
                name: document.querySelector(UISelectors.itemName).value,
                calories: document.querySelector(UISelectors.itemCalories).value
            }

        },
        addListItem: function(item){
            //Show the list or unhide it 
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>`;
            //Insert Item
            document.querySelector(UISelectors.itemList).
                insertAdjacentElement('beforeend',li);

        },

        updateListItem: function(item){
            
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Convert NodeList to Array
            listItems = Array.from(listItems)

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID ===  `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML =
                    `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });


            console.log(itemCtrl.getItems())

        },

        deleteItemUI: function(item){
            
            //First way
            // let listItems = document.querySelectorAll(UISelectors.listItems);

            // listItems = Array.from(listItems);

            // listItems.forEach(function(listItem){
            //     const itemID = listItem.getAttribute('id');

            //     if(itemID === `item-${item.id}`){
            //         listItem.remove();
            //     }
            // })

            //Second Way
            const itemID = `#item-${item}`;
            const listItem = document.querySelector(itemID);
            listItem.remove();


        },

        clearListItems: function(){
            //First Method
            //Remove all list items
            document.querySelector(UISelectors.itemList).remove();

            //Second Method
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            })
        },

        clearInput: function(){
            document.querySelector(UISelectors.itemName).value = '',
            document.querySelector(UISelectors.itemCalories).value = '';
        },

        addItemToForm: function(){
            document.querySelector(UISelectors.itemName).value = 
            itemCtrl.getCurrentItem().name,
            document.querySelector(UISelectors.itemCalories).value = 
            itemCtrl.getCurrentItem().calories;
        },

        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalorie).textContent = totalCalories;
        },

        clearEditState: function(){
            uiCtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
        },

        getSelectors: function(){
            return UISelectors;
        }
    }

})();

// App Controller

const App = (function(ItemCtrl, UICtrl, StorageCtrl){

    // Load Event Listenrs
    const loadEventListeners = function(){

        // Get selectors
        const UISelectors = UICtrl.getSelectors();

        // Add Item Event
        document.querySelector(UISelectors.addBtn).
            addEventListener('click',itemAddSubmit);
        
        // Disable submit on enter
        document.addEventListener('keypress',function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });


        // Edit item
        document.querySelector(UISelectors.itemList).
            addEventListener('click',itemEditClick);
            
        // Update item
        document.querySelector(UISelectors.updateBtn).
        addEventListener('click',itemUpdateSubmit);

        // Back button Event
        document.querySelector(UISelectors.backBtn).
        addEventListener('click',itemBackSubmit);

        // Delete item
        document.querySelector(UISelectors.deleteBtn).
        addEventListener('click',itemDeleteSubmit);

        // Clear All Items
        document.querySelector(UISelectors.clearBtn).
        addEventListener('click',clearItemSubmit);

    };

    
    //  Add Item Submit
    const itemAddSubmit = function(e){
        // Get form input 
        const input = UICtrl.getItemInput();
        
        if(input.name !=='' && input.calories !== ''){
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            
        //Add to UI
        UICtrl.addListItem(newItem);

        //Get Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Show total Calories
        UICtrl.showTotalCalories(totalCalories);

        //Store in local Storage
        StorageCtrl.storeItem(newItem);

        //Clear form input fields
        UICtrl.clearInput();

        }else {
            alert('add proper values');
        }
        
        e.preventDefault();
    };

    // Click edit item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            //Get list item ID
            const listId = e.target.parentNode.parentNode.id;

            //Split the id 
            const listidArr = listId.split('-');

            //get actual id
            const id = parseInt(listidArr[1]);

            //get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();

            //Show edit buttons
            UICtrl.showEditState();
        }
        e.preventDefault();
    }

    // Update Item Submit
    const itemUpdateSubmit = function(e){

        // Get item input
        const input = UICtrl.getItemInput();

        //Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update UI     
        uiCtrl.updateListItem(updatedItem);

        //Get Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Show total Calories
        UICtrl.showTotalCalories(totalCalories);

        //update the LS
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    };

    //Back Button Event
    const itemBackSubmit = function(e){

        UICtrl.clearEditState();
        e.preventDefault();
    }

    //Delete Item Submit
    const itemDeleteSubmit = function(e){

        // Get current item 
        const currentItem = ItemCtrl.getCurrentItem();

        const itemID = ItemCtrl.getCurrentItem().id;

        //remove item from data structure
        ItemCtrl.deleteItem(itemID);

        //Delete from ui
        UICtrl.deleteItemUI(itemID);

        //Get Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Show total Calories
        UICtrl.showTotalCalories(totalCalories);

        //Delete from LS
        StorageCtrl.removeItemFromStorage(itemID);

        UICtrl.clearEditState();
        
        e.preventDefault();
    };

    //Clear Item Submit
    const clearItemSubmit = function(e){

        //Delete from Data Structure
        ItemCtrl.clearAllItems();

        //Get Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Show total Calories
        UICtrl.showTotalCalories(totalCalories);

        //Empty the List in UI
        UICtrl.clearListItems();

        //Hide UL
        // UICtrl.hideList();

        //Remove from LS
        StorageCtrl.removeAllItemInStorage();

        UICtrl.clearEditState();

        e.preventDefault();
    }


// Pubilc Methods
    return {
        init: function(){
            //Clear Form State
            UICtrl.clearEditState();
            //Fetch items from data structure
            const items= ItemCtrl.getItems();

            if(items.length > 0){
                // populate list with item 
                UICtrl.populateItemList(items);

            }else {

                UICtrl.hideList();
            }

            //Get Total Calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Show total Calories
            UICtrl.showTotalCalories(totalCalories);

    


            //Event listners
            loadEventListeners();
        }
    }

})(itemCtrl,uiCtrl, storageCtrl);

// Intialize App
App.init();

