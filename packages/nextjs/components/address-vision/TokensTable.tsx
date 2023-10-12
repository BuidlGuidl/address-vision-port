import { formatEther } from "viem";

interface Token {
  contract_name: string;
  contract_ticker_symbol: string;
  balance: bigint;
  quote: number;
}

export const TokensTable = ({ tokens }: { tokens: Token[] }) => {
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
                  <td>{Number(formatEther(token.balance)).toFixed(2)}</td>
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
