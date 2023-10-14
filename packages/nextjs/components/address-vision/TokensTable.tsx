interface Token {
  contract_name: string;
  contract_ticker_symbol: string;
  balance: bigint;
  contract_decimals: number;
  quote: number;
}

export const TokensTable = ({ tokens }: { tokens: Token[] }) => {
  const formatTokenBalance = (balance: bigint, decimals: number) => {
    const divisor = BigInt(Math.pow(10, decimals));
    const integerPart = balance / divisor;
    const fractionalPart = balance % divisor;
    return `${integerPart}.${fractionalPart.toString().padStart(decimals, "0").slice(0, 2)}`;
  };

  return (
    <div>
      {tokens.length > 0 ? (
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
                  <td>{`${token.contract_name} (${token.contract_ticker_symbol})`}</td>
                  <td>{formatTokenBalance(token.balance, token.contract_decimals)}</td>
                  <td>≈${token.quote.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No tokens found.</p>
      )}
    </div>
  );
};
