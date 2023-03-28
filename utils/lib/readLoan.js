import { connectToDatabase } from "./mongodb";

export async function loadLoanData() {
    let response = await fetch(
        "http://localhost:3000/api/read_loan"
    );

    let loans = await response.json();
    console.log(loans);
    return {loans};
}

export async function loadProcessedLoanData() {
    let response = await fetch(
        "http://localhost:3000/api/read_processed_loan"
    );

    let loans = await response.json();
    return {loans};
}