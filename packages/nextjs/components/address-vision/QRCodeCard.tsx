import { QRCodeSVG } from "qrcode.react";
import { Address, isAddress } from "viem";

export const QRCodeCard = ({ someAddress }: { someAddress: Address }) => {
  if (!isAddress(someAddress))
    return (
      <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl">
        <div className="card-body flex items-center justify-center">
          <div className="hidden md:block animate-pulse">
            <div className="h-[350px] w-[350px] bg-slate-300 rounded"></div>
          </div>
          <div className="block md:hidden animate-pulse">
            <div className="h-[250px] w-[250px] bg-slate-300 rounded"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl">
      <div className="card-body flex items-center justify-center">
        {someAddress ? (
          <>
            <div className="hidden md:block">
              <QRCodeSVG value={someAddress} size={350} />
            </div>
            <div className="block md:hidden">
              <QRCodeSVG value={someAddress} size={250} />
            </div>
          </>
        ) : (
          <div>QR code will appear here</div>
        )}
      </div>
    </div>
  );
};
