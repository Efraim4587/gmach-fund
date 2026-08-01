export type OperationType = 'DEPOSIT' | 'WITHDRAWAL' | 'FEE_CREDIT';

export interface MemberState {
  memberId: number;
  totalUnits: number;
  totalPrincipal: number;
  commissionRate: number; // e.g., 0.20 for 20%
}

export interface FundState {
  currentUnitPrice: number;
  totalPortfolioValue: number;
  totalFundUnits: number;
}

export interface OperationResult {
  opType: OperationType;
  grossAmount: number;
  netPayment: number;
  feeAmount: number;
  unitsChanged: number;
  principalChange: number;
  profitChange: number;
}

/**
 * Calculates the current Unit Price
 */
export function calculateUnitPrice(totalPortfolioValue: number, totalUnits: number): number {
  if (totalUnits === 0) return 100.00; // Default initial price
  return totalPortfolioValue / totalUnits;
}

/**
 * Processes a Deposit
 */
export function processDeposit(
  amount: number,
  fundState: FundState
): OperationResult {
  const unitsIssued = amount / fundState.currentUnitPrice;

  return {
    opType: 'DEPOSIT',
    grossAmount: amount,
    netPayment: amount,
    feeAmount: 0,
    unitsChanged: unitsIssued,
    principalChange: amount,
    profitChange: 0,
  };
}

/**
 * Processes a Net Withdrawal using the Gross-Up formula for performance fees
 */
export function processNetWithdrawal(
  netAmount: number,
  member: MemberState,
  fundState: FundState
): OperationResult {
  const memberValue = member.totalUnits * fundState.currentUnitPrice;
  const memberProfit = Math.max(0, memberValue - member.totalPrincipal);
  
  let profitRatio = 0;
  let principalRatio = 1;

  if (memberValue > 0) {
    profitRatio = memberProfit / memberValue;
    principalRatio = member.totalPrincipal / memberValue;
  }

  // Calculate Gross Amount (G)
  const grossAmount = netAmount / (1 - (profitRatio * member.commissionRate));

  // Overdraft Safety Guard
  if (grossAmount > memberValue + 0.01) {
    throw new Error(`Overdraft Error: Requested net payout requires gross withdrawal of ${grossAmount.toFixed(2)}, but member balance is only ${memberValue.toFixed(2)}.`);
  }

  const feeAmount = grossAmount - netAmount;
  const unitsDeducted = -grossAmount / fundState.currentUnitPrice;
  const principalChange = -(grossAmount * principalRatio);
  const profitChange = -(grossAmount * profitRatio);

  return {
    opType: 'WITHDRAWAL',
    grossAmount: -grossAmount, // Negative to represent cash outflow
    netPayment: -netAmount,
    feeAmount: feeAmount,
    unitsChanged: unitsDeducted, // Negative units
    principalChange: principalChange,
    profitChange: profitChange,
  };
}

/**
 * Generates the automatic Fee Recycling operation for the Manager (Member 999)
 */
export function processManagerFeeCredit(
  feeAmount: number,
  fundState: FundState
): OperationResult {
  const managerUnits = feeAmount / fundState.currentUnitPrice;

  return {
    opType: 'FEE_CREDIT',
    grossAmount: feeAmount,
    netPayment: 0, // No cash actually moves, it stays in the fund
    feeAmount: 0,
    unitsChanged: managerUnits,
    principalChange: feeAmount, // Manager's principal increases
    profitChange: 0,
  };
}
