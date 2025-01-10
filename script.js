
document.getElementById("balanceForm").addEventListener("submit", function (event) {
    event.preventDefault()
    const balance = parseFloat(document.getElementById("startingBalance").value)
    if (!isNaN(balance)) {
        localStorage.setItem("startingBalance", balance)
        alert(`Your starting balance is $${balance.toFixed(2)}!`)

        document.querySelector(".starting-balance").style.display = "none"
    }
})

document.getElementById("expenseForm").addEventListener("submit", function (event) {
    event.preventDefault()
    const expenseName = document.getElementById("expenseName").value
    const expenseAmount = parseFloat(document.getElementById("expenseAmount").value)

    if (expenseName && !isNaN(expenseAmount)) {
        const tableBody = document.querySelector("#expenseTable tbody")
        const newRow = document.createElement("tr")

        newRow.innerHTML = `
            <td>${expenseName}</td>
            <td>$${expenseAmount.toFixed(2)}</td>
        `

        tableBody.appendChild(newRow)

        const balance = parseFloat(localStorage.getItem("startingBalance"))
        const newBalance = balance - expenseAmount
        localStorage.setItem("startingBalance", newBalance)
        alert(`Remaining Balance: $${newBalance.toFixed(2)}`)
    }
})