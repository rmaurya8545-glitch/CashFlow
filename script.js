// cash flow pro -core logic

const salaryInput = document.getElementById('salaryInput');
const dateInput = document.getElementById('dateInput');
const salaryBtn = document.getElementById('salaryBtn');
const salaryDisplay = document.getElementById('salaryDisplay');
const expenseDisplay= document.getElementById('expenseDisplay');
const balanceDisplay = document.getElementById('balanceDisplay');
const expenseName = document.getElementById('expenseName');
const expenseAmount= document.getElementById('expenseAmount');
const expenseBtn = document.getElementById('expenseBtn');
const expenseList= document.getElementById('expenseList');
const salaryMessage = document.getElementById('salaryMessage');
const expenseMessage = document.getElementById('expenseMessage');
const ctx = document.getElementById('expenseChart');

let totalExpense = 0;

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let salary = Number(localStorage.getItem("salary")) || 0;
let myChart;

// 1. set salary

salaryBtn.addEventListener('click',function(){

    const salaryValue =Number(salaryInput.value);
    if(
        salaryInput.value === "" || salaryValue <= 0
    ){
        salaryMessage.textContent = "❌ Please Enter a valid Salary";

        salaryMessage.className = "error";
        return;
    }

    salary = salaryValue;
    localStorage.setItem('salary',salary);

    salaryDisplay.textContent = salary.toLocaleString("en-IN");
    updateBalance();


    salaryMessage.textContent = "✅ Salary updated successfully";

    saveData();

    salaryMessage.className = "success";
    updateChart();
});

//2. Add Expense

expenseBtn.addEventListener('click',function(){
    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    if(name === "" || expenseAmount.value === "" || amount <=0){
        expenseMessage.textContent = "❌ Please Enter valid expense details";
        expenseMessage.className = "error";
        return ;
    }

    const newExpense = {
        id:Date.now(),
        name:name,
        amount:amount,
        date:dateInput.value
    };
    expenses.push(newExpense);

    localStorage.setItem('expenses',JSON.stringify(expenses));

    expenseMessage.textContent = "✅ Expense added successfully!";
    expenseMessage.className = "success";
    expenseName.value = "";
    expenseAmount.value = "";

    displayExpense();
    updateBalance();
    updateChart();
    saveData();

});

//3. display expense

function displayExpense(){
    expenseList.innerHTML = "";
    if(expenses.length === 0){
        expenseList.innerHTML = `<li>No expense added yet</li>`;
        return;
    }
    expenses.forEach(function(expense){
        const li = document.createElement("li");
        li.innerHTML= `<div><strong>${expense.name}</strong><small>${expense.date}</small></div>
        <span>₹${expense.amount.toLocaleString("en-IN")}</span>
        <button onclick = "deleteExpense(${expense.id})">🗑️</button>`;

        expenseList.appendChild(li);

    });

    }


//4. Update Balance

function updateBalance(){
console.log("Salary: ",salary);
console.log("expense: ",expenses);

    let totalExpense = 0;

    expenses.forEach(function(expense){
        totalExpense += expense.amount;
    });

    const remainingBalance = salary - totalExpense;
    expenseDisplay.textContent = totalExpense.toLocaleString("en-IN");

    balanceDisplay.textContent = remainingBalance.toLocaleString("en-IN");
    salaryDisplay.textContent = salary.toLocaleString("en-IN");
}
    
    // delete expense

function deleteExpense(id){

    expenses = expenses.filter(function(expense){
        return expense.id != id;

    });

    displayExpense();
    updateBalance();
    updateChart();
    saveData();
}

function saveData(){
    localStorage.setItem("expenses",JSON.stringify(expenses));  // convert array to string
    localStorage.setItem("salary",salary);
}

function updateChart(){

    if(myChart){
        myChart.destroy();
    }

    const ctx = expenseChart.getContext('2d');


    const totalExpense = expenses.reduce((sum,expense)=>sum + Number(expense.amount),0);   // total expense
    const remainingBalance = Number(salary) - totalExpense;     // remaining balance

    if(salary=== 0) return;

    myChart = new Chart(ctx,{
        type:'pie',
        data:{
            labels: ['Total Expense','Remaining Balance'],
            datasets:[{
                data: [totalExpense,remainingBalance],
                backgroundColor:[
                    '#bf7a89',
                    '#0c80ce',
                ],
                borderWidth:2
            }]
        },
        options:{
            responsive:true,
            plugin:{
                legend:{
                    position:'bottom'
                },
                title:{
                    display:true,
                    text:'Expense vs Balance Breakdown'
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded',() =>{
    displayExpense();
    updateBalance();
    updateChart();
    salaryDisplay.textContent = salary;Array.toLocaleString("en-IN");
    dateInput.valueAsDate = new Date();
});
