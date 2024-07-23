document.addEventListener("DOMContentLoaded", function () {

   const required = document.querySelectorAll('input[type="number"].form-input');
   const deleteButton = document.querySelector('.reset-form');
   const inputAll = document.querySelectorAll('input[type="number"]');
   const inputCheckbox = document.querySelectorAll('input[type="checkbox"]');
   const selectOption = document.querySelector('#industry');
   
   
    // 1. DETAILS/OUTLOOK OPEN AND CLOSE 
    const detailsBtn = document.querySelectorAll('.details-btn');
    // Set initial button text outside the loop
    detailsBtn.forEach(btn => btn.innerText = "Details / Outlook > ");
    detailsBtn.forEach(btn => {
       btn.addEventListener('click', function() {
          const content = this.nextElementSibling;
          content.classList.toggle('active');
 
          // Update button text based on visibility
          this.innerText = content.classList.contains('active') ? '< Close Explanation' : 'Details / Outlook > ';
       });
    });
 
 
 
    // 2. CHECKBOX OPEN AND CLOSE ON CLICK
    function toggleDropdown(checkboxElement, dropdownElement) {
       const dropdown = document.getElementById(dropdownElement);
       const checkboxParent = checkboxElement.parentNode; 
       const checkboxParentParent = checkboxParent.parentNode;
       const boxElement = checkboxParentParent.previousElementSibling; 
       const boxInputs = boxElement.querySelectorAll('input[type="number"]');

       checkboxElement.addEventListener('change', function() {
         dropdown.style.display = this.checked ? 'block' : 'none';
         boxElement.classList.toggle('open', this.checked);

          // Enable/disable inputs based on checkbox state
         boxInputs.forEach(input => input.disabled = this.checked);
       });
    }

   // Get all checkboxes and their corresponding dropdown IDs
    const checkboxes = document.querySelectorAll('.checkbox'); 
    const dropdownIds = ['dropdown-roce', 'dropdown-cash'];
   
   // Call the toggleDropdown function for each checkbox-dropdown pair
    checkboxes.forEach((checkbox, index) => {
      toggleDropdown(checkbox, dropdownIds[index]);
    });



   // 3.CHECK FOR ERROR AND SUCCESS
   // SHOW ERROR function
    function showError(input){
      const formControl = input.parentElement;
      formControl.className = 'box error';

      setTimeout(() => {
         formControl.className = 'box';
        
       }, 10000); 
   }

   // SHOW SUCCESS function
    function showSuccess(input) {
      const formControl = input.parentElement;
      formControl.className = 'box success';
         
      setTimeout(() => {
         formControl.className = 'box';

      }, 10000); 
    }


   //Check required inputs and select option
    function checkRequiredAndSelect() {
      let isValid = true; // Flag to track validity

      // Check required inputs
      required.forEach(function(input) {
         if (input.value.trim() === '') {
            showError(input);
            isValid = false; 
         } else {
            showSuccess(input);
         }
      });

      // Check select option
      if (selectOption.value === "" || selectOption.value === "none") { 
       showError(selectOption); 
      isValid = false;
      } else {
       showSuccess(selectOption); 
      }

      roceCalculate();
      cccCalculate();

      return isValid;
   }


  // 4. CALCULATING ROCE
   let roce = document.getElementById('roce');
   let ebit = document.getElementById('ebit');
   let assets = document.getElementById('assets');
   let stocks = document.getElementById('stocks');
   let requirements = document.getElementById('requirements');
   let liabilities = document.getElementById('liabilities');
   let payment = document.getElementById('payment');

   // Function to calculate ROCE
   function roceCalculate() {
      let ebitValue = parseFloat(ebit.value) || 0;
      let assetsValue = parseFloat(assets.value) || 0;
      let stocksValue = parseFloat(stocks.value) || 0;
      let requirementsValue = parseFloat(requirements.value) || 0;
      let liabilitiesValue = parseFloat(liabilities.value) || 0;
      let paymentValue = parseFloat(payment.value) || 0;
      let roceValue = parseFloat(roce.value);

      // Check if ROCE input is empty
      if (roce.disabled) {

         // Check if ROCE input is empty
         if (isNaN(ebitValue) || isNaN(assetsValue) || isNaN(stocksValue) || isNaN(requirementsValue) || isNaN(liabilitiesValue) || isNaN(paymentValue)) {
            showError(roce);
            return;
         }

         // Calculate ROCE from sub inputs
         roceValue = ebitValue - (assetsValue + stocksValue + requirementsValue + liabilitiesValue + paymentValue);
         roce.value = roceValue.toFixed(2);
      } else {
         // ROCE input is not empty, proceed with its value
         roceValue = parseFloat(roceValue.toFixed(2));
      }

      // Show success for ROCE input
      showSuccess(roce);
   }



   // 5. CALCULATING CCC
   let cash = document.getElementById('cash');
   let dio = document.getElementById('dio');
   let debtor = document.getElementById('debtor');
   let vendor = document.getElementById('vendor');

   // Function to calculate CCC
   function cccCalculate() {
      let cashValue = parseFloat(cash.value);
      let dioValue = parseFloat(dio.value) || 0;
      let debtorValue = parseFloat(debtor.value) || 0;
      let vendorValue = parseFloat(vendor.value) || 0;

      if (cash.disabled) {

         // Check if CCC input is empty
         if (isNaN(dioValue) || isNaN(debtorValue) || isNaN(vendorValue)) {
            showError(cash);
            return;
         }
         // Calculate CCC from sub inputs
         cashValue = dioValue + debtorValue - vendorValue;
         cash.value = cashValue.toFixed(2);
      } else {
         // Cash input is not empty, proceed with its value
         cashValueValue = parseFloat(cashValue.toFixed(2));
      }
      
      // Show success for CCC input
      showSuccess(cash);
   }




   // 6. ADD TO LOCAL STORAGE
   const select = document.querySelector('#industry');
   const total = document.querySelector('#total');
   const personnel = document.querySelector('#personnel');
   const gross = document.querySelector('#gross');
 
   const toggleRoceInput = document.querySelector('#toggleRoce');
   
   const toggleCCCInput = document.querySelector('#toggleCCC');
  
   let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

   let lastTransaction;

   //   Add transaction 
   function addTransaction() {
       let text = select.options[select.selectedIndex].text;
       let roceValue = parseFloat(roce.value);
       let cashValue = parseFloat(cash.value);
       let totalValue = parseFloat(total.value);
       let personnelValue = parseFloat(personnel.value);
       let grossValue = parseFloat(gross.value);

       let ebitValue = parseFloat(ebit.value) || 0;
       let assetsValue = parseFloat(assets.value) || 0;
       let stocksValue = parseFloat(stocks.value) || 0;
       let requirementsValue = parseFloat(requirements.value) || 0;
       let liabilitiesValue = parseFloat(liabilities.value) || 0;
       let paymentValue = parseFloat(payment.value) || 0;

       let dioValue = parseFloat(dio.value) || 0;
       let debtorValue = parseFloat(debtor.value) || 0;
       let vendorValue = parseFloat(vendor.value) || 0;

       let grossMargin = (gross.value / personnel.value) * 100;
       let percentageOfRevenue = (personnel.value / total.value) * 100;
       let personnelExpenseToGrossProfit = (personnel.value / gross.value) * 100;

       const transaction = {
           id: generateID(),
           industry: text,
           roce: roceValue,
           cash: cashValue,
           total: totalValue,
           personnel: personnelValue,
           gross: grossValue,
           grossMargin: grossMargin,
           percentageOfRevenue: percentageOfRevenue,
           personnelExpenseToGrossProfit: personnelExpenseToGrossProfit,
          
           dio: dioValue,
           debtor: debtorValue, 
           vendor: vendorValue,
           
           ebit: ebitValue,
           assets : assetsValue,
           stocks: stocksValue,
           requirements: requirementsValue,
           liabilities: liabilitiesValue,
           payment: paymentValue,

           toggleRoce: toggleRoceInput.checked,
           toggleCCC: toggleCCCInput.checked
           
       };

       transactions.push(transaction);
       addResetButton(transaction);
       updateLocalStorage();
   }

   // function Generate ID
   function generateID() {
       return Math.floor(Math.random() * 1000000000);
   }

   // Function to add the reset button
   function addResetButton(transaction) {
      deleteButton.innerHTML = `
      <button class="delete-btn btn" data-id="${transaction.id}">Reset Questionary</button>
      `;
      
      // Add event listener for the reset button
      const resetButton = deleteButton.querySelector('.delete-btn');
         if (resetButton) {
               resetButton.addEventListener('click', function () {
                  removeTransaction(transaction.id);
               });
         }
   }

   function addTransactionToDOM(transaction) {
      if (transactions.length > 0) {
         const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
          deleteButton.innerHTML = `
              <button class="delete-btn btn" data-id="${transaction.id}">Reset Questionnaire</button>`;
      }

      updateLocalStorage();
   }

   //   Update Local Storage
   function updateLocalStorage() {
      localStorage.setItem('transactions', JSON.stringify(transactions));
   }

   //   Init
   function init() {
       deleteButton.innerHTML = ''; 

       // Retrieve the last transaction if available
      if (transactions.length > 0) {
         lastTransaction = transactions[transactions.length - 1];
         addResetButton(lastTransaction);
         populateForm();
      }
   }

   // Remove Transaction by id
   function removeTransaction(id){
      transactions = transactions.filter(transaction => transaction.id !== id);
      updateLocalStorage();
      location.reload();
      init();
   }
   


   //CHECKBOX OPEN IF SAVED CHECKED IN LOCAL STORAGE
   function openCheckbox(checkboxElement) {
      let checkboxParent = checkboxElement.parentNode;
      let checkboxParentParent = checkboxParent.parentNode;
      let boxElement = checkboxParentParent.previousElementSibling;
      let boxElChild = boxElement.children[1];
      let dropdownEl = boxElement.nextElementSibling;
      let dropdownNextEl = dropdownEl.nextElementSibling;
   
      if (checkboxElement.checked === true) { 
         boxElement.classList.add('open'); 
         dropdownNextEl.style.display = 'block';
         boxElChild.disabled = true;
      } else {
         boxElement.classList.remove('open');
         dropdownNextEl.style.display = 'none'; 
      }
   }


   //  Populate Form again function
   function populateForm() {
      for (const key in lastTransaction) {

         // Repopulate only input type number fields
         let inputElement = document.querySelector(`input[data-id="${key}"][type="number"]`);
         if (inputElement) {
            inputElement.value = lastTransaction[key];
         }

         // Repopulate only checkboxes - if checked
         let checkboxElement = document.querySelector(`input[data-id="${key}"][type="checkbox"]`);
         if (checkboxElement) {
            checkboxElement.checked = lastTransaction[key];
            openCheckbox(checkboxElement); 
         }

         // Repopulate selected option
         let selectOption = document.querySelector(`select[data-id="${key}"]`);
         if (selectOption) {
            let selectedValue = lastTransaction[key];
            const options = selectOption.querySelectorAll('option');
            options.forEach(option => {
               if (option.value === selectedValue) {
                     option.selected = true;
               } else {
                     option.selected = false;
               }
            });
         }

         // addCalculationListeners();

         // Trigger input event manually
         let allRelevantInputs = [ebit, assets, stocks, requirements, liabilities, payment, roce, dio, debtor, vendor, cash];
         allRelevantInputs.forEach(input => {
            input.dispatchEvent(new Event('change')); 
         });
      
      }
   }


   // Add event listeners to all relevant input fields for calculations
   function addCalculationListeners() {
      let allRelevantInputs = [ebit, assets, stocks, requirements, liabilities, payment, roce, dio, debtor, vendor, cash];
      allRelevantInputs.forEach(input => {
         input.addEventListener('change', function() { 
            console.log('change happened');
           roceCalculate();
           cccCalculate();
         });
       });
   }

   // Attach event listeners for ROCE and CCC calculations
   addCalculationListeners();


   // 7.EVENT LISTENER ON COMPLETE QUESTIONARY BUTTON
   const buttonComplete = document.querySelector('#button-complete');
   
   buttonComplete.addEventListener('click', function (e) {
      e.preventDefault();

      if (checkRequiredAndSelect()) {
          addTransaction();
          
          setTimeout(() => {
              window.location.href = "./form_second_page.html";
          }, 100); 
      }
  });



   // 8.ATTACH EVENT LISTENER TO DELETE BUTTON
   if (deleteButton) {
      deleteButton.addEventListener('click', function (e) {
         if (e.target.classList.contains('delete-btn')) {
            // Remove transaction
            localStorage.removeItem('transactions'); 
            // Delete delete button
            deleteButton.style.display = 'none'; 
            // Set all input values to empty
            inputAll.forEach(input=>{
               input.value = '';
            });
            // Set select option to none
            selectOption.value = 'none';
            // Uncheck all checkboxes using inputCheckbox
            inputCheckbox.forEach(check => {
               check.checked = false;
               openCheckbox(check);
            });
         }
      });
   }


   // Call init
   init();

    // Populate inputs
    populateForm();
});


