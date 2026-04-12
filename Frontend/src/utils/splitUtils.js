export const calculateBalances = (splits) => {
  const validSplits = Array.isArray(splits) ? splits : [];
  const balances = {};
  const allParticipants = new Set();

  validSplits.forEach((split) => {
    const participants = Array.isArray(split.participants) ? split.participants : [];
    const payer = split.paidBy || "";
    const sharePerPerson = Number(split.sharePerPerson || split.sharePerStudent || 0) || 0;

    participants.forEach((participant) => {
      const person = participant?.trim();
      if (!person) return;
      allParticipants.add(person);
      balances[person] = balances[person] || {};
    });

    if (payer) {
      allParticipants.add(payer);
      balances[payer] = balances[payer] || {};
    }

    participants.forEach((participant) => {
      const person = participant?.trim();
      if (!person || person === payer) return;

      balances[person] = balances[person] || {};
      balances[payer] = balances[payer] || {};

      balances[person][payer] = (balances[person][payer] || 0) + sharePerPerson;
      balances[payer][person] = (balances[payer][person] || 0) - sharePerPerson;
    });

    // Subtract payments from balances
    const payments = Array.isArray(split.payments) ? split.payments : [];
    payments.forEach((payment) => {
      const { from, to, amount } = payment;
      const paymentAmount = Number(amount) || 0;
      
      if (paymentAmount > 0 && from && to) {
        // Adjust the balance: reduce what 'from' owes to 'to'
        balances[from] = balances[from] || {};
        balances[to] = balances[to] || {};
        
        balances[from][to] = (balances[from][to] || 0) - paymentAmount;
        balances[to][from] = (balances[to][from] || 0) + paymentAmount;
      }
    });
  });

  const simplifiedBalances = simplifyBalances(balances);

  return {
    balances,
    simplifiedBalances,
    participants: Array.from(allParticipants),
    totalExpenses: validSplits.length,
    totalAmount: validSplits.reduce((sum, split) => sum + (Number(split.totalAmount) || 0), 0),
  };
};

const simplifyBalances = (balances) => {
  const transactions = [];
  let debts = [];

  Object.keys(balances).forEach((from) => {
    Object.keys(balances[from] || {}).forEach((to) => {
      const amount = Number(balances[from][to]) || 0;
      if (amount > 0) {
        debts.push({ from, to, amount });
      }
    });
  });

  debts.sort((a, b) => b.amount - a.amount);

  while (debts.length > 0) {
    const debt = debts.shift();
    const counterIndex = debts.findIndex(
      (d) => d.from === debt.to && d.to === debt.from
    );

    if (counterIndex !== -1) {
      const counter = debts[counterIndex];
      const minAmount = Math.min(debt.amount, counter.amount);
      debt.amount -= minAmount;
      counter.amount -= minAmount;

      if (counter.amount === 0) {
        debts.splice(counterIndex, 1);
      }
      if (debt.amount > 0) {
        debts.unshift(debt);
      }
    } else {
      transactions.push(debt);
      debts = debts
        .map((d) => (d.from === debt.from && d.to === debt.to ? { ...d, amount: 0 } : d))
        .filter((d) => d.amount > 0);
    }
  }

  return transactions;
};

export const getIndividualSummaries = (balances) => {
  const safeBalances = typeof balances === "object" && balances !== null ? balances : {};
  const summaries = {};

  Object.keys(safeBalances).forEach((person) => {
    const personBalances = safeBalances[person] || {};
    let owes = 0;
    let owed = 0;

    Object.keys(personBalances).forEach((other) => {
      const amount = Number(personBalances[other]) || 0;
      if (amount > 0) {
        owes += amount;
      } else if (amount < 0) {
        owed += Math.abs(amount);
      }
    });

    summaries[person] = {
      owes,
      owed,
      net: owed - owes,
      status: owes > owed ? "owes" : owes < owed ? "owed" : "settled",
    };
  });

  return summaries;
};

export const formatCurrency = (amount) => {
  const value = Number(amount) || 0;
  return `${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};
