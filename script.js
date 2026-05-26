let chart;

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

function updateChart(incomeAmount, expenseAmount){

    const ctx =
    document.getElementById("myChart");

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: 'doughnut',

        data: {

            labels: ['Income', 'Expense'],

            datasets: [{

                data: [incomeAmount, expenseAmount],

                backgroundColor: [
                    '#4CAF50',
                    '#F44336'
                ],

                borderWidth: 2
            }]
        },

        options:{
            responsive:true
        }
    });
}

function updateUI(){

    const list =
    document.getElementById("list");

    const balance =
    document.getElementById("balance");

    const income =
    document.getElementById("income");

    const expense =
    document.getElementById("expense");

    list.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction,index)=>{

        const li =
        document.createElement("li");

        li.innerHTML = `
            <span>
                ${transaction.text}
                - ₹${transaction.amount}
            </span>

            <button class="delete-btn"
            onclick="deleteTransaction(${index})">
                X
            </button>
        `;

        list.appendChild(li);

        if(transaction.type === "income"){
            totalIncome +=
            Number(transaction.amount);
        }
        else{
            totalExpense +=
            Number(transaction.amount);
        }

    });

    income.innerText =
    `₹${totalIncome}`;

    expense.innerText =
    `₹${totalExpense}`;

    balance.innerText =
    `₹${totalIncome - totalExpense}`;

    updateChart(
        totalIncome,
        totalExpense
    );

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function addTransaction(){

    const text =
    document.getElementById("text").value;

    const amount =
    document.getElementById("amount").value;

    const type =
    document.getElementById("type").value;

    if(text === "" || amount === ""){

        alert("Please fill all fields");

        return;
    }

    transactions.push({
        text,
        amount,
        type
    });

    updateUI();

    document.getElementById("text").value = "";

    document.getElementById("amount").value = "";
}

function deleteTransaction(index){

    transactions.splice(index,1);

    updateUI();
}

function toggleTheme(){

    document.body.classList.toggle("dark");

    const button =
    document.getElementById("theme-btn");

    if(document.body.classList.contains("dark")){

        button.innerText = "Light Mode";
    }
    else{

        button.innerText = "Dark Mode";
    }
}

function downloadPDF(){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text(
        "Expense Tracker Report",
        20,
        20
    );

    let y = 40;

    transactions.forEach((transaction,index)=>{

        doc.text(

            `${index + 1}. ${transaction.text}
             - ₹${transaction.amount}
             (${transaction.type})`,

            20,
            y
        );

        y += 10;
    });

    doc.save("Expense_Report.pdf");
}

updateUI();