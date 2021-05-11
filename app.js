//Storage Controller
const StorageCtrl = (function(){
    //Public Methods
    return{
        storeItem: function(item){
            let items;
            //Check if any item in local storage
            if(localStorage.getItem('items') === null)
            {
                items = [];
                //Push new item
                items.push(item);
                //Set Local Storage
                localStorage.setItem('items',JSON.stringify(items));
                console.log(123);
            }
            else
            {
                //Get what is in local storage
                items = JSON.parse(localStorage.getItem('items'));

                //Push new item
                items.push(item)

                //Set Local Storage
                localStorage.setItem('items',JSON.stringify(items));
            }
        },

        getItemsFromLS: function(){
            let items ;
            if(localStorage.getItem('items') === null)
            {
                items = [];
            }
            else
            {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },

        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item,index){
                if(updatedItem.id === item.id)
                 items.splice(index,1,updatedItem);
            });

            localStorage.setItem('items',JSON.stringify(items));
        },

        deleteItemFromLS: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item,index){
                if(id === item.id)
                 items.splice(index,1);
            });

            localStorage.setItem('items',JSON.stringify(items));
        },

        clearItemsFromLS: function(){
            localStorage.removeItem('items');
        }
        
    }
})();

//Item Controller
const ItemCtrl = (function(){
    //Item Contructor
    const Item = function(id,name,calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure/State
    const data = {
        // items:[
        //     // {id: 0, name:'Steak Dinner',calories:1200},
        //     // {id: 1, name:'Cookie',calories:400},
        //     // {id: 2, name:'Eggs',calories:300}
        // ],
        items: StorageCtrl.getItemsFromLS(),
        currentItem: null,
        totalCalories:0
    }

    //Public Methods
    return{
        logData: function(){
            return data;
        },
        addItem: function(name,calories){
            //Create ID
            let ID;
            if(data.items.length>0){
                ID=data.items[data.items.length-1].id+1;
            }else
            {
                ID=0;
            }

            //Calories to number
            calories = parseInt(calories);

            //Create new item
            newItem = new Item(ID,name,calories);

            //Add to items array
            data.items.push(newItem);

            return newItem;
        },

        getItemById: function(id){
            let found;
            //Loop through items
            data.items.forEach(function(item){
                if(item.id===id)
                    found = item;

            });
            return found;
        },

        updateItem: function(name, calories){
            //Calories to number
            calories = parseInt(calories);

            let found = null;
 
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id)
                {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },

        deleteItem: function(id){
            //get IDS
            let ids = data.items.map(function(item){
                return item.id;
            });

            //Get index
            const index = ids.indexOf(id);

            //Remove item
            data.items.splice(index,1);
        },

        setCurrentItem: function(item){
            data.currentItem = item;
        },

        getCurrentItem:function(){
            return data.currentItem;
        },

        getTotalCalories: function(){
            let total=0;
            data.items.forEach(function(item){
                total += item.calories;
            });

            //Set total cal in data structure
            data.totalCalories = total;
            return total;
        },

        clearAllItems: function(){
            data.items = [];
        },

        getItems: function(){
            return data.items;
        }
    }
})();

//UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listitems:'#item-list li',
        addBtn: '.add-btn',
        itemName:'#item-name',
        itemCalories:'#item-calories',
        TotalCalories:'.total-calories',
        updateBtn:'.update-btn',
        deleteBtn:'.delete-btn',
        backBtn:'.back-btn',
        clearBtn:'.clear-btn'
    }

    //Public Methods
    return{
        populateItemList: function(items){
            let html='';

            items.forEach(function(item){
                html += `
                <li class="collection-item" id="Item-${item.id}">
                <strong>${item.name}:</strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>
                `;
            });

            //Insert list items 
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return{
                name: document.querySelector(UISelectors.itemName).value,
                calories: document.querySelector(UISelectors.itemCalories).value
            }
        },
        addListItem: function(item){
            //Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';

            //Create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;

            //HTML
            li.innerHTML = `<strong>${item.name}:</strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;

            //Insert li
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
        },
        updateListItem:function(item){
            let ListItems = document.querySelectorAll(UISelectors.listitems);

            //Turn node list into array
            Listitems = Array.from(ListItems);

            ListItems.forEach(function(listItem){
                const itemId = listItem.getAttribute('id');

                if(itemId === `item-${item.id}`){
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}:</strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;``;
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#Item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        addItemForm: function(){
            
            document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCalories).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listitems);

            //Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item)
            {
                item.remove();
            })
        },

        showEditState : function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },

        clearInput: function(){
            document.querySelector(UISelectors.itemName).value='';
            document.querySelector(UISelectors.itemCalories).value='';
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.TotalCalories).textContent = totalCalories;
            
        },
        clearEditState:function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        getSelectors: function(){
            return UISelectors;
        }
    }
    
})();

//App Controller
const App = (function(ItemCtrl,UICtrl,StorageCtrl){

    //Load EVENT listeners
    const loadEventListeners = function(){
        //Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        //Add Item event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

        //Disable submit on enter
        document.addEventListener('keypress',function(e){
            if(e.keyCode === 13||e.which === 13)
            {
                e.preventDefault();
                return false;
            }
        })

        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

        //Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

        //back button click
        document.querySelector(UISelectors.backBtn).addEventListener('click',exitEditState);

        //Delete button click
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

        //Clear button click
        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItems);
    }

    itemAddSubmit = function(e){
    
        //get Form Input from UI Controller
        const input = UICtrl.getItemInput();
        
        //Check for name and calorie
        if(input.name!==''&&input.calories!=='')
        {
            //Add item
            const newItem = ItemCtrl.addItem(input.name,input.calories);

            UICtrl.addListItem(newItem);

            //Get total Calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to ui
            UICtrl.showTotalCalories(totalCalories);

            //Store in local storage
            StorageCtrl.storeItem(newItem);

            //Clear input fields
            UICtrl.clearInput();
        }
        
        e.preventDefault();
    }

    const itemDeleteSubmit = function(e){
        
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //Back to add state
        UICtrl.clearEditState();

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //Get total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        //Delete from LS
        StorageCtrl.deleteItemFromLS(currentItem.id);

        e.preventDefault();
    }

    //Clear Items Event
    const clearAllItems = function(e){

        //Delete item from data structure
        ItemCtrl.clearAllItems();

        //Remove from UI
        UICtrl.removeItems();

        //Get total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        //Clear UI
        UICtrl.hideList();

        //Clear from LS
        StorageCtrl.clearItemsFromLS();

        e.preventDefault();
    }

    //click edit item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item'))
        {
            //Get list item id
            const list_id = e.target.parentNode.parentNode.id;
            
            //Break into an array
            const listIdArray = list_id.split('-');

            //get actual id
            const id = parseInt(listIdArray[1]);

            //get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
            UICtrl.addItemForm();
        }

        e.preventDefault();
    }

    //Update item submit
    const itemUpdateSubmit = function(e){
        e.preventDefault();

        //Get item input
        const input = UICtrl.getItemInput();

        //update item
        const updatedItem = ItemCtrl.updateItem(input.name,input.calories);

        //Update UI
        UICtrl.updateListItem(updatedItem);

        //Get total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to ui
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

        //Update LS
        StorageCtrl.updateItemStorage(updatedItem);

        
    }

    const exitEditState = function(e){

        UICtrl.clearEditState();

        UICtrl.clearInput();

        e.preventDefault();
    }

    //Public Methods
    return{
        init: function(){
            //Clear Edit state
            UICtrl.clearEditState();

           //Fetch items from data structure
            const items = ItemCtrl.getItems();

            //check if any items
            if(items.length===0)
            {  
                  UICtrl.hideList();
            }
            else{
                //Populate list with items
                UICtrl.populateItemList(items);
            }

            //Get total Calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to ui
            UICtrl.showTotalCalories(totalCalories);

            //Load event listeners
            loadEventListeners();

        }
    }
    
})(ItemCtrl,UICtrl,StorageCtrl);

App.init();