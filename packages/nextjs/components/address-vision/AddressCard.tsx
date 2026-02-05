import { useState } from "react";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import useSWR from "swr";
import { isAddress } from "viem";
import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useAddressStore } from "~~/services/store/store";
import {
  efpAccountFetcher,
  efpStatsFetcher,
  getBlockExplorerAddressLink,
  getEfpAccountUrl,
  getEfpStatsUrl,
} from "~~/utils/scaffold-eth";

// Simple SVG icons for social platforms (not in heroicons)
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

// Parse description text and convert @something.eth to clickable links
const parseDescriptionWithEnsLinks = (text: string) => {
  const ensPattern = /@([\w-]+\.eth)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = ensPattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add the ENS link
    const ensName = match[1];
    parts.push(
      <a
        key={match.index}
        href={`https://efp.app/${ensName}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        @{ensName}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

export const AddressCard = () => {
  const [addressCopied, setAddressCopied] = useState(false);
  const { resolvedAddress: address } = useAddressStore();

  const shouldFetch = address && isAddress(address);

  const { data: accountData, error: accountError } = useSWR(
    shouldFetch ? getEfpAccountUrl(address) : null,
    efpAccountFetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 60000 },
  );

  const { data: statsData } = useSWR(shouldFetch ? getEfpStatsUrl(address) : null, efpStatsFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  const isLoading = shouldFetch && accountData === undefined && !accountError;

  if (!address || isLoading) {
    return (
      <div className="animate-pulse bg-base-100 w-[370px] md:w-[425px] shadow-xl card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-32 w-32 rounded-full bg-slate-300"></div>
          <div className="flex-1">
            <div className="h-4 w-32 rounded bg-slate-300 mb-2"></div>
            <div className="h-3 w-24 rounded bg-slate-300"></div>
          </div>
        </div>
        <div className="h-3 w-full rounded bg-slate-300 mb-2"></div>
        <div className="h-3 w-3/4 rounded bg-slate-300"></div>
      </div>
    );
  }

  const ensName = accountData?.ens?.name || null;
  const ensAvatar = accountData?.ens?.avatar || null;
  const records = accountData?.ens?.records;
  const description = records?.description;
  const headerImage = records?.header;
  const twitter = records?.["com.twitter"];
  const github = records?.["com.github"];
  const telegram = records?.["org.telegram"];
  const email = records?.email;
  const website = records?.url;
  const contenthash = records?.contenthash;

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const displayName = ensName || shortAddress;
  const blockExplorerLink = getBlockExplorerAddressLink(address);

  const copyAddressButton = (
    <>
      {addressCopied ? (
        <CheckCircleIcon className="w-4 h-4 text-green-500" aria-hidden="true" />
      ) : (
        // @ts-ignore
        <CopyToClipboard
          text={address}
          onCopy={() => {
            setAddressCopied(true);
            setTimeout(() => setAddressCopied(false), 800);
          }}
        >
          <DocumentDuplicateIcon className="w-4 h-4 hover:text-primary link" aria-hidden="true" />
        </CopyToClipboard>
      )}
    </>
  );

  const hasSocialLinks = twitter || github || telegram || email || website || contenthash;

  return (
    <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl overflow-hidden relative">
      {/* Background image overlay */}
      {headerImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url(${headerImage})` }}
        />
      )}

      <div className="card-body relative">
        {/* Avatar and name row */}
        <div className="flex gap-5 items-center">
          <div className="rounded-full shadow-xl">
            <BlockieAvatar address={address} ensImage={ensAvatar} size={116} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold truncate">{displayName}</span>
              <a href={blockExplorerLink} target="_blank" rel="noopener noreferrer">
                <ArrowTopRightOnSquareIcon className="h-5 w-5 hover:text-primary" aria-hidden="true" />
              </a>
            </div>
            {ensName && (
              <div className="text-xs text-slate-500 flex items-center gap-1">
                {shortAddress} {copyAddressButton}
              </div>
            )}
            {!ensName && <div className="flex items-center gap-1">{copyAddressButton}</div>}
          </div>
        </div>

        {/* Bio/Description */}
        {description && <p className="text-sm mt-2 mb-0 line-clamp-6">{parseDescriptionWithEnsLinks(description)}</p>}

        {/* Social links */}
        {hasSocialLinks && (
          <div className="flex items-center gap-3 mt-2">
            {twitter && (
              <a
                href={`https://twitter.com/${twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`@${twitter}`}
              >
                <TwitterIcon className="w-5 h-5 hover:text-primary" />
              </a>
            )}
            {github && (
              <a href={`https://github.com/${github}`} target="_blank" rel="noopener noreferrer" title={github}>
                <GitHubIcon className="w-5 h-5 hover:text-primary" />
              </a>
            )}
            {telegram && (
              <a href={`https://t.me/${telegram}`} target="_blank" rel="noopener noreferrer" title={`@${telegram}`}>
                <TelegramIcon className="w-5 h-5 hover:text-primary" />
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} title={email}>
                <EnvelopeIcon className="w-5 h-5 hover:text-primary" />
              </a>
            )}
            {website && (
              <a href={website} target="_blank" rel="noopener noreferrer" title={website}>
                <GlobeAltIcon className="w-5 h-5 hover:text-primary" />
              </a>
            )}
            {contenthash && ensName && (
              <a
                href={`https://${ensName}.limo`}
                target="_blank"
                rel="noopener noreferrer"
                title="Decentralized website"
              >
                <LinkIcon className="w-5 h-5 hover:text-primary" />
              </a>
            )}
          </div>
        )}

        {/* Follower/Following stats */}
        {statsData && (
          <div className="flex items-center gap-4 mt-2">
            <Link
              href={`https://efp.app/${ensName || address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              <span className="font-semibold">{statsData.followers_count.toLocaleString()}</span>{" "}
              <span className="text-slate-500">followers</span>
            </Link>
            <Link
              href={`https://efp.app/${ensName || address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              <span className="font-semibold">{statsData.following_count.toLocaleString()}</span>{" "}
              <span className="text-slate-500">following</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
