//unit 17 mini project DB javascript 

let db;
let budgetVersion;

const request = indexedDB.open("budget", budgetVersion || 21);

//creating a new db request for the budget databases
request.onupgradeneeded = (event) => {
    
    console.log('upgrade needed in IndexDB');

    const {oldVersion} = event;
    const newVersion = event.newVersion || db.version;

    console.log(`DB updated from old ${oldVersion} to new ${newVersion}`);

    db = event.target.result;

    if(db.objectStoreNames.length === 0){
        db.createObjectStore('budgetStore', {autoIncrement: true});
    }

};

//catch adn display errors
request.onerror = (event) => {
    console.log(`error has occured ${event.target.errorCode}`)
}

const checkDatabase = () => {
    console.log('check db started');

    //open a transaction from BudgetStore db
    let transaction = db.transaction(['budgetStore'], 'readwrite');

    //access BusgetStore Object 
    const store = transaction.objectStore('budgetStore');

    //get all records from store and put in one variable 
    const getAll = store.getAll();

    //if successful run this code 
    getAll.onsuccess = () => {
        //if items in the store, buld add them when back online
        if(getAll.result.length > 0){
            fetch('/api/transaction/bulk',{
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                  Accept: 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then((res) => {
                //if response not empty run 
                if(res.length !==0) {
                    //open another transaction to Budget store to read/write
                    transaction = db.transaction(['budgetStore'], 'readwrite');

                    //assign the current store to a variable
                    const currentStore = transaction.objectStore('budgetStore');

                    //Clear existing entries because our bulk add was successful 
                    currentStore.clear();
                    console.log('clearing store')
                }
            });
        }
    };
}

request.onsuccess = (event) => {
    console.log('success');
    db = event.target.result;

    //check if online before reading from db

    if(navigator.onLine){
        console.log('back online')
        checkoutDatabase();
    }
};

const saveRecord = (record) => {
    console.log('save record started');

    //creat transaction to read and write 
    const transaction = db.transaction(['budgetStore'], 'readwrite');

    //access BudgetStore object store 
    const store = transaction.objectStore('budgetStore');

    //add record to store with add method
    store.add(record);
}

//listener to determine for app coming back online

window.addEventListener('online', checkDatabase);