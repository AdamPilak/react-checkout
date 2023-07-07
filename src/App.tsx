import { useState } from "react"
import styles from "./App.module.css"

type Cashier = {
	id: number
	customers: Customer[]
}

type Customer = {
	id: number
	numberOfItems: number
}

type CashierItems = {
	id: number
	numberOfItems: number
}

const defaultCashiers: Cashier[] = [
	{ id: 1, customers: [] },
	{ id: 2, customers: [] },
	{ id: 3, customers: [] },
	{ id: 4, customers: [] },
	{ id: 5, customers: [] },
]

function App() {
	const [value, setValue] = useState("")
	const [cashiers, setCashiers] = useState(defaultCashiers)
	const [customerId, setCustomerId] = useState(5)

	function findPlaceInQueue(e: React.FormEvent) {
		e.preventDefault()

		if (value === "") return

		const everyCashierItems: CashierItems[] = []
		let sumOfItems = 0
		cashiers.forEach(cashier => {
			sumOfItems = cashier.customers.reduce((accumulator, currentValue) => accumulator + currentValue.numberOfItems, 0)
			everyCashierItems.push({ id: cashier.id, numberOfItems: sumOfItems })
			sumOfItems = 0
		})

		const smallestNumberOfItems = findSmallestNumber(everyCashierItems.map(cashier => cashier.numberOfItems))

		const selectedQueueId = everyCashierItems.find(cashier => cashier.numberOfItems === smallestNumberOfItems)?.id

		if (selectedQueueId) addCustomerToQueue(selectedQueueId)
	}

	function addCustomerToQueue(cashierId: number) {
		const newCashiers = cashiers
		const cashier = newCashiers.find(c => c.id === cashierId)
		if (cashier != null) {
			cashier.customers.push({ id: customerId, numberOfItems: parseInt(value) })
			setCashiers([...newCashiers])
			setCustomerId(prev => prev + 1)
			addCountPromise(newCashiers, cashier)
			setValue("")
		}
	}

	function addCountPromise(newCashiers: Cashier[], cashier: Cashier) {
		let interval: number
		new Promise((resolve, reject) => {
			interval = setInterval(() => {
				if (cashier != null) {
					cashier.customers[0].numberOfItems--
					setCashiers([...newCashiers])
					if (cashier.customers[0].numberOfItems <= 0) resolve("")
				} else {
					reject("")
				}
			}, 1000)
		}).then(() => {
			removeCustomerFromQueue(cashier.id)
			clearInterval(interval)
		})
	}

	function removeCustomerFromQueue(cashierId: number) {
		const newCashiers = cashiers
		const cashier = newCashiers.find(c => c.id === cashierId)
		cashier?.customers.shift()
		setCashiers([...cashiers])
	}

	function findSmallestNumber(numbers: number[]): number {
		let smallest = numbers[0]
		numbers.forEach(number => {
			if (number < smallest) {
				smallest = number
			}
		})
		return smallest
	}

	return (
		<div className={styles.container}>
			<form
				onSubmit={findPlaceInQueue}
				className={styles.checkout}
			>
				<input
					value={value}
					onChange={e => setValue(e.target.value)}
					type="number"
					className={styles["checkout-input"]}
				/>
				<button className={styles["checkout-btn"]}>checkout</button>
			</form>
			<div className={styles["checkout-view"]}>
				{cashiers.map(cashier => (
					<div
						key={cashier.id}
						className={styles["checkout-view-col"]}
					>
						<div className={styles.cashier}></div>
						{cashier.customers.map(customer => (
							<div
								key={customer.id}
								className={styles.customer}
							>
								{customer.numberOfItems}
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	)
}

export default App
