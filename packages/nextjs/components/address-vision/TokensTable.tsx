interface Token {
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
  usd_value: number | null;
}

export const TokensTable = ({ tokens }: { tokens: Token[] }) => {
  const formatTokenBalance = (balance: string, decimals: number) => {
    const balanceBigInt = BigInt(balance);
    const divisor = BigInt(Math.pow(10, decimals));
    const integerPart = balanceBigInt / divisor;
    const fractionalPart = balanceBigInt % divisor;
    const formattedFractionalPart = fractionalPart.toString().padStart(decimals, "0").slice(0, 2);

    const integerPartStr = integerPart.toString();

    if (integerPartStr.length > 10) {
      return `${integerPartStr.slice(0, 10)}...`;
    } else {
      return `${integerPartStr}.${formattedFractionalPart}`;
    }
  };

  if (tokens.length === 0) {
    return "No token data.";
  }

  return (
    <div>
      <div className="max-h-48 overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Token</th>
              <th>Balance</th>
              <th>Balance in USD</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <tr key={index}>
                <td>{`${token.name} (${token.symbol})`}</td>
                <td>{formatTokenBalance(token.balance, token.decimals)}</td>
                <td>≈${token.usd_value !== null ? token.usd_value.toFixed(2) : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
