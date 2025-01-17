document.getElementById("balanceForm").addEventListener("submit", function (event) {
    event.preventDefault() 

    const balance = parseFloat(document.getElementById("startingBalance").value)

    if (!isNaN(balance)) {
        localStorage.setItem("startingBalance", balance)

        alert(`Your starting balance is $${balance.toFixed(2)}!`)

        document.querySelector(".starting-balance").style.display = "none"

        document.querySelector(".expense-tracker").style.display = "block"
    }
})

document.getElementById("expenseForm").addEventListener("submit", function (event) {
    event.preventDefault() 

    const balance = parseFloat(localStorage.getItem("startingBalance"))
    const expenseName = document.getElementById("expenseName").value
    const expenseAmount = parseFloat(document.getElementById("expenseAmount").value)

    if (expenseName && !isNaN(expenseAmount) && !isNaN(balance)) {
        const newBalance = balance - expenseAmount
        const currentDate = new Date().toLocaleDateString()

        localStorage.setItem("startingBalance", newBalance)

        const tableBody = document.querySelector("#expenseTable tbody")
        const newRow = document.createElement("tr")

        newRow.innerHTML = `
            <td>${currentDate}</td>
            <td>${expenseName}</td>
            <td>$${expenseAmount.toFixed(2)}</td>
            <td>$${newBalance.toFixed(2)}</td>
        `

        tableBody.prepend(newRow)

        alert(`Remaining Balance: $${newBalance.toFixed(2)}`)
    } 
})